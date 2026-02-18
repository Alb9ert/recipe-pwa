import { Link, useLocation } from "react-router-dom";
import { BookOpen, ShoppingCart, Plus, BarChart3 } from "lucide-react";
import { cn } from "../../lib/utils";
import { useShoppingList } from "../../context/ShoppingListContext";

const navItems = [
  { href: "/", label: "Opskrifter", icon: BookOpen },
  { href: "/tilfoej", label: "Tilføj", icon: Plus },
  { href: "/indkoeb", label: "Indkøb", icon: ShoppingCart },
  { href: "/analyse", label: "Analyse", icon: BarChart3 },
];

export function BottomNav() {
  const location = useLocation();
  const { count } = useShoppingList();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E3DDD4] backdrop-blur-sm bg-white/95">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? location.pathname === "/" : location.pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 px-4 py-1.5 text-xs transition-colors",
                isActive ? "font-medium" : "text-muted-foreground",
              )}
              style={isActive ? { color: "#B45A2B" } : undefined}
            >
              <Icon
                className="h-5 w-5 transition-all"
                style={{
                  stroke: isActive ? "#B45A2B" : "#7A6B5A",
                  strokeWidth: isActive ? 2.5 : 2,
                }}
              />

              <span>{item.label}</span>

              {item.href === "/indkoeb" && count > 0 && (
                <span className="absolute -top-0.5 right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-col-primary px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
