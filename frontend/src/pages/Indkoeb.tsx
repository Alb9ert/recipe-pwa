import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { useShoppingList } from "../context/ShoppingListContext";
import { useRecipes } from "../context/RecipeContext";
import { Button } from "../components/shadcn/button";
import { cn } from "../lib/utils";

const Indkoeb = () => {
  const { items, remove, clear } = useShoppingList();
  const { recipes } = useRecipes();
  const safeRecipes = Array.isArray(recipes) ? recipes : [];
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(new Set());

  // Get recipes that are in the shopping list
  const addedRecipes = safeRecipes.filter((recipe) => items.includes(recipe._id || ""));

  // Aggregate all ingredients from added recipes
  const allIngredients = addedRecipes.flatMap((recipe) =>
    recipe.ingredients.map((ing) => ({
      name: ing.name,
      amount: ing.amount,
      unit: ing.unit,
      recipeId: recipe._id,
      key: `${ing.name}-${ing.unit}`, // for aggregating duplicates
    })),
  );

  // Group ingredients by name + unit
  const groupedIngredients = Array.from(
    allIngredients
      .reduce((map, ing) => {
        const existing = map.get(ing.key) || { name: ing.name, amount: 0, unit: ing.unit, key: ing.key };
        existing.amount += ing.amount;
        map.set(ing.key, existing);
        return map;
      }, new Map<string, { name: string; amount: number; unit: string; key: string }>())
      .values(),
  );

  const toggleIngredient = (key: string) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(key)) {
      newChecked.delete(key);
    } else {
      newChecked.add(key);
    }
    setCheckedIngredients(newChecked);
  };

  return (
    <div className="pb-24 pt-6 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Indkøb</h1>
        <p className="text-muted-foreground">
          {items.length === 0 ? "Ingen opskrifter tilføjet endnu" : `${items.length} opskrift${items.length === 1 ? "" : "er"} tilføjet`}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-2">Din indkøbsliste er tom</p>
          <p className="text-sm text-muted-foreground">Tilføj opskrifter fra "Opskrifter" siden</p>
        </div>
      ) : (
        <>
          {/* Section 1: Added Recipes */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Opskrifter</h2>
            <div className="space-y-2">
              {addedRecipes.map((recipe) => (
                <div
                  key={recipe._id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                >
                  <span className="font-medium text-sm">{recipe.title}</span>
                  <button
                    onClick={() => remove(recipe._id || "")}
                    className="p-1 hover:bg-destructive/10 rounded transition-colors"
                    aria-label="Fjern opskrift"
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Ingredients Checklist */}
          {groupedIngredients.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">Ingredienser</h2>
              <div className="space-y-2">
                {groupedIngredients.map((ing) => (
                  <label
                    key={ing.key}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checkedIngredients.has(ing.key)}
                      onChange={() => toggleIngredient(ing.key)}
                      className="w-4 h-4 rounded accent-col-primary"
                    />
                    <span
                      className={cn(
                        "flex-1 text-sm transition-colors",
                        checkedIngredients.has(ing.key) ? "line-through text-muted-foreground" : "text-card-foreground",
                      )}
                    >
                      {ing.amount > 0 && <span className="font-medium">{ing.amount}</span>}{" "}
                      {ing.unit && <span className="text-muted-foreground">{ing.unit}</span>}
                      {ing.amount > 0 || ing.unit ? " " : ""}
                      {ing.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Clear All Button */}
          <div className="fixed bottom-20 left-0 right-0 px-4 py-3 bg-background border-t border-border">
            <Button onClick={clear} className="w-full gap-2 bg-col-primary hover:bg-col-primary/90 text-white">
              <Trash2 className="w-4 h-4" />
              Tøm indkøbslisten
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Indkoeb;
