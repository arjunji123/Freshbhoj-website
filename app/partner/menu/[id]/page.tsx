"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ApiError, kitchenMenuApi } from "../../../../lib/kitchenApi";
import type { MealDetail } from "../../../../lib/types";
import { BackLink, Button, Card, PageHeader, Spinner } from "../../components/ui";
import MealForm from "../../components/MealForm";

export default function EditMealPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [meal, setMeal] = useState<MealDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setNotFound(false);
    setLoadError(null);
    try {
      setMeal(await kitchenMenuApi.get(params.id));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setNotFound(true);
      } else {
        setLoadError(err instanceof ApiError ? err.message : "Could not load this dish, please try again");
      }
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <BackLink href="/partner/menu" label="Back to Menu" />
      <PageHeader title="Edit dish" />
      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner className="w-6 h-6 text-[#BA2121]" />
          </div>
        ) : meal ? (
          <MealForm
            initial={meal}
            submitLabel="Save changes"
            onSubmit={async (input) => {
              await kitchenMenuApi.update(params.id, input);
              router.push("/partner/menu");
            }}
          />
        ) : notFound ? (
          <p className="text-sm text-slate-500">Dish not found.</p>
        ) : (
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm font-semibold text-red-600">{loadError ?? "Could not load this dish, please try again"}</p>
            <Button onClick={load}>Retry</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
