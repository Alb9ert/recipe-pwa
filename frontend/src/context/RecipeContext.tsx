import api from "../config/api";

import { createContext, useContext, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

export type Ingredient = {
  _id?: string;
  name: string;
  unit?: string;
};

export type RecipeIngredient = {
  name: string;
  amount: number;
  unit: string;
};

export type Recipe = {
  _id?: string;
  title: string;
  imageUrl?: string;
  ingredients: RecipeIngredient[];
  steps: string[];
  tags: string[];
  nikoRating: number;
  albertRating: number;
};

type RecipeContextType = {
  recipes: Recipe[];
  ingredients: Ingredient[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  createRecipe: (payload: Partial<Recipe>) => Promise<Recipe>;
  updateRecipe: (id: string, payload: Partial<Recipe>) => Promise<Recipe>;
  deleteRecipe: (id: string) => Promise<void>;
};

const RecipeContext = createContext<RecipeContextType | null>(null);

export const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["recipes-and-ingredients"],
    queryFn: async () => {
      const [recipesRes, ingredientsRes] = await Promise.all([api.get<Recipe[]>("/recipes"), api.get<Ingredient[]>("/ingredients")]);
      return {
        recipes: recipesRes.data,
        ingredients: ingredientsRes.data,
      };
    },
  });

  return (
    <RecipeContext.Provider
      value={{
        recipes: data?.recipes ?? [],
        ingredients: data?.ingredients ?? [],
        loading: isLoading,
        error: error ? "Kunne ikke hente opskrifter og ingredienser" : null,
        refresh: () => {
          void refetch();
        },
        createRecipe: async (payload: Partial<Recipe>) => {
          const res = await api.post<Recipe>("/recipes", payload);
          // Refresh local cache after successful creation
          void refetch();
          return res.data;
        },
        updateRecipe: async (id: string, payload: Partial<Recipe>) => {
          const res = await api.put<Recipe>(`/recipes/${id}`, payload);
          // Refresh local cache after successful update
          void refetch();
          return res.data;
        },
        deleteRecipe: async (id: string) => {
          await api.delete(`/recipes/${id}`);
          // Refresh local cache after successful deletion
          void refetch();
        },
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => {
  const ctx = useContext(RecipeContext);
  if (!ctx) {
    throw new Error("useRecipes must be used within RecipeProvider");
  }
  return ctx;
};
