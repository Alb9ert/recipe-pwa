import { Button } from "../components/shadcn/button";
import { Search, LayoutGrid, LayoutList } from "lucide-react"; // grid & list icons
import { useState } from "react";
import { useRecipes } from "../context/RecipeContext";
import { RecipeCard } from "../components/other/recipeCard";
import { RecipeRow } from "../components/other/recipeRow";

const Home = () => {
  const [search, setSearch] = useState("");
  const [isGrid, setIsGrid] = useState(true);
  const { recipes, loading } = useRecipes();
  const filteredRecipes = recipes.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex justify-center flex-col">
      <h1 className="text-2xl font-semibold mb-2 pt-6">Opskrifter</h1>
      <p className="text-gray-600 mb-4">Her kommer listen over alle jeres opskrifter.</p>

      <div className="flex justify-center">
        <div className="w-full max-w-[560px] flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Søg opskrifter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                h-10
                w-full
                rounded-xl
                border
                border-input
                bg-card
                pl-10
                pr-3
                text-sm
                text-card-foreground
                placeholder:text-muted-foreground
                focus:outline-none
                focus:ring-black-500
              "
            />
          </div>

          <div className="flex gap-x-2 ml-2">
            <Button
              variant="outline"
              onClick={() => setIsGrid(true)}
              aria-pressed={isGrid}
              className={`p-2 rounded-xl  ${isGrid ? "bg-gray-200" : ""}`}
            >
              <LayoutGrid className="h-5 w-5 text-card-foreground" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsGrid(false)}
              aria-pressed={!isGrid}
              className={`p-2 rounded-xl ${!isGrid ? "bg-gray-200" : ""}`}
            >
              <LayoutList className="h-5 w-5 text-card-foreground" />
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-4 text-center text-muted-foreground">Henter opskrifter…</div>
      ) : (
        <div className="flex justify-center">
          <section
            className={
              isGrid
                ? "w-full max-w-[560px] grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-6"
                : "w-full max-w-[560px] flex flex-col gap-1 mt-6"
            }
          >
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map((r) => {
                return isGrid ? (
                  <RecipeCard
                    key={r._id ?? r.title}
                    recipeId={r._id}
                    title={r.title}
                    image={r.imageUrl}
                    nikoRating={r.nikoRating}
                    albertRating={r.albertRating}
                    tags={r.tags}
                  />
                ) : (
                  <RecipeRow key={r._id ?? r.title} recipeId={r._id} title={r.title} nikoRating={r.nikoRating} albertRating={r.albertRating} />
                );
              })
            ) : (
              <div className="text-muted-foreground px-4">Ingen opskrifter matchede din søgning.</div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default Home;
