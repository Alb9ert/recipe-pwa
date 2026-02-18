import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g. "spaghetti"
    unit: { type: String }, // e.g. "g", "ml", "stk" (optional)
  },
  { timestamps: true },
);

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

export default Ingredient;

