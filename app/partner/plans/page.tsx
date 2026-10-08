"use client";

import { useEffect, useState } from "react";
import { Layers, Pencil, Plus, Users } from "lucide-react";
import { ApiError, subscriptionPlansApi } from "../../../lib/kitchenApi";
import type {
  CreateSubscriptionPlanInput,
  DayOfWeek,
  FoodType,
  MealSlot,
  SubscriptionBillingCycle,
  SubscriptionPlan,
} from "../../../lib/types";
import { Badge, BottomSheet, Button, Card, EmptyState, Field, PageHeader, RangeSlider, Spinner, TextArea, TextInput, Toggle } from "../components/ui";

const DAY_ORDER: DayOfWeek[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
const DAY_SHORT: Record<DayOfWeek, string> = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
  SUNDAY: "Sun",
};

const DIET_OPTIONS: FoodType[] = ["VEG", "EGG", "NON_VEG", "VEGAN"];
const DIET_LABEL: Record<FoodType, string> = { VEG: "Veg", EGG: "Egg", NON_VEG: "Non-veg", VEGAN: "Vegan" };

const SLOT_OPTIONS: MealSlot[] = ["BREAKFAST", "LUNCH", "DINNER", "SNACKS"];
const SLOT_LABEL: Record<MealSlot, string> = { BREAKFAST: "Breakfast", LUNCH: "Lunch", DINNER: "Dinner", SNACKS: "Snacks" };

const BILLING_CYCLES: SubscriptionBillingCycle[] = ["WEEKLY", "MONTHLY"];
const BILLING_LABEL: Record<SubscriptionBillingCycle, string> = { WEEKLY: "Weekly", MONTHLY: "Monthly" };

export default function PlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<SubscriptionPlan | null>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await subscriptionPlansApi.list();
      setPlans(res);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load your plans, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggleActive = async (plan: SubscriptionPlan) => {
    setTogglingId(plan.id);
    try {
      const updated = await subscriptionPlansApi.update(plan.id, { isActive: !plan.isActive });
      setPlans((prev) => prev.map((p) => (p.id === plan.id ? updated : p)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update this plan, please try again");
    } finally {
      setTogglingId(null);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (plan: SubscriptionPlan) => {
    setEditing(plan);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleSaved = (plan: SubscriptionPlan) => {
    setPlans((prev) => (prev.some((p) => p.id === plan.id) ? prev.map((p) => (p.id === plan.id ? plan : p)) : [plan, ...prev]));
    closeForm();
  };

  return (
    <div>
      <PageHeader
        title="Subscription Plans"
        subtitle="Reusable plans customers can browse and subscribe to"
        action={
          <Button onClick={openCreate}>
            <Plus size={15} /> New Plan
          </Button>
        }
      />

      {error && plans.length > 0 ? <p className="text-xs font-semibold text-red-600 mb-4">{error}</p> : null}

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner className="w-8 h-8 text-[#087F78]" />
        </div>
      ) : plans.length === 0 && error ? (
        <Card>
          <EmptyState title="Couldn't load plans" description={error} action={<Button onClick={() => load()}>Retry</Button>} />
        </Card>
      ) : plans.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Layers />}
            title="No plans yet"
            description="Create your first subscription plan so customers can discover and subscribe to it from your kitchen page."
            action={
              <Button onClick={openCreate}>
                <Plus size={15} /> New Plan
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isToggling={togglingId === plan.id}
              onToggleActive={() => handleToggleActive(plan)}
              onEdit={() => openEdit(plan)}
            />
          ))}
        </div>
      )}

      <PlanFormSheet isOpen={showForm} plan={editing} onClose={closeForm} onSaved={handleSaved} />
    </div>
  );
}

function PlanCard({
  plan,
  isToggling,
  onToggleActive,
  onEdit,
}: {
  plan: SubscriptionPlan;
  isToggling: boolean;
  onToggleActive: () => void;
  onEdit: () => void;
}) {
  const hasDiscount = plan.originalPriceRs != null && plan.originalPriceRs > plan.priceRs;

  return (
    <Card className="!p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <button type="button" onClick={onEdit} className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-extrabold text-slate-900 truncate">{plan.name}</p>
            {plan.isPopular ? <Badge tone="brand">Popular</Badge> : null}
          </div>
        </button>
        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit plan"
          className="w-8 h-8 shrink-0 rounded-lg bg-slate-100 text-slate-400 hover:bg-[#087F78]/10 hover:text-[#087F78] flex items-center justify-center transition-colors"
        >
          <Pencil size={13} />
        </button>
      </div>

      <div className="flex items-baseline gap-2 flex-wrap">
        <p className="text-xl font-extrabold text-slate-900">₹{plan.priceRs.toLocaleString("en-IN")}</p>
        {hasDiscount ? (
          <>
            <p className="text-sm font-semibold text-slate-400 line-through">₹{plan.originalPriceRs!.toLocaleString("en-IN")}</p>
            <Badge tone="success">{plan.discountPercent}% off</Badge>
          </>
        ) : null}
      </div>

      <div className="text-xs text-slate-500 space-y-1">
        <p>
          {plan.mealsPerDay} meal{plan.mealsPerDay === 1 ? "" : "s"}/day · {BILLING_LABEL[plan.billingCycle]} ·{" "}
          {plan.deliveryDays.length} day{plan.deliveryDays.length === 1 ? "" : "s"}/week
        </p>
        <p>{plan.deliveryDays.map((d) => DAY_SHORT[d]).join(", ")}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {plan.dietOptions.map((d) => (
          <Badge key={d} tone="neutral">
            {DIET_LABEL[d]}
          </Badge>
        ))}
        {plan.jainAvailable ? <Badge tone="neutral">Jain</Badge> : null}
        {plan.slotOptions.map((s) => (
          <Badge key={s} tone="neutral">
            {SLOT_LABEL[s]}
          </Badge>
        ))}
      </div>

      <p className="text-xs text-slate-400 line-clamp-2">{plan.includesDescription}</p>

      <div className="flex items-center justify-between mt-1 pt-3 border-t border-slate-50">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <Users size={12} /> {plan.subscriberCount} subscriber{plan.subscriberCount === 1 ? "" : "s"}
        </span>
        <Toggle checked={plan.isActive} onChange={onToggleActive} onLabel="Live" offLabel="Hidden" disabled={isToggling} tone="light" className="text-slate-500" />
      </div>
    </Card>
  );
}

/** Same solid-brand-red chip treatment as `MealForm`'s local `ChipToggle` (meal slots / goal tags), reused here for consistency across the two "reusable-selection" forms in the kitchen portal. */
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

interface PlanFormState {
  name: string;
  billingCycle: SubscriptionBillingCycle;
  deliveryDays: DayOfWeek[];
  mealsPerDay: number;
  priceRs: string;
  originalPriceRs: string;
  dietOptions: FoodType[];
  jainAvailable: boolean;
  slotOptions: MealSlot[];
  includesDescription: string;
  isPopular: boolean;
}

const EMPTY_FORM: PlanFormState = {
  name: "",
  billingCycle: "WEEKLY",
  deliveryDays: [],
  mealsPerDay: 1,
  priceRs: "",
  originalPriceRs: "",
  dietOptions: [],
  jainAvailable: false,
  slotOptions: [],
  includesDescription: "",
  isPopular: false,
};

function planToForm(plan: SubscriptionPlan): PlanFormState {
  return {
    name: plan.name,
    billingCycle: plan.billingCycle,
    deliveryDays: plan.deliveryDays,
    mealsPerDay: plan.mealsPerDay,
    priceRs: String(plan.priceRs),
    originalPriceRs: plan.originalPriceRs != null ? String(plan.originalPriceRs) : "",
    dietOptions: plan.dietOptions,
    jainAvailable: plan.jainAvailable,
    slotOptions: plan.slotOptions,
    includesDescription: plan.includesDescription,
    isPopular: plan.isPopular,
  };
}

function PlanFormSheet({
  isOpen,
  plan,
  onClose,
  onSaved,
}: {
  isOpen: boolean;
  plan: SubscriptionPlan | null;
  onClose: () => void;
  onSaved: (plan: SubscriptionPlan) => void;
}) {
  const [form, setForm] = useState<PlanFormState>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset (or pre-fill for edit) each time the sheet is opened — mirrors AddMoneySheet in wallet/page.tsx.
  useEffect(() => {
    if (isOpen) {
      setForm(plan ? planToForm(plan) : EMPTY_FORM);
      setError(null);
    }
  }, [isOpen, plan]);

  const toggleDay = (day: DayOfWeek) =>
    setForm((f) => ({ ...f, deliveryDays: f.deliveryDays.includes(day) ? f.deliveryDays.filter((d) => d !== day) : [...f.deliveryDays, day] }));

  const toggleDiet = (diet: FoodType) =>
    setForm((f) => ({ ...f, dietOptions: f.dietOptions.includes(diet) ? f.dietOptions.filter((d) => d !== diet) : [...f.dietOptions, diet] }));

  const toggleSlot = (slot: MealSlot) =>
    setForm((f) => ({ ...f, slotOptions: f.slotOptions.includes(slot) ? f.slotOptions.filter((s) => s !== slot) : [...f.slotOptions, slot] }));

  const validate = (): string | null => {
    const name = form.name.trim();
    if (name.length < 3 || name.length > 60) return "Plan name must be 3–60 characters.";
    if (form.deliveryDays.length === 0) return "Pick at least one delivery day.";
    if (form.mealsPerDay < 1 || form.mealsPerDay > 3) return "Meals per day must be between 1 and 3.";

    const price = Number(form.priceRs);
    if (!form.priceRs.trim() || !Number.isFinite(price) || price <= 0) return "Enter a valid price.";

    const originalPrice = form.originalPriceRs.trim() ? Number(form.originalPriceRs) : null;
    if (originalPrice != null && (!Number.isFinite(originalPrice) || originalPrice <= price)) {
      return "Original price must be greater than the price.";
    }

    if (form.dietOptions.length === 0) return "Pick at least one diet option.";
    if (form.slotOptions.length === 0) return "Pick at least one delivery slot.";

    const description = form.includesDescription.trim();
    if (description.length < 3 || description.length > 300) return "Describe what's included in 3–300 characters.";

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setIsSaving(true);
    try {
      const body: CreateSubscriptionPlanInput = {
        name: form.name.trim(),
        billingCycle: form.billingCycle,
        deliveryDays: form.deliveryDays,
        mealsPerDay: form.mealsPerDay,
        priceRs: Number(form.priceRs),
        originalPriceRs: form.originalPriceRs.trim() ? Number(form.originalPriceRs) : undefined,
        dietOptions: form.dietOptions,
        jainAvailable: form.jainAvailable,
        slotOptions: form.slotOptions,
        includesDescription: form.includesDescription.trim(),
        isPopular: form.isPopular,
      };
      const saved = plan ? await subscriptionPlansApi.update(plan.id, body) : await subscriptionPlansApi.create(body);
      onSaved(saved);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save this plan, please try again");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={plan ? "Edit plan" : "New plan"}>
      <div className="flex flex-col gap-5">
        <Field label="Plan name">
          <TextInput
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Weekday Lunch Saver"
            maxLength={60}
          />
        </Field>

        <Field label="Billing cycle">
          <div className="flex gap-2">
            {BILLING_CYCLES.map((cycle) => (
              <button
                key={cycle}
                type="button"
                onClick={() => setForm((f) => ({ ...f, billingCycle: cycle }))}
                className={`flex-1 rounded-xl px-3 py-3 text-xs font-bold transition-colors ${
                  form.billingCycle === cycle ? "bg-[#087F78] text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {BILLING_LABEL[cycle]}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Delivery days">
          <div className="flex flex-wrap gap-2">
            {DAY_ORDER.map((day) => (
              <ChipToggle key={day} label={DAY_SHORT[day]} isActive={form.deliveryDays.includes(day)} onClick={() => toggleDay(day)} />
            ))}
          </div>
        </Field>

        <RangeSlider
          label="Meals per day"
          value={form.mealsPerDay}
          min={1}
          max={3}
          onChange={(value) => setForm((f) => ({ ...f, mealsPerDay: value }))}
        />

        <div className="grid grid-cols-2 gap-4">
          <Field label="Price (₹)">
            <TextInput
              inputMode="numeric"
              placeholder="e.g. 1499"
              value={form.priceRs}
              onChange={(e) => setForm((f) => ({ ...f, priceRs: e.target.value.replace(/\D/g, "") }))}
            />
          </Field>
          <Field label="Original price (optional)">
            <TextInput
              inputMode="numeric"
              placeholder="e.g. 1799"
              value={form.originalPriceRs}
              onChange={(e) => setForm((f) => ({ ...f, originalPriceRs: e.target.value.replace(/\D/g, "") }))}
            />
          </Field>
        </div>

        <Field label="Diet options">
          <div className="flex flex-wrap gap-2">
            {DIET_OPTIONS.map((diet) => (
              <ChipToggle key={diet} label={DIET_LABEL[diet]} isActive={form.dietOptions.includes(diet)} onClick={() => toggleDiet(diet)} />
            ))}
          </div>
        </Field>

        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
          <div>
            <p className="text-sm font-bold text-slate-700">Jain available</p>
            <p className="text-xs text-slate-400">No onion or garlic, on request</p>
          </div>
          <Toggle tone="light" checked={form.jainAvailable} onChange={() => setForm((f) => ({ ...f, jainAvailable: !f.jainAvailable }))} />
        </div>

        <Field label="Delivery slots">
          <div className="flex flex-wrap gap-2">
            {SLOT_OPTIONS.map((slot) => (
              <ChipToggle key={slot} label={SLOT_LABEL[slot]} isActive={form.slotOptions.includes(slot)} onClick={() => toggleSlot(slot)} />
            ))}
          </div>
        </Field>

        <Field label="What's included">
          <TextArea
            rows={3}
            placeholder="e.g. 7 lunches a week, rotating regional menu, free delivery"
            value={form.includesDescription}
            onChange={(e) => setForm((f) => ({ ...f, includesDescription: e.target.value }))}
            maxLength={300}
          />
        </Field>

        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
          <div>
            <p className="text-sm font-bold text-slate-700">Mark as popular</p>
            <p className="text-xs text-slate-400">Shows a &quot;Popular&quot; badge to customers</p>
          </div>
          <Toggle tone="light" checked={form.isPopular} onChange={() => setForm((f) => ({ ...f, isPopular: !f.isPopular }))} />
        </div>

        {error ? <p className="text-xs font-semibold text-red-600">{error}</p> : null}

        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1 justify-center bg-slate-100" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button className="flex-1 justify-center" onClick={handleSubmit} loading={isSaving}>
            {plan ? "Save changes" : "Create plan"}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
