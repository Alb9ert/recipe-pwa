import { Star, ShoppingCart, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Button } from "../shadcn/button";
import { useShoppingList } from "../../context/ShoppingListContext";

export interface RecipeRowProps {
  title: string;
  nikoRating?: number;
  albertRating?: number;
  recipeId?: string;
}

export function RecipeRow({ title, nikoRating, albertRating, recipeId }: RecipeRowProps) {
  const navigate = useNavigate();
  const { add, has } = useShoppingList();

  const isAdded = Boolean(recipeId && has(String(recipeId)));

  function handleAddToCart(e: React.MouseEvent) {
    e.stopPropagation();
    if (!recipeId) return;
    if (isAdded) return;
    try {
      add(String(recipeId));
    } catch {}
  }

  function handleRowClick() {
    if (recipeId) {
      navigate(`/opskrift/${recipeId}`);
    }
  }

  return (
    <div
      onClick={handleRowClick}
      className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors cursor-pointer"
    >
      {/* Title and Ratings */}
      <div className="flex-1 min-w-0 flex items-center gap-3">
        <h3 className="font-medium text-sm text-card-foreground truncate">{title}</h3>

        {/* Ratings */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {typeof albertRating === "number" && albertRating > 0 && (
            <div className="flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-col-primary text-col-primary" />
              <span className="text-xs text-muted-foreground">{albertRating.toFixed(1)}</span>
            </div>
          )}
          {typeof nikoRating === "number" && nikoRating > 0 && (
            <div className="flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-col-primary text-col-primary" />
              <span className="text-xs text-muted-foreground">{nikoRating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={isAdded}
        size="sm"
        className={cn(
          "flex-shrink-0 gap-1 h-8 px-2 text-xs rounded-md transition-all",
          isAdded ? "bg-gray-400 text-white cursor-not-allowed" : "bg-col-primary hover:bg-col-primary/90 text-white",
        )}
      >
        {isAdded ? (
          <>
            <Check className="w-3 h-3" />
            <span className="hidden sm:inline">Tilføjet</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-3 h-3" />
            <span className="hidden sm:inline">Tilføj</span>
          </>
        )}
      </Button>
    </div>
  );
}
