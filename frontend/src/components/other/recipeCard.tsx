import { ShoppingCart, Star, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Button } from "../../components/shadcn/button";
import { useShoppingList } from "../../context/ShoppingListContext";

export interface RecipeCardProps {
  title: string;
  image?: string;
  nikoRating?: number;
  albertRating?: number;
  tags?: string[];
  onAddToCart?: () => void;
  recipeId?: string;
}

export function RecipeCard({ title, image, nikoRating, albertRating, tags = [], onAddToCart, recipeId }: RecipeCardProps) {
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
    onAddToCart?.();
  }

  function handleCardClick() {
    if (recipeId) {
      navigate(`/opskrift/${recipeId}`);
    }
  }

  return (
    <article
      onClick={handleCardClick}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm",
        "transition-all duration-300 ease-out",
        "active:scale-[0.98]",
        "hover:shadow-lg hover:-translate-y-1",
        "cursor-pointer",
      )}
    >
      {/* Image Section */}
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-muted">
        {(() => {
          const defaultImg = "https://w0.peakpx.com/wallpaper/528/1009/HD-wallpaper-olive-oil-fruit-food-nature.jpg";
          const imgSrc = image || defaultImg;
          const imgAlt = image ? title : defaultImg;
          return (
            <img src={imgSrc} alt={imgAlt} className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" />
          );
        })()}

        {/* Tags overlay in top right */}
        {tags.length > 0 && (
          <div className="absolute top-2 right-2 flex flex-wrap gap-1 justify-end">
            {tags.slice(0, 2).map((tag) => (
              <span key={tag} className="inline-block px-2 py-1 bg-col-primary text-white text-xs rounded-full font-medium shadow-md">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Warm overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        {/* Individual ratings */}
        {(typeof albertRating === "number" && albertRating > 0) || (typeof nikoRating === "number" && nikoRating > 0) ? (
          <div className="flex items-center gap-3 text-sm">
            {typeof albertRating === "number" && albertRating > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground" aria-label={`Alberts rating: ${albertRating}`}>
                <Star className={cn("size-4", albertRating >= 1 ? "fill-col-primary text-col-primary" : "fill-transparent text-border")} />
                <span className="font-medium">Albert</span>
                <span className="text-muted-foreground">{albertRating.toFixed(1)}</span>
              </div>
            )}

            {typeof nikoRating === "number" && nikoRating > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground" aria-label={`Nikolines rating: ${nikoRating}`}>
                <Star className={cn("size-4", nikoRating >= 1 ? "fill-col-primary text-col-primary" : "fill-transparent text-border")} />
                <span className="font-medium">Niko</span>
                <span className="text-muted-foreground">{nikoRating.toFixed(1)}</span>
              </div>
            )}
          </div>
        ) : null}

        {/* Title */}
        <h3 className="font-serif text-base leading-snug text-card-foreground text-pretty">{title}</h3>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Add to Cart Button - min 40px touch target */}
        <Button
          onClick={handleAddToCart}
          disabled={isAdded}
          variant={isAdded ? "secondary" : "default"}
          className={cn(
            "w-full gap-2 rounded-lg min-h-[40px] text-sm transition-all duration-200 select-none",
            "active:scale-[0.97]",
            isAdded && "bg-accent text-accent-foreground",
          )}
          aria-label={isAdded ? `${title} tilføjet til indkøb` : `Tilføj ${title} ingredienser til indkøb`}
        >
          {isAdded ? (
            <>
              <Check className="size-5" />
              <span>Tilføjet</span>
            </>
          ) : (
            <>
              <ShoppingCart className="size-5" />
              <span>Tilføj</span>
            </>
          )}
        </Button>
      </div>
    </article>
  );
}
