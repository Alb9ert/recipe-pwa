import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Edit, Trash2 } from "lucide-react";
import { useRecipes } from "../context/RecipeContext";
import { useShoppingList } from "../context/ShoppingListContext";
import { Button } from "../components/shadcn/button";
import { cn } from "../lib/utils";

const RecipeDetail = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  const { recipes, deleteRecipe } = useRecipes();
  const { add, has } = useShoppingList();
  const [isDeleting, setIsDeleting] = useState(false);

  const recipe = recipes.find((r) => r._id === recipeId);

  const handleDelete = async () => {
    if (!recipeId) return;

    const confirmed = window.confirm(`Er du sikker på at du vil slette "${recipe?.title}"?`);
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await deleteRecipe(recipeId);
      navigate("/");
    } catch (err) {
      alert("Kunne ikke slette opskriften");
      setIsDeleting(false);
    }
  };

  if (!recipe) {
    return (
      <div className="pb-24 pt-6 px-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-col-primary hover:text-col-primary/80 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Tilbage</span>
        </button>
        <p className="text-center text-muted-foreground py-12">Opskrift ikke fundet</p>
      </div>
    );
  }

  const isAdded = Boolean(recipeId && has(recipeId));

  const handleAddToCart = () => {
    if (!isAdded && recipeId) {
      add(recipeId);
    }
  };

  const defaultImg = "https://w0.peakpx.com/wallpaper/528/1009/HD-wallpaper-olive-oil-fruit-food-nature.jpg";
  const imgSrc = recipe.imageUrl || defaultImg;
  const imgAlt = recipe.imageUrl ? recipe.title : defaultImg;

  return (
    <div className="pb-24 pt-6 px-4 max-w-2xl mx-auto">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-col-primary hover:text-col-primary/80 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Tilbage</span>
      </button>

      {/* Image */}
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl mb-6 bg-muted">
        <img src={imgSrc} alt={imgAlt} className="w-full h-full object-cover" />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-3">{recipe.title}</h1>

      {/* Created Date */}
      {(recipe as any).createdAt && (
        <p className="text-xs text-muted-foreground mb-4">Tilføjet {new Date((recipe as any).createdAt).toLocaleDateString("da-DK")}</p>
      )}

      {/* Ratings */}
      {(recipe.nikoRating > 0 || recipe.albertRating > 0) && (
        <div className="flex gap-4 mb-6">
          {recipe.albertRating > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-col-primary text-col-primary" />
                <span className="font-medium text-sm">Albert</span>
              </div>
              <span className="text-sm text-muted-foreground">{recipe.albertRating.toFixed(1)}</span>
            </div>
          )}
          {recipe.nikoRating > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-col-primary text-col-primary" />
                <span className="font-medium text-sm">Niko</span>
              </div>
              <span className="text-sm text-muted-foreground">{recipe.nikoRating.toFixed(1)}</span>
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {recipe.tags.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          {recipe.tags.map((tag) => (
            <span key={tag} className="inline-block px-3 py-1 bg-accent text-accent-foreground text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Ingredients Section */}
      {recipe.ingredients.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Ingredienser</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ing, idx) => (
              <li key={idx} className="flex items-baseline gap-2 text-card-foreground">
                <span className="text-col-primary">•</span>
                <span>
                  {ing.amount > 0 && <span className="font-medium">{ing.amount}</span>} {ing.unit && <span>{ing.unit}</span>}
                  {ing.amount > 0 || ing.unit ? " " : ""}
                  {ing.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Instructions Section */}
      {recipe.steps.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Fremgangsmåde</h2>
          <ol className="space-y-3">
            {recipe.steps.map((step, idx) => (
              <li key={idx} className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-col-primary text-white text-sm flex items-center justify-center font-medium">
                  {idx + 1}
                </div>
                <p className="text-card-foreground pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 mt-20">
        <Button onClick={() => navigate(`/rediger/${recipeId}`)} variant="outline" className="gap-2">
          <Edit className="w-4 h-4" />
          <span>Rediger</span>
        </Button>
        <Button
          onClick={handleDelete}
          disabled={isDeleting}
          variant="outline"
          className="gap-2 text-destructive hover:text-destructive disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          <span>{isDeleting ? "Sletter..." : "Slet"}</span>
        </Button>
      </div>
      {/* Add to Shopping List Button */}
      <div className="fixed bottom-20 left-0 right-0 px-4 py-3 bg-background border-t border-border space-y-2">
        <Button
          onClick={handleAddToCart}
          disabled={isAdded}
          className={cn("w-full", isAdded ? "bg-gray-400 text-white cursor-not-allowed" : "bg-col-primary hover:bg-col-primary/90 text-white")}
        >
          {isAdded ? "Tilføjet til indkøbslisten" : "Tilføj til indkøbslisten"}
        </Button>
      </div>
    </div>
  );
};

export default RecipeDetail;
