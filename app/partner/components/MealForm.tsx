"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Leaf, Plus, Sparkles, Trash2, X } from "lucide-react";
import {
  ApiError,
  catalogApi,
  kitchenMenuApi,
  kitchenUploadApi,
  type UpsertMealCustomizationGroupInput,
  type UpsertMealInput,
} from "../../../lib/kitchenApi";
import type { Cuisine, FoodType, GoalTag, MealDetail, MealSlot, NutritionAnalysisResult } from "../../../lib/types";
import { Badge, Button, Field, Select, TextArea, TextInput } from "./ui";

const FOOD_TYPES: FoodType[] = ["VEG", "EGG", "NON_VEG", "VEGAN"];
const SLOTS: MealSlot[] = ["BREAKFAST", "LUNCH", "DINNER", "SNACKS"];
const GOAL_TAGS: GoalTag[] = ["HIGH_PROTEIN", "LOW_CALORIE", "WEIGHT_LOSS", "MUSCLE_GAIN", "HEALTHY_LIFESTYLE"];
const MAX_GROUPS = 6;
const MAX_OPTIONS_PER_GROUP = 20;
const MAX_PHOTOS = 6;
// Mirrors the backend's UpsertMealDto limits.
const MAX_NAME = 80;
const MAX_DESCRIPTION = 500;
const MAX_GROUP_NAME = 40;
const MAX_OPTION_NAME = 60;

interface LocalOption {
  localId: string;
  name: string;
  priceDelta: string;
  /** Carried through unchanged from the saved dish so an edit does not silently drop it. */
  isDefault?: boolean;
}

interface LocalGroup {
  localId: string;
  name: string;
  isRequired: boolean;
  minSelect: string;
  maxSelect: string;
  options: LocalOption[];
}

let localIdSeq = 0;
const nextLocalId = () => `local-${++localIdSeq}`;

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
  const [isJainAvailable, setIsJainAvailable] = useState(initial?.isJainAvailable ?? false);
  const jainEligible = foodType === "VEG" || foodType === "VEGAN";
  const [cuisineSlug, setCuisineSlug] = useState(initial?.cuisineSlug ?? "");
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [cuisinesFailed, setCuisinesFailed] = useState(false);
  const [isLoadingCuisines, setIsLoadingCuisines] = useState(true);
  const [groups, setGroups] = useState<LocalGroup[]>(
    (initial?.customizationGroups ?? []).map((g) => ({
      localId: nextLocalId(),
      name: g.name,
      isRequired: g.isRequired,
      minSelect: String(g.minSelect),
      maxSelect: String(g.maxSelect),
      options: g.options.map((o) => ({ localId: nextLocalId(), name: o.name, priceDelta: String(o.priceDelta), isDefault: o.isDefault })),
    })),
  );
  const [slots, setSlots] = useState<MealSlot[]>(initial?.slots ?? []);
  const [goalTags, setGoalTags] = useState<GoalTag[]>(initial?.goalTags ?? []);
  const [calories, setCalories] = useState(initial?.nutrition?.calories != null ? String(initial.nutrition.calories) : "");
  const [proteinG, setProteinG] = useState(initial?.nutrition?.proteinG != null ? String(initial.nutrition.proteinG) : "");
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

  useEffect(() => {
    catalogApi
      .cuisines()
      .then((list) => setCuisines(list))
      .catch(() => setCuisinesFailed(true))
      .finally(() => setIsLoadingCuisines(false));
  }, []);

  // The backend rejects isJainAvailable:true unless foodType is VEG/VEGAN — flip it
  // off locally the moment the kitchen picks a foodType where it no longer applies,
  // so the toggle can never be submitted in a state the backend would refuse.
  useEffect(() => {
    if (!jainEligible && isJainAvailable) setIsJainAvailable(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jainEligible]);

  const addGroup = () => {
    if (groups.length >= MAX_GROUPS) return;
    setGroups((prev) => [
      ...prev,
      { localId: nextLocalId(), name: "", isRequired: false, minSelect: "0", maxSelect: "1", options: [] },
    ]);
  };

  const removeGroup = (groupId: string) => setGroups((prev) => prev.filter((g) => g.localId !== groupId));

  const updateGroup = (groupId: string, patch: Partial<LocalGroup>) =>
    setGroups((prev) => prev.map((g) => (g.localId === groupId ? { ...g, ...patch } : g)));

  const addOption = (groupId: string) =>
    setGroups((prev) =>
      prev.map((g) =>
        g.localId === groupId && g.options.length < MAX_OPTIONS_PER_GROUP
          ? { ...g, options: [...g.options, { localId: nextLocalId(), name: "", priceDelta: "0" }] }
          : g,
      ),
    );

  const removeOption = (groupId: string, optionId: string) =>
    setGroups((prev) =>
      prev.map((g) => (g.localId === groupId ? { ...g, options: g.options.filter((o) => o.localId !== optionId) } : g)),
    );

  const updateOption = (groupId: string, optionId: string, patch: Partial<LocalOption>) =>
    setGroups((prev) =>
      prev.map((g) =>
        g.localId === groupId
          ? { ...g, options: g.options.map((o) => (o.localId === optionId ? { ...o, ...patch } : o)) }
          : g,
      ),
    );

  const handleUploadImage = async (file: File) => {
    if (images.length >= MAX_PHOTOS) {
      setError(`You can add up to ${MAX_PHOTOS} photos per dish.`);
      return;
    }
    setError(null);
    setIsUploading(true);
    try {
      const { url } = await kitchenUploadApi.upload(file, "MENU_IMAGE");
      setImages((prev) => [...prev, url].slice(0, MAX_PHOTOS));
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

  const buildCustomizationGroups = (): UpsertMealCustomizationGroupInput[] =>
    groups
      .filter((g) => g.name.trim().length > 0)
      .map((g) => ({
        name: g.name.trim(),
        isRequired: g.isRequired,
        minSelect: Number(g.minSelect) || 0,
        maxSelect: Number(g.maxSelect) || 1,
        options: g.options
          .filter((o) => o.name.trim().length > 0)
          .map((o) => ({
            name: o.name.trim(),
            priceDelta: Number(o.priceDelta) || 0,
            ...(o.isDefault !== undefined ? { isDefault: o.isDefault } : {}),
          })),
      }));

  /** Returns the first thing the backend DTO would reject, in plain words — or null when the form is fine. */
  const validate = (customizationGroups: UpsertMealCustomizationGroupInput[]): string | null => {
    if (name.trim().length < 3) return "The dish name needs to be at least 3 characters.";
    if (images.length === 0) return "Add at least one photo of the dish.";
    const priceValue = Number(price);
    if (!price.trim() || !Number.isInteger(priceValue) || priceValue < 1) {
      return "Enter the price as a whole number of rupees, e.g. 199.";
    }
    if (mrp.trim() && (!Number.isInteger(Number(mrp)) || Number(mrp) < 1)) {
      return "Enter the MRP as a whole number of rupees, or leave it blank.";
    }
    if (prepTimeMins.trim()) {
      const prep = Number(prepTimeMins);
      if (!Number.isInteger(prep) || prep < 1 || prep > 180) return "Prep time must be a whole number of minutes between 1 and 180.";
    }
    const badGroup = customizationGroups.find((g) => g.options.length === 0 || g.maxSelect < 1 || g.minSelect > g.maxSelect);
    if (badGroup) {
      return `Check the "${badGroup.name}" customization: each group needs at least one option, a max of 1 or more, and a min that is not above the max.`;
    }
    return null;
  };

  const handleSubmit = async () => {
    setError(null);
    const customizationGroups = buildCustomizationGroups();
    const problem = validate(customizationGroups);
    if (problem) {
      setError(problem);
      return;
    }
    setIsSaving(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        images,
        price: Number(price),
        mrp: mrp ? Number(mrp) : undefined,
        foodType,
        isJainAvailable: jainEligible ? isJainAvailable : false,
        cuisineSlug: cuisineSlug || undefined,
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
        // Always sent (even empty): on edit the backend replaces all groups, so [] is how removing every group sticks.
        customizationGroups,
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
        <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Paneer Butter Masala" maxLength={MAX_NAME} />
      </Field>

      <Field label="Description">
        <TextArea rows={3} maxLength={MAX_DESCRIPTION} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Creamy tomato gravy, cottage cheese, butter — describe it well, the AI assist reads this too" />
      </Field>

      <Field label="Photos">
        <div className="flex flex-wrap gap-3">
          {images.map((url) => (
            <div key={url} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="Dish" className="w-full h-full object-cover" />
              <button
                type="button"
                aria-label="Remove photo"
                onClick={() => setImages((prev) => prev.filter((u) => u !== url))}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center"
              >
                <X size={11} />
              </button>
            </div>
          ))}
          {images.length < MAX_PHOTOS ? (
            <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer text-xs font-bold text-slate-400 hover:border-[#087F78]/30 hover:text-[#087F78] transition-colors">
              {isUploading ? "…" : "+ Add"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (file) handleUploadImage(file);
                }}
              />
            </label>
          ) : null}
        </div>
        <p className="text-[11px] font-semibold text-slate-400 mt-2">
          {images.length >= MAX_PHOTOS ? `Photo limit reached (${MAX_PHOTOS})` : `${images.length} of ${MAX_PHOTOS} added · up to 20 MB each`}
        </p>
        <Link href="/partner/menu/upload-guide" className="inline-flex items-center gap-1 text-xs font-bold text-[#087F78] mt-2">
          See upload tips <ArrowRight size={11} />
        </Link>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Price (₹)">
          <TextInput inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))} />
        </Field>
        <Field label="MRP (optional)">
          <TextInput inputMode="numeric" value={mrp} onChange={(e) => setMrp(e.target.value.replace(/\D/g, ""))} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Food type">
          <div className="flex items-center gap-3">
            <Select value={foodType} onChange={(e) => setFoodType(e.target.value as FoodType)} className="flex-1">
              {FOOD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {labelize(t)}
                </option>
              ))}
            </Select>
            <button
              type="button"
              onClick={() => jainEligible && setIsJainAvailable((v) => !v)}
              disabled={!jainEligible}
              title={jainEligible ? "Can be prepared Jain-style" : "Only available for Veg / Vegan dishes"}
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3.5 py-3 text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                isJainAvailable && jainEligible ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              <Leaf size={13} /> Jain
            </button>
          </div>
        </Field>

        <Field label="Cuisine (optional)">
          {cuisinesFailed ? (
            <TextInput value={cuisineSlug} onChange={(e) => setCuisineSlug(e.target.value)} placeholder="e.g. thali (cuisine slug)" />
          ) : isLoadingCuisines ? (
            <p className="text-xs font-semibold text-slate-400 py-2.5">Loading cuisines…</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {cuisines.map((c) => (
                <ChipToggle
                  key={c.id}
                  label={c.name}
                  isActive={cuisineSlug === c.slug}
                  onClick={() => setCuisineSlug((current) => (current === c.slug ? "" : c.slug))}
                />
              ))}
            </div>
          )}
        </Field>
      </div>

      <Field label="Meal slots">
        <div className="flex flex-wrap gap-2">
          {SLOTS.map((slot) => (
            <ChipToggle key={slot} label={labelize(slot)} isActive={slots.includes(slot)} onClick={() => toggleFrom(slots, slot, setSlots)} />
          ))}
        </div>
      </Field>

      {/* ── Customization groups ───────────────────────────────────────── */}
      <Field label="Customizations (optional)">
        <div className="flex flex-col gap-4">
          {groups.map((group) => (
            <div key={group.localId} className="rounded-2xl border border-slate-100 p-4">
              <div className="flex items-start gap-3 mb-3">
                <TextInput
                  value={group.name}
                  onChange={(e) => updateGroup(group.localId, { name: e.target.value })}
                  placeholder="Group name, e.g. Spice Level"
                  maxLength={MAX_GROUP_NAME}
                  className="flex-1 min-w-0"
                />
                <button
                  type="button"
                  onClick={() => removeGroup(group.localId)}
                  className="w-10 h-10 shrink-0 rounded-xl bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors"
                  aria-label="Remove group"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-4 mb-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={group.isRequired}
                    onChange={(e) => updateGroup(group.localId, { isRequired: e.target.checked })}
                    className="w-4 h-4 accent-[#087F78]"
                  />
                  <span className="text-xs font-bold text-slate-600">Required</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-400">Min</span>
                  <TextInput
                    inputMode="numeric"
                    value={group.minSelect}
                    onChange={(e) => updateGroup(group.localId, { minSelect: e.target.value.replace(/\D/g, "") })}
                    className="!w-16 !py-1.5 !px-2 text-center"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-400">Max</span>
                  <TextInput
                    inputMode="numeric"
                    value={group.maxSelect}
                    onChange={(e) => updateGroup(group.localId, { maxSelect: e.target.value.replace(/\D/g, "") })}
                    className="!w-16 !py-1.5 !px-2 text-center"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {group.options.map((option) => (
                  <div key={option.localId} className="flex items-center gap-2">
                    <TextInput
                      value={option.name}
                      onChange={(e) => updateOption(group.localId, option.localId, { name: e.target.value })}
                      placeholder="Option name, e.g. Extra Spicy"
                      maxLength={MAX_OPTION_NAME}
                      aria-label="Option name"
                      className="flex-1 min-w-0"
                    />
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-xs font-bold text-slate-400">₹</span>
                      <TextInput
                        inputMode="numeric"
                        value={option.priceDelta}
                        onChange={(e) => updateOption(group.localId, option.localId, { priceDelta: e.target.value.replace(/[^\d]/g, "") })}
                        className="!w-20 text-center"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeOption(group.localId, option.localId)}
                      className="w-9 h-9 shrink-0 rounded-xl bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition-colors"
                      aria-label="Remove option"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
                {group.options.length < MAX_OPTIONS_PER_GROUP ? (
                  <button
                    type="button"
                    onClick={() => addOption(group.localId)}
                    className="inline-flex items-center gap-1.5 self-start text-xs font-bold text-[#087F78] mt-1"
                  >
                    <Plus size={13} /> Add option
                  </button>
                ) : null}
              </div>
            </div>
          ))}
          {groups.length < MAX_GROUPS ? (
            <button
              type="button"
              onClick={addGroup}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 self-start transition-colors"
            >
              <Plus size={13} /> Add customization group
            </button>
          ) : null}
        </div>
      </Field>

      {/* ── AI nutrition assist ─────────────────────────────────────────── */}
      <div className="rounded-2xl border-2 border-dashed border-[#087F78]/20 p-5 bg-[#087F78]/[0.02]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#087F78]" />
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
              <button onClick={handleApplySuggestedTags} className="text-xs font-bold text-[#087F78] text-left mt-1">
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
        <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} className="w-4 h-4 accent-[#087F78]" />
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
        isActive ? "bg-[#087F78] text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
      }`}
    >
      {label}
    </button>
  );
}
