import { useState } from "react";
import { X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "../components/shadcn/button";
import { useRecipes } from "../context/RecipeContext";

const UNIT_OPTIONS = ["g", "kg", "ml", "l", "stk", "tsk", "spsk", "dl", "pose", "glas", "other"];
const emptyIngredient = { name: "", amount: 0, unit: "stk", unitOther: "" };

const Tilfoej = () => {
  const { recipeId: paramRecipeId } = useParams<{ recipeId?: string }>();
  const navigate = useNavigate();
  const { createRecipe, updateRecipe, ingredients: knownIngredients, recipes } = useRecipes();
  const isEditMode = Boolean(paramRecipeId);
  const recipeToEdit = isEditMode ? recipes.find((r) => r._id === paramRecipeId) : null;

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [nikoRating, setNikoRating] = useState<number | "">("");
  const [albertRating, setAlbertRating] = useState<number | "">("");
  const [ingredients, setIngredients] = useState([emptyIngredient]);
  const [steps, setSteps] = useState<string[]>([""]);
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Populate form when editing
  useEffect(() => {
    if (recipeToEdit) {
      setTitle(recipeToEdit.title);
      setImageUrl(recipeToEdit.imageUrl || "");
      setNikoRating(recipeToEdit.nikoRating || "");
      setAlbertRating(recipeToEdit.albertRating || "");
      setIngredients(
        recipeToEdit.ingredients.length > 0
          ? recipeToEdit.ingredients.map((ing) => ({
              name: ing.name,
              amount: ing.amount,
              unit: ing.unit === "other" ? "other" : ing.unit,
              unitOther: ing.unit === "other" ? ing.unit : "",
            }))
          : [emptyIngredient],
      );
      setSteps(recipeToEdit.steps.length > 0 ? recipeToEdit.steps : [""]);
      setSelectedTag(recipeToEdit.tags[0] || "");
    }
  }, [recipeToEdit]);

  function updateIngredient(idx: number, patch: Partial<typeof emptyIngredient>) {
    setIngredients((prev) => prev.map((ing, i) => (i === idx ? { ...ing, ...patch } : ing)));
  }

  function addIngredient() {
    setIngredients((prev) => [...prev, emptyIngredient]);
  }

  function removeIngredient(idx: number) {
    setIngredients((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== idx)));
  }

  function updateStep(idx: number, value: string) {
    setSteps((prev) => prev.map((s, i) => (i === idx ? value : s)));
  }

  function addStep() {
    setSteps((prev) => [...prev, ""]);
  }

  function removeStep(idx: number) {
    setSteps((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== idx)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim()) {
      setError("Titel er påkrævet");
      return;
    }

    const cleanedIngredients = ingredients
      .map((ing) => {
        const unit = ing.unit === "other" ? (ing.unitOther || "").trim() : String(ing.unit || "").trim();
        return { name: String(ing.name || "").trim(), amount: Math.max(1, Number(ing.amount) || 1), unit };
      })
      .filter((ing) => ing.name.length > 0 && ing.unit.length > 0);

    if (cleanedIngredients.length === 0) {
      setError("Mindst én ingrediens er nødvendig");
      return;
    }

    const cleanedSteps = steps.map((s) => s.trim()).filter((s) => s.length > 0);
    const tagsArray = selectedTag ? [selectedTag.trim()] : [];

    const payload: any = {
      title: title.trim(),
      imageUrl: imageUrl.trim() || undefined,
      ingredients: cleanedIngredients,
      steps: cleanedSteps,
      tags: tagsArray,
    };

    if (nikoRating !== "") payload.nikoRating = Number(nikoRating);
    if (albertRating !== "") payload.albertRating = Number(albertRating);

    try {
      setLoading(true);
      if (isEditMode && paramRecipeId) {
        await updateRecipe(paramRecipeId, payload);
        setSuccess("Opskrift opdateret");
        setTimeout(() => {
          navigate(`/opskrift/${paramRecipeId}`);
        }, 1500);
      } else {
        await createRecipe(payload);
        setSuccess("Opskrift oprettet");
        // reset form
        setTitle("");
        setImageUrl("");
        setIngredients([emptyIngredient]);
        setSteps([""]);
        setSelectedTag("");
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(isEditMode ? "Kunne ikke opdatere opskrift" : "Kunne ikke oprette opskrift");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pb-32 pt-6 px-4 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-2xl font-semibold mb-2">{isEditMode ? "Rediger opskrift" : "Tilføj opskrift"}</h1>
      <p className="text-gray-600 mb-4">
        {isEditMode ? "Opdater de oplysninger, du gerne vil ændre." : "Udfyld formularen for at oprette en ny opskrift i systemet."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Titel</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-input bg-card px-3 py-2 focus:outline-none focus:ring-0 focus:border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Billede URL (valgfri)</label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full rounded-xl border border-input bg-card px-3 py-2 focus:outline-none focus:ring-0 focus:border-gray-300"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">Nikos rating (valgfri)</label>
            <input
              type="number"
              min={0}
              max={5}
              step={0.1}
              value={nikoRating}
              onChange={(e) => setNikoRating(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full rounded-xl border border-input bg-card px-3 py-2 focus:outline-none focus:ring-0 focus:border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Alberts rating (valgfri)</label>
            <input
              type="number"
              min={0}
              max={5}
              step={0.1}
              value={albertRating}
              onChange={(e) => setAlbertRating(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full rounded-xl border border-input bg-card px-3 py-2 focus:outline-none focus:ring-0 focus:border-gray-300"
            />
          </div>
        </div>

        <fieldset className="space-y-3">
          <legend className="font-medium">Ingredienser</legend>
          <datalist id="known-ingredients">
            {(Array.isArray(knownIngredients) ? knownIngredients : []).map((ki) => (
              <option key={ki._id ?? ki.name} value={ki.name} />
            ))}
          </datalist>

          {ingredients.map((ing, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-center">
              <input
                list="known-ingredients"
                placeholder="Navn"
                value={ing.name}
                onChange={(e) => updateIngredient(idx, { name: e.target.value })}
                className="col-span-6 rounded-xl border border-input bg-card px-3 py-2 focus:outline-none focus:ring-0 focus:border-gray-300"
              />

              <input
                placeholder="Mængde"
                type="number"
                min={1}
                step={0.1}
                value={ing.amount}
                onChange={(e) => updateIngredient(idx, { amount: Number(e.target.value) || 0 })}
                className="col-span-2 rounded-xl border border-input bg-card px-3 py-2 focus:outline-none focus:ring-0 focus:border-gray-300"
              />

              <select
                value={ing.unit}
                onChange={(e) => updateIngredient(idx, { unit: e.target.value })}
                className="col-span-2 rounded-xl border border-input bg-card px-3 py-2 focus:outline-none focus:ring-0 focus:border-gray-300"
              >
                {UNIT_OPTIONS.map((u) => (
                  <option key={u} value={u}>
                    {u === "other" ? "Andet…" : u}
                  </option>
                ))}
              </select>

              {ing.unit === "other" && (
                <input
                  placeholder="Skriv enhed"
                  value={ing.unitOther}
                  onChange={(e) => updateIngredient(idx, { unitOther: e.target.value })}
                  className="col-span-2 rounded-xl border border-input bg-card px-3 py-2 focus:outline-none focus:ring-0 focus:border-gray-300"
                />
              )}

              <div className="col-span-1 flex justify-end">
                {ingredients.length > 1 ? (
                  <button type="button" onClick={() => removeIngredient(idx)} className="text-red-600 p-1 rounded-full hover:bg-muted/50">
                    <X className="size-4" />
                    <span className="sr-only">Fjern ingrediens</span>
                  </button>
                ) : (
                  <div className="w-6" />
                )}
              </div>
            </div>
          ))}

          <div>
            <Button type="button" size="sm" onClick={addIngredient} className="mt-2">
              Tilføj ingrediens
            </Button>
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="font-medium">Fremgangsmåde (valgfri)</legend>
          {steps.map((s, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-start">
              <div className="col-span-1 flex items-start">
                <div className="h-6 w-6 rounded-full bg-muted text-sm flex items-center justify-center">{idx + 1}</div>
              </div>
              <textarea
                value={s}
                onChange={(e) => updateStep(idx, e.target.value)}
                className="col-span-11 rounded-xl border border-input bg-card px-3 py-1 focus:outline-none focus:ring-0 focus:border-gray-300"
                rows={1}
              />
              <div className="col-span-12 flex justify-end">
                {steps.length > 1 ? (
                  <button type="button" onClick={() => removeStep(idx)} className="text-red-600 p-1 rounded-full hover:bg-muted/50">
                    <X className="size-4" />
                    <span className="sr-only">Fjern trin</span>
                  </button>
                ) : (
                  <div className="w-6" />
                )}
              </div>
            </div>
          ))}
          <div>
            <Button type="button" size="sm" onClick={addStep}>
              Tilføj trin
            </Button>
          </div>
        </fieldset>

        <div>
          <label className="block text-sm font-medium mb-1">Tags</label>
          <div className="flex gap-2 items-center">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full rounded-xl border border-input bg-card px-3 py-2 focus:outline-none focus:ring-0 focus:border-gray-300"
            >
              <option value="">Hvor dyrt? (valgfri)</option>
              <option value="Bilig">Billig</option>
              <option value="Medium">Medium</option>
              <option value="Dyr">Dyrt</option>
            </select>
          </div>
        </div>

        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}

        <div className="pt-2">
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (isEditMode ? "Opdaterer…" : "Opretter…") : isEditMode ? "Opdater opskrift" : "Opret opskrift"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Tilfoej;
