"use client";

import { useRouter } from "next/navigation";
import { kitchenMenuApi } from "../../../../lib/kitchenApi";
import { BackLink, Card, PageHeader } from "../../components/ui";
import MealForm from "../../components/MealForm";

export default function NewMealPage() {
  const router = useRouter();

  return (
    <div>
      <BackLink href="/partner/menu" label="Back to Menu" />
      <PageHeader title="Add a dish" subtitle="Describe it well — the AI assist reads the name and description" />
      <Card>
        <MealForm
          submitLabel="Save dish"
          onSubmit={async (input) => {
            await kitchenMenuApi.create(input);
            router.push("/partner/menu");
          }}
        />
      </Card>
    </div>
  );
}
