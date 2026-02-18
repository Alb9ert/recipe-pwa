import mongoose from "mongoose";

// Embedded ingredient used inside a recipe.
// Each ingredient is measured for 2 people by default.
const recipeIngredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    unit: { type: String, required: true }, // e.g. "g", "ml", "stk"
  },
  { _id: false },
);

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    imageUrl: { type: String }, // optional image for the recipe
    ingredients: { type: [recipeIngredientSchema], default: [] },
    steps: { type: [String], default: [] }, // optional step-by-step instructions
    tags: { type: [String], default: [] }, // optional, e.g. "pasta", "vegetar"
    nikoRating: { type: Number, default: 0 },
    albertRating: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;

