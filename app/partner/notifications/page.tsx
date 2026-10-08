"use client";

import { useEffect, useState } from "react";
import { Bell, Check, ClipboardList, Megaphone, RefreshCcw, Sparkles, Wallet } from "lucide-react";
import { ApiError, kitchenOrdersApi, notificationsApi } from "../../../lib/kitchenApi";
import type { KitchenNotification, NotificationCategory } from "../../../lib/types";
import { Badge, Button, Card, EmptyState, PageHeader, Spinner, TabBar } from "../components/ui";

const CATEGORY_TABS: { key?: NotificationCategory; label: string }[] = [
  { key: undefined, label: "All" },
  { key: "ORDER", label: "Orders" },
  { key: "SUBSCRIPTION", label: "Subscription" },
  { key: "REEL", label: "Reels" },
];

const CATEGORY_ICON: Record<NotificationCategory, React.ComponentType<{ size?: number; className?: string }>> = {
  ORDER: ClipboardList,
  SUBSCRIPTION: Wallet,
  REEL: Sparkles,
  GENERAL: Megaphone,
};

function dayBucket(iso: string): "Today" | "Yesterday" | "Earlier" {
  const date = new Date(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (day.getTime() === today.getTime()) return "Today";
  if (day.getTime() === yesterday.getTime()) return "Yesterday";
  return "Earlier";
}

function groupByDay(items: KitchenNotification[]) {
  const groups: { label: "Today" | "Yesterday" | "Earlier"; items: KitchenNotification[] }[] = [
    { label: "Today", items: [] },
    { label: "Yesterday", items: [] },
    { label: "Earlier", items: [] },
  ];
  for (const item of items) {
    const bucket = groups.find((g) => g.label === dayBucket(item.createdAt));
    bucket?.items.push(item);
  }
  return groups.filter((g) => g.items.length > 0);
}

export default function NotificationsPage() {
  const [category, setCategory] = useState<NotificationCategory | undefined>(undefined);
  const [items, setItems] = useState<KitchenNotification[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async (cat: NotificationCategory | undefined, pageNum: number, append: boolean) => {
    if (append) setIsLoadingMore(true);
    else setIsLoading(true);
    try {
      const res = await notificationsApi.list({ category: cat, page: pageNum, limit: 20 });
      setItems((prev) => (append ? [...prev, ...res.items] : res.items));
      setHasNextPage(res.meta.hasNextPage);
      setUnreadCount(res.unreadCount);
      setPage(pageNum);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load notifications, please try again");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    load(category, 1, false);
  }, [category]);

  const handleTap = async (notif: KitchenNotification) => {
    if (notif.isRead) return;
    setItems((prev) => prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await notificationsApi.markRead(notif.id);
    } catch {
      // Non-critical — local state already reflects "read"; a background retry isn't worth the complexity here.
    }
  };

  const handleMarkAllRead = async () => {
    setIsMarkingAll(true);
    try {
      await notificationsApi.markAllRead();
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not mark all as read");
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handleAccept = async (notif: KitchenNotification) => {
    const orderId = notif.data?.orderId as string | undefined;
    if (!orderId) return;
    setAcceptingId(notif.id);
    try {
      await kitchenOrdersApi.advanceStatus(orderId, "ACCEPTED");
      await notificationsApi.markRead(notif.id);
      setItems((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true, data: { ...(n.data ?? {}), accepted: true } } : n)),
      );
      setUnreadCount((c) => (notif.isRead ? c : Math.max(0, c - 1)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not accept this order");
    } finally {
      setAcceptingId(null);
    }
  };

  const groups = groupByDay(items);

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
        action={
          <Button variant="outline" onClick={handleMarkAllRead} loading={isMarkingAll} disabled={unreadCount === 0}>
            <Check size={14} /> Mark all read
          </Button>
        }
      />

      <TabBar<NotificationCategory | "ALL">
        className="mb-6"
        tabs={CATEGORY_TABS.map((tab) => ({ key: tab.key ?? "ALL", label: tab.label }))}
        activeKey={category ?? "ALL"}
        onChange={(key) => setCategory(key === "ALL" ? undefined : key)}
      />

      {error ? <p className="text-xs font-semibold text-red-600 mb-4">{error}</p> : null}

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner className="w-8 h-8 text-[#087F78]" />
        </div>
      ) : items.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Bell />}
            title="No notifications yet"
            description="Order updates, subscription and reel activity will show up here."
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 px-1">{group.label}</p>
              <Card className="!p-0 overflow-hidden">
                <div className="divide-y divide-slate-50">
                  {group.items.map((notif) => (
                    <NotificationRow
                      key={notif.id}
                      notif={notif}
                      onTap={() => handleTap(notif)}
                      onAccept={() => handleAccept(notif)}
                      isAccepting={acceptingId === notif.id}
                    />
                  ))}
                </div>
              </Card>
            </div>
          ))}

          {hasNextPage ? (
            <div className="flex justify-center">
              <Button variant="ghost" onClick={() => load(category, page + 1, true)} loading={isLoadingMore}>
                <RefreshCcw size={13} /> Load more
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function NotificationRow({
  notif,
  onTap,
  onAccept,
  isAccepting,
}: {
  notif: KitchenNotification;
  onTap: () => void;
  onAccept: () => void;
  isAccepting: boolean;
}) {
  const Icon = CATEGORY_ICON[notif.category];
  const showAccept = notif.category === "ORDER" && notif.data?.action === "ACCEPT_ORDER" && !notif.data?.accepted;
  const wasAccepted = Boolean(notif.data?.accepted);

  return (
    <button
      onClick={onTap}
      className={`w-full flex items-start gap-3 px-5 py-4 text-left transition-colors ${
        notif.isRead ? "bg-white" : "bg-[#087F78]/[0.03] border-l-[3px] border-[#087F78]"
      }`}
    >
      <div className="w-9 h-9 rounded-xl bg-[#087F78]/10 text-[#087F78] flex items-center justify-center shrink-0">
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`text-sm ${notif.isRead ? "font-semibold text-slate-700" : "font-extrabold text-slate-900"}`}>{notif.title}</p>
          {!notif.isRead ? <span className="w-1.5 h-1.5 rounded-full bg-[#087F78] shrink-0" /> : null}
        </div>
        <p className="text-xs text-slate-500 mt-0.5">{notif.body}</p>
        <p className="text-[11px] text-slate-400 mt-1">
          {new Date(notif.createdAt).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
        </p>
        {showAccept ? (
          <div className="mt-2" onClick={(e) => e.stopPropagation()}>
            <Button
              className="!py-2 !px-4 !text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onAccept();
              }}
              loading={isAccepting}
            >
              Accept order
            </Button>
          </div>
        ) : wasAccepted ? (
          <div className="mt-2">
            <Badge tone="success">Accepted</Badge>
          </div>
        ) : null}
      </div>
    </button>
  );
}
