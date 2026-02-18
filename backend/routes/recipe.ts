import { Router, type Request, type Response } from "express";
import Recipe from "../models/recipeModel.js";
import Ingredient from "../models/ingredientModel.js";

const router = Router();

async function syncIngredients(ingredients: Array<{ name: string; unit?: string }>) {
  if (!ingredients || ingredients.length === 0) return;

  const ops = ingredients.map((ing) => {
    const name = ing.name.trim();
    if (!name) return null;

    const unit = ing.unit?.trim() || undefined;

    return Ingredient.updateOne({ name }, { $setOnInsert: { name, unit } }, { upsert: true }).exec();
  });

  await Promise.all(ops.filter(Boolean) as Promise<unknown>[]);
}

// Health check
router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "API is running" });
});

// Get all recipes
router.get("/recipes", async (req: Request, res: Response) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 }).lean();
    res.status(200).json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch recipes" });
  }
});

// Get all ingredients
router.get("/ingredients", async (req: Request, res: Response) => {
  try {
    const ingredients = await Ingredient.find().sort({ name: 1 }).lean();
    res.status(200).json(ingredients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch ingredients" });
  }
});

// Create new recipe
router.post("/recipes", async (req: Request, res: Response) => {
  try {
    const { title, imageUrl, ingredients, steps, tags, nikoRating, albertRating } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const existing = await Recipe.findOne({ title });
    if (existing) {
      return res.status(409).json({ message: "Recipe with this title already exists" });
    }

    await syncIngredients(ingredients || []);

    const recipe = await Recipe.create({
      title,
      imageUrl,
      ingredients,
      steps,
      tags,
      nikoRating,
      albertRating,
    });

    res.status(201).json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create recipe" });
  }
});

// Update existing recipe by ID (overwrite with provided changes)
router.put("/recipes/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body as {
      imageUrl?: string;
      ingredients?: Array<{ name: string; amount: number; unit: string }>;
      steps?: string[];
      tags?: string[];
      nikoRating?: number;
      albertRating?: number;
    };

    if (updates.ingredients) {
      await syncIngredients(updates.ingredients);
    }

    const updated = await Recipe.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update recipe" });
  }
});

// Delete recipe by ID
router.delete("/recipes/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await Recipe.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json({ message: "Recipe deleted successfully", recipe: deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete recipe" });
  }
});

export default router;
