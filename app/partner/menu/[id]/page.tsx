"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { kitchenMenuApi } from "../../../../lib/kitchenApi";
import type { MealDetail } from "../../../../lib/types";
import { BackLink, Card, PageHeader, Spinner } from "../../components/ui";
import MealForm from "../../components/MealForm";

export default function EditMealPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [meal, setMeal] = useState<MealDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    kitchenMenuApi
      .get(params.id)
      .then(setMeal)
      .finally(() => setIsLoading(false));
  }, [params.id]);

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
        ) : (
          <p className="text-sm text-slate-500">Dish not found.</p>
        )}
      </Card>
    </div>
  );
}
