"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { ApiError, kitchenMenuApi, kitchenUploadApi, type UpsertMealInput } from "../../../lib/kitchenApi";
import type { FoodType, GoalTag, MealDetail, MealSlot, NutritionAnalysisResult } from "../../../lib/types";
import { Badge, Button, Field, Select, TextArea, TextInput } from "./ui";

const FOOD_TYPES: FoodType[] = ["VEG", "EGG", "NON_VEG", "VEGAN"];
const SLOTS: MealSlot[] = ["BREAKFAST", "LUNCH", "DINNER", "SNACKS"];
const GOAL_TAGS: GoalTag[] = ["HIGH_PROTEIN", "LOW_CALORIE", "WEIGHT_LOSS", "MUSCLE_GAIN", "HEALTHY_LIFESTYLE"];

function labelize(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

interface MealFormProps {
  initial?: MealDetail;
  submitLabel: string;
  onSubmit: (input: UpsertMealInput) => Promise<void>;
}

export default function MealForm({ initial, submitLabel, onSubmit }: MealFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [price, setPrice] = useState(String(initial?.price ?? ""));
  const [mrp, setMrp] = useState(initial?.mrp ? String(initial.mrp) : "");
  const [foodType, setFoodType] = useState<FoodType>(initial?.foodType ?? "VEG");
  const [slots, setSlots] = useState<MealSlot[]>(initial?.slots ?? []);
  const [goalTags, setGoalTags] = useState<GoalTag[]>(initial?.goalTags ?? []);
  const [calories, setCalories] = useState(initial?.nutrition ? String(initial.nutrition.calories) : "");
  const [proteinG, setProteinG] = useState(initial?.nutrition ? String(initial.nutrition.proteinG) : "");
  const [carbsG, setCarbsG] = useState(initial?.nutrition?.carbsG ? String(initial.nutrition.carbsG) : "");
  const [fatG, setFatG] = useState(initial?.nutrition?.fatG ? String(initial.nutrition.fatG) : "");
  const [fiberG, setFiberG] = useState(initial?.nutrition?.fiberG ? String(initial.nutrition.fiberG) : "");
  const [servingSize, setServingSize] = useState(initial?.servingSize ?? "");
  const [ingredientsText, setIngredientsText] = useState((initial?.ingredients ?? []).join(", "));
  const [allergensText, setAllergensText] = useState((initial?.allergens ?? []).join(", "));
  const [prepTimeMins, setPrepTimeMins] = useState(String(initial?.prepTimeMins ?? 25));
  const [isAvailable, setIsAvailable] = useState(initial?.isAvailable ?? false);

  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<NutritionAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const toggleFrom = <T,>(list: T[], value: T, setter: (v: T[]) => void) =>
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const handleUploadImage = async (file: File) => {
    setIsUploading(true);
    try {
      const { url } = await kitchenUploadApi.upload(file, "MENU_IMAGE");
      setImages((prev) => [...prev, url].slice(0, 6));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalysisError(null);
    setIsAnalyzing(true);
    try {
      const ingredients = ingredientsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const result = await kitchenMenuApi.analyze({ name: name.trim(), description: description.trim() || undefined, ingredients });
      setAnalysis(result);
      setCalories(String(result.calories));
      setProteinG(String(result.proteinG));
      setCarbsG(String(result.carbsG));
      setFatG(String(result.fatG));
      setFiberG(String(result.fiberG));
    } catch (err) {
      setAnalysisError(err instanceof ApiError ? err.message : "AI analysis failed, please try again");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplySuggestedTags = () => {
    if (!analysis) return;
    setGoalTags((prev) => Array.from(new Set([...prev, ...analysis.suggestedGoalTags])));
  };

  const isValid = name.trim().length >= 3 && images.length > 0 && Number(price) > 0;

  const handleSubmit = async () => {
    setError(null);
    setIsSaving(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        images,
        price: Number(price),
        mrp: mrp ? Number(mrp) : undefined,
        foodType,
        slots,
        goalTags,
        calories: Number(calories) || 0,
        proteinG: Number(proteinG) || 0,
        carbsG: carbsG ? Number(carbsG) : undefined,
        fatG: fatG ? Number(fatG) : undefined,
        fiberG: fiberG ? Number(fiberG) : undefined,
        servingSize: servingSize.trim() || undefined,
        ingredients: ingredientsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        allergens: allergensText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        prepTimeMins: Number(prepTimeMins) || 25,
        isAvailable,
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save the dish, please try again");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Field label="Dish name">
        <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Paneer Butter Masala" />
      </Field>

      <Field label="Description">
        <TextArea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Creamy tomato gravy, cottage cheese, butter — describe it well, the AI assist reads this too" />
      </Field>

      <Field label="Photos">
        <div className="flex flex-wrap gap-3">
          {images.map((url) => (
            <div key={url} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="Dish" className="w-full h-full object-cover" />
              <button
                onClick={() => setImages((prev) => prev.filter((u) => u !== url))}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center"
              >
                <X size={11} />
              </button>
            </div>
          ))}
          {images.length < 6 ? (
            <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer text-xs font-bold text-slate-400 hover:border-[#BA2121]/30 hover:text-[#BA2121] transition-colors">
              {isUploading ? "…" : "+ Add"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUploadImage(e.target.files[0])} />
            </label>
          ) : null}
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Price (₹)">
          <TextInput inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))} />
        </Field>
        <Field label="MRP / strike-through (optional)">
          <TextInput inputMode="numeric" value={mrp} onChange={(e) => setMrp(e.target.value.replace(/\D/g, ""))} />
        </Field>
      </div>

      <Field label="Food type">
        <Select value={foodType} onChange={(e) => setFoodType(e.target.value as FoodType)}>
          {FOOD_TYPES.map((t) => (
            <option key={t} value={t}>
              {labelize(t)}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Meal slots">
        <div className="flex flex-wrap gap-2">
          {SLOTS.map((slot) => (
            <ChipToggle key={slot} label={labelize(slot)} isActive={slots.includes(slot)} onClick={() => toggleFrom(slots, slot, setSlots)} />
          ))}
        </div>
      </Field>

      {/* ── AI nutrition assist ─────────────────────────────────────────── */}
      <div className="rounded-2xl border-2 border-dashed border-[#BA2121]/20 p-5 bg-[#BA2121]/[0.02]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#BA2121]" />
            <p className="text-sm font-extrabold text-slate-800">AI nutrition &amp; health assist</p>
          </div>
          <Button variant="outline" className="!py-2 !px-4 !text-xs" onClick={handleAnalyze} disabled={name.trim().length < 3} loading={isAnalyzing}>
            Analyze with AI
          </Button>
        </div>
        {analysisError ? <p className="text-xs font-semibold text-red-600 mb-2">{analysisError}</p> : null}
        {analysis ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge tone="brand">✨ AI-estimated — review before publishing</Badge>
              <Badge tone={analysis.healthScore >= 60 ? "success" : analysis.healthScore >= 35 ? "warning" : "danger"}>
                Health score {analysis.healthScore}/100
              </Badge>
              <Badge tone={analysis.isJunkFood ? "danger" : "success"}>{analysis.isJunkFood ? "Flagged as junk food" : "Not junk food"}</Badge>
            </div>
            <p className="text-xs text-slate-500">{analysis.reason}</p>
            {analysis.suggestedGoalTags.length ? (
              <button onClick={handleApplySuggestedTags} className="text-xs font-bold text-[#BA2121] text-left mt-1">
                Apply suggested tags: {analysis.suggestedGoalTags.map(labelize).join(", ")}
              </button>
            ) : null}
          </div>
        ) : (
          <p className="text-xs text-slate-400">
            Fill in the name (and description for better accuracy), then let AI estimate calories, protein, and whether
            this counts as junk food — you can edit every number below before publishing.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Field label="Calories (kcal)">
          <TextInput inputMode="numeric" value={calories} onChange={(e) => setCalories(e.target.value.replace(/\D/g, ""))} />
        </Field>
        <Field label="Protein (g)">
          <TextInput inputMode="numeric" value={proteinG} onChange={(e) => setProteinG(e.target.value.replace(/\D/g, ""))} />
        </Field>
        <Field label="Carbs (g)">
          <TextInput inputMode="numeric" value={carbsG} onChange={(e) => setCarbsG(e.target.value.replace(/\D/g, ""))} />
        </Field>
        <Field label="Fat (g)">
          <TextInput inputMode="numeric" value={fatG} onChange={(e) => setFatG(e.target.value.replace(/\D/g, ""))} />
        </Field>
        <Field label="Fiber (g)">
          <TextInput inputMode="numeric" value={fiberG} onChange={(e) => setFiberG(e.target.value.replace(/\D/g, ""))} />
        </Field>
        <Field label="Serving size">
          <TextInput value={servingSize} onChange={(e) => setServingSize(e.target.value)} placeholder="1 bowl (350g)" />
        </Field>
      </div>

      <Field label="Goal tags">
        <div className="flex flex-wrap gap-2">
          {GOAL_TAGS.map((tag) => (
            <ChipToggle key={tag} label={labelize(tag)} isActive={goalTags.includes(tag)} onClick={() => toggleFrom(goalTags, tag, setGoalTags)} />
          ))}
        </div>
      </Field>

      <Field label="Ingredients (comma-separated)">
        <TextInput value={ingredientsText} onChange={(e) => setIngredientsText(e.target.value)} placeholder="paneer, butter, tomato, cream" />
      </Field>

      <Field label="Allergens (comma-separated)">
        <TextInput value={allergensText} onChange={(e) => setAllergensText(e.target.value)} placeholder="dairy, nuts" />
      </Field>

      <Field label="Prep time (mins)">
        <TextInput inputMode="numeric" value={prepTimeMins} onChange={(e) => setPrepTimeMins(e.target.value.replace(/\D/g, ""))} className="max-w-[140px]" />
      </Field>

      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} className="w-4 h-4 accent-[#BA2121]" />
        <span className="text-sm font-bold text-slate-700">Publish immediately (visible to customers)</span>
      </label>
      {!isAvailable && Number(calories) > 0 && Number(proteinG) > 0 ? null : !isAvailable ? (
        <p className="text-xs text-slate-400 -mt-4">Calories and protein are required before you can publish.</p>
      ) : null}

      {error ? <p className="text-xs font-semibold text-red-600">{error}</p> : null}

      <Button onClick={handleSubmit} disabled={!isValid} loading={isSaving}>
        {submitLabel}
      </Button>
    </div>
  );
}

function ChipToggle({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
        isActive ? "bg-[#BA2121] text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
      }`}
    >
      {label}
    </button>
  );
}
