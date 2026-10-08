"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ApiError, kitchenMenuApi } from "../../../../lib/kitchenApi";
import type { MealDetail } from "../../../../lib/types";
import { Trash2 } from "lucide-react";
import { BackLink, Button, Card, ConfirmDialog, PageHeader, Spinner } from "../../components/ui";
import MealForm from "../../components/MealForm";

export default function EditMealPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [meal, setMeal] = useState<MealDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleteError(null);
    setIsDeleting(true);
    try {
      await kitchenMenuApi.remove(params.id);
      router.push("/partner/menu");
    } catch (err) {
      setConfirmDelete(false);
      setDeleteError(err instanceof ApiError ? err.message : "Could not delete this dish, please try again");
      setIsDeleting(false);
    }
  };

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
      <PageHeader
        title="Edit dish"
        action={
          meal ? (
            <Button variant="outline" className="!py-2 !px-4 !text-xs" onClick={() => setConfirmDelete(true)} disabled={isDeleting}>
              <Trash2 size={13} /> Delete dish
            </Button>
          ) : undefined
        }
      />
      {deleteError ? <p className="text-xs font-semibold text-red-600 mb-4">{deleteError}</p> : null}
      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner className="w-6 h-6 text-[#087F78]" />
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
      <ConfirmDialog
        open={confirmDelete}
        title="Delete this dish?"
        description="It will be removed from your menu and from customers' feeds. Past orders are not affected."
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
