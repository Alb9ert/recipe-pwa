import React, { createContext, useContext, useEffect, useState } from "react";

type ShoppingListContextType = {
  items: string[]; // recipe ids
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
  count: number;
};

const ShoppingListContext = createContext<ShoppingListContextType | null>(null);

const STORAGE_KEY = "rp_shopping_list";

export const ShoppingListProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const add = (id: string) => setItems((prev) => (prev.includes(id) ? prev : [...prev, id]));
  const remove = (id: string) => setItems((prev) => prev.filter((i) => i !== id));
  const clear = () => setItems([]);
  const has = (id: string) => items.includes(id);

  const value: ShoppingListContextType = {
    items,
    add,
    remove,
    clear,
    has,
    count: items.length,
  };

  return <ShoppingListContext.Provider value={value}>{children}</ShoppingListContext.Provider>;
};

export const useShoppingList = () => {
  const ctx = useContext(ShoppingListContext);
  if (!ctx) throw new Error("useShoppingList must be used within ShoppingListProvider");
  return ctx;
};

export default ShoppingListProvider;
