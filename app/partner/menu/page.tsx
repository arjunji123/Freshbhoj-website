"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Flame, Pencil, Plus, Trash2 } from "lucide-react";
import { ApiError, kitchenMenuApi } from "../../../lib/kitchenApi";
import type { MealDetail } from "../../../lib/types";
import { Badge, Button, Card, EmptyState, FoodTypeDot, PageHeader, Spinner } from "../components/ui";

const ALL_CATEGORY = "all";

export default function MenuPage() {
  const [meals, setMeals] = useState<MealDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY);

  const load = async () => {
    setIsLoading(true);
    try {
      setMeals(await kitchenMenuApi.list());
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load your menu, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggle = async (meal: MealDetail) => {
    setError(null);
    setBusyId(meal.id);
    try {
      await kitchenMenuApi.setAvailability(meal.id, !meal.isAvailable);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update, please try again");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (meal: MealDetail) => {
    if (!window.confirm(`Remove "${meal.name}" permanently?`)) return;
    setBusyId(meal.id);
    try {
      await kitchenMenuApi.remove(meal.id);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not remove, please try again");
    } finally {
      setBusyId(null);
    }
  };

  const categories = useMemo(() => {
    const seen = new Map<string, { id: string; slug: string; name: string }>();
    for (const meal of meals) {
      if (meal.category && !seen.has(meal.category.id)) seen.set(meal.category.id, meal.category);
    }
    return Array.from(seen.values());
  }, [meals]);

  const visibleMeals =
    activeCategory === ALL_CATEGORY ? meals : meals.filter((meal) => meal.category?.id === activeCategory);

  return (
    <div>
      <PageHeader
        title="Menu"
        subtitle={`${meals.length} dish${meals.length === 1 ? "" : "es"}`}
        action={
          <Link href="/partner/menu/new">
            <Button>
              <Plus size={16} /> Add dish
            </Button>
          </Link>
        }
      />
      {error ? <p className="text-xs font-semibold text-red-600 mb-4">{error}</p> : null}

      {meals.length > 0 && categories.length > 0 ? (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          <CategoryTab active={activeCategory === ALL_CATEGORY} onClick={() => setActiveCategory(ALL_CATEGORY)}>
            All
          </CategoryTab>
          {categories.map((category) => (
            <CategoryTab key={category.id} active={activeCategory === category.id} onClick={() => setActiveCategory(category.id)}>
              {category.name}
            </CategoryTab>
          ))}
        </div>
      ) : null}

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner className="w-8 h-8 text-[#BA2121]" />
        </div>
      ) : meals.length === 0 ? (
        <Card>
          {error ? (
            <EmptyState title="Couldn't load your menu" description={error} action={<Button onClick={load}>Retry</Button>} />
          ) : (
            <EmptyState
              title="No dishes yet"
              description="Add your first dish — describe it and let AI suggest nutrition facts and a health score."
              action={
                <Link href="/partner/menu/new">
                  <Button>Add your first dish</Button>
                </Link>
              }
            />
          )}
        </Card>
      ) : visibleMeals.length === 0 ? (
        <Card>
          <EmptyState title="No dishes in this category" description="Try a different category, or add a new dish here." />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleMeals.map((meal) => (
            <Card key={meal.id} className="!p-4">
              <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-100 mb-3">
                {meal.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
                ) : null}
              </div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="flex items-center gap-1.5 text-sm font-extrabold text-slate-900 min-w-0">
                  <FoodTypeDot foodType={meal.foodType} />
                  <span className="line-clamp-1">{meal.name}</span>
                </h3>
                <Badge tone={meal.isAvailable ? "success" : "neutral"}>{meal.isAvailable ? "Live" : "Draft"}</Badge>
              </div>
              {meal.category ? <p className="text-[11px] font-semibold text-slate-400 mb-1">{meal.category.name}</p> : null}
              <p className="text-sm font-bold text-slate-700 mb-2">₹{meal.price}</p>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
                <Flame size={12} />
                {meal.nutrition.calories} kcal · {meal.nutrition.proteinG}g protein
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/partner/menu/${meal.id}`} className="flex-1">
                  <Button variant="outline" className="w-full !py-2 !text-xs">
                    <Pencil size={13} /> Edit
                  </Button>
                </Link>
                <button
                  onClick={() => handleToggle(meal)}
                  disabled={busyId === meal.id}
                  className="text-xs font-bold text-slate-500 hover:text-[#BA2121] px-2 disabled:opacity-50"
                >
                  {meal.isAvailable ? "Pause" : "Publish"}
                </button>
                <button
                  onClick={() => handleDelete(meal)}
                  disabled={busyId === meal.id}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
        active ? "text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
      }`}
      style={active ? { background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)" } : undefined}
    >
      {children}
    </button>
  );
}
