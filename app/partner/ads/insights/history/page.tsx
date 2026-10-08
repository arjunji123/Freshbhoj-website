"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { ApiError, suggestionsApi } from "../../../../../lib/kitchenApi";
import type { CampaignSuggestion, SuggestionStatus } from "../../../../../lib/types";
import { BackLink, Button, Card, EmptyState, PageHeader, Spinner, TabBar, TextInput } from "../../../components/ui";
import { SuggestionCard } from "../SuggestionCard";

type HistoryTab = Extract<SuggestionStatus, "APPLIED" | "DISMISSED">;

const TAB_META: { key: HistoryTab; label: string }[] = [
  { key: "APPLIED", label: "Applied" },
  { key: "DISMISSED", label: "Dismissed" },
];

export default function SuggestionHistoryPage() {
  const [tab, setTab] = useState<HistoryTab>("APPLIED");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<CampaignSuggestion[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (status: HistoryTab, q: string) => {
    setIsLoading(true);
    try {
      const res = await suggestionsApi.list({ status, q: q.trim() || undefined, page: 1, limit: 15 });
      setItems(res.items);
      setHasNextPage(res.meta.hasNextPage);
      setPage(1);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load history, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  // Reload on tab switch immediately, and debounce search-as-you-type.
  useEffect(() => {
    const timer = setTimeout(() => load(tab, query), query ? 400 : 0);
    return () => clearTimeout(timer);
  }, [tab, query]);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      const res = await suggestionsApi.list({ status: tab, q: query.trim() || undefined, page: page + 1, limit: 15 });
      setItems((prev) => [...prev, ...res.items]);
      setHasNextPage(res.meta.hasNextPage);
      setPage((p) => p + 1);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load more, please try again");
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div>
      <BackLink href="/partner/ads/insights" label="Back to AI Insights" />
      <PageHeader title="Suggestion History" subtitle="Suggestions you've applied or dismissed" />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <TabBar tabs={TAB_META} activeKey={tab} onChange={setTab} />

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <TextInput
            placeholder="Search suggestions…"
            aria-label="Search suggestions"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="!pl-9"
          />
        </div>
      </div>

      {error ? <p className="text-xs font-semibold text-red-600 mb-4">{error}</p> : null}

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner className="w-8 h-8 text-[#087F78]" />
        </div>
      ) : items.length === 0 ? (
        <Card>
          <EmptyState
            title={query ? "No matches" : `No ${tab.toLowerCase()} suggestions`}
            description={query ? "Try a different search term." : "Suggestions you apply or dismiss will show up here."}
          />
        </Card>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {items.map((s) => (
              <SuggestionCard key={s.id} suggestion={s} showStatus />
            ))}
          </div>
          {hasNextPage ? (
            <div className="flex justify-center py-6">
              <Button variant="ghost" onClick={handleLoadMore} loading={isLoadingMore}>
                Load more
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
