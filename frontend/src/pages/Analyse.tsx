import { useRecipes } from "../context/RecipeContext";
import { Star } from "lucide-react";

const Analyse = () => {
  const { recipes } = useRecipes();

  // Total recipes count
  const totalRecipes = recipes.length;

  // Top rated overall (average of both ratings)
  const topRatedOverall = recipes
    .filter((r) => r.nikoRating > 0 || r.albertRating > 0)
    .sort((a, b) => {
      const avgA = (a.nikoRating + a.albertRating) / 2;
      const avgB = (b.nikoRating + b.albertRating) / 2;
      return avgB - avgA;
    })
    .slice(0, 3);

  // Top 3 by Albert
  const topAlbert = recipes
    .filter((r) => r.albertRating > 0)
    .sort((a, b) => b.albertRating - a.albertRating)
    .slice(0, 3);

  // Top 3 by Niko
  const topNiko = recipes
    .filter((r) => r.nikoRating > 0)
    .sort((a, b) => b.nikoRating - a.nikoRating)
    .slice(0, 3);

  // Most disagreed (largest difference between ratings)
  const mostDisagreed = recipes
    .filter((r) => r.nikoRating > 0 && r.albertRating > 0)
    .sort((a, b) => {
      const diffA = Math.abs(a.nikoRating - a.albertRating);
      const diffB = Math.abs(b.nikoRating - b.albertRating);
      return diffB - diffA;
    })
    .slice(0, 3);

  // Latest recipes (assuming createdAt exists)
  const latestRecipes = [...recipes]
    .sort((a, b) => {
      const dateA = (a as any).createdAt ? new Date((a as any).createdAt).getTime() : 0;
      const dateB = (b as any).createdAt ? new Date((b as any).createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1">
      <Star className="w-4 h-4 fill-col-primary text-col-primary" />
      <span className="text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );

  const RecipeItem = ({
    title,
    rating1,
    label1,
    rating2,
    label2,
  }: {
    title: string;
    rating1?: number;
    label1?: string;
    rating2?: number;
    label2?: string;
  }) => (
    <div className="p-3 bg-card border border-border rounded-lg hover:bg-accent/50 transition-colors">
      <p className="font-medium text-sm text-card-foreground mb-2 truncate">{title}</p>
      <div className="flex gap-3">
        {rating1 !== undefined && label1 && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">{label1}</span>
            <RatingStars rating={rating1} />
          </div>
        )}
        {rating2 !== undefined && label2 && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">{label2}</span>
            <RatingStars rating={rating2} />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="pb-24 pt-6 px-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Analyse</h1>
      <p className="text-muted-foreground mb-8">Se statistik over jeres madlavning og bedømmelser</p>

      {/* Total Recipes */}
      <div className="mb-8 p-6 bg-gradient-to-br from-col-primary/10 to-col-primary/5 border border-col-primary/20 rounded-xl text-center">
        <p className="text-muted-foreground text-sm mb-2">Samlede opskrifter</p>
        <p className="text-5xl font-bold text-col-primary">{totalRecipes}</p>
      </div>

      {/* Top Rated Overall */}
      {topRatedOverall.length > 0 && (
        <div className="mb-8 p-4 bg-gradient-to-br from-blue-50/50 to-blue-50/20 dark:from-blue-900/10 dark:to-blue-900/5 border border-blue-200/30 dark:border-blue-800/30 rounded-xl">
          <h2 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">Bedst bedømt samlet set</h2>
          <div className="space-y-2">
            {topRatedOverall.map((recipe, idx) => (
              <RecipeItem
                key={recipe._id}
                title={`${idx + 1}. ${recipe.title}`}
                rating1={recipe.albertRating}
                label1="Albert"
                rating2={recipe.nikoRating}
                label2="Niko"
              />
            ))}
          </div>
        </div>
      )}

      {/* Top 3 Albert */}
      {topAlbert.length > 0 && (
        <div className="mb-8 p-4 bg-gradient-to-br from-amber-50/50 to-amber-50/20 dark:from-amber-900/10 dark:to-amber-900/5 border border-amber-200/30 dark:border-amber-800/30 rounded-xl">
          <h2 className="text-lg font-semibold mb-3 text-amber-900 dark:text-amber-100">Alberts favoritter</h2>
          <div className="space-y-2">
            {topAlbert.map((recipe, idx) => (
              <RecipeItem key={recipe._id} title={`${idx + 1}. ${recipe.title}`} rating1={recipe.albertRating} label1="Albert" />
            ))}
          </div>
        </div>
      )}

      {/* Top 3 Niko */}
      {topNiko.length > 0 && (
        <div className="mb-8 p-4 bg-gradient-to-br from-green-50/50 to-green-50/20 dark:from-green-900/10 dark:to-green-900/5 border border-green-200/30 dark:border-green-800/30 rounded-xl">
          <h2 className="text-lg font-semibold mb-3 text-green-900 dark:text-green-100">Nikolines favoritter</h2>
          <div className="space-y-2">
            {topNiko.map((recipe, idx) => (
              <RecipeItem key={recipe._id} title={`${idx + 1}. ${recipe.title}`} rating1={recipe.nikoRating} label1="Niko" />
            ))}
          </div>
        </div>
      )}

      {/* Most Disagreed */}
      {mostDisagreed.length > 0 && (
        <div className="mb-8 p-4 bg-gradient-to-br from-orange-50/50 to-orange-50/20 dark:from-orange-900/10 dark:to-orange-900/5 border border-orange-200/30 dark:border-orange-800/30 rounded-xl">
          <h2 className="text-lg font-semibold mb-3 text-orange-900 dark:text-orange-100">Mest uenig om</h2>
          <div className="space-y-2">
            {mostDisagreed.map((recipe, idx) => (
              <RecipeItem
                key={recipe._id}
                title={`${idx + 1}. ${recipe.title}`}
                rating1={recipe.albertRating}
                label1="Albert"
                rating2={recipe.nikoRating}
                label2="Niko"
              />
            ))}
          </div>
        </div>
      )}

      {/* Latest Recipes */}
      {latestRecipes.length > 0 && (
        <div className="mb-8 p-4 bg-gradient-to-br from-purple-50/50 to-purple-50/20 dark:from-purple-900/10 dark:to-purple-900/5 border border-purple-200/30 dark:border-purple-800/30 rounded-xl">
          <h2 className="text-lg font-semibold mb-3 text-purple-900 dark:text-purple-100">Senest tilføjet</h2>
          <div className="space-y-2">
            {latestRecipes.map((recipe) => (
              <div key={recipe._id} className="p-3 bg-card border border-border rounded-lg hover:bg-accent/50 transition-colors">
                <p className="font-medium text-sm text-card-foreground">{recipe.title}</p>
                {(recipe as any).createdAt && (
                  <p className="text-xs text-muted-foreground mt-1">{new Date((recipe as any).createdAt).toLocaleDateString("da-DK")}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analyse;
