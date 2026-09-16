"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, Pencil, Plus, Trash2 } from "lucide-react";
import { ApiError, kitchenMenuApi } from "../../../lib/kitchenApi";
import type { MealDetail } from "../../../lib/types";
import { Badge, Button, Card, EmptyState, PageHeader, Spinner } from "../components/ui";

export default function MenuPage() {
  const [meals, setMeals] = useState<MealDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      setMeals(await kitchenMenuApi.list());
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

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner className="w-8 h-8 text-[#BA2121]" />
        </div>
      ) : meals.length === 0 ? (
        <Card>
          <EmptyState
            title="No dishes yet"
            description="Add your first dish — describe it and let AI suggest nutrition facts and a health score."
            action={
              <Link href="/partner/menu/new">
                <Button>Add your first dish</Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {meals.map((meal) => (
            <Card key={meal.id} className="!p-4">
              <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-100 mb-3">
                {meal.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
                ) : null}
              </div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-sm font-extrabold text-slate-900 line-clamp-1">{meal.name}</h3>
                <Badge tone={meal.isAvailable ? "success" : "neutral"}>{meal.isAvailable ? "Live" : "Draft"}</Badge>
              </div>
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
