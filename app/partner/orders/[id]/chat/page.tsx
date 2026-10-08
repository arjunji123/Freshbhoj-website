"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Phone, Send } from "lucide-react";
import { ApiError, kitchenOrdersApi, orderChatApi } from "../../../../../lib/kitchenApi";
import type { KitchenAdvanceStatus, KitchenOrderCard, OrderChatMessage } from "../../../../../lib/types";
import { BackLink, Card, GRADIENT_BG, Spinner } from "../../../components/ui";

const POLL_MS = 12_000;

const QUICK_REPLIES: { label: string; body: string; advanceToStatus?: KitchenAdvanceStatus }[] = [
  { label: "Order is ready", body: "Your order is ready!" },
  { label: "5 more minutes", body: "Just need 5 more minutes, thanks for your patience!" },
  { label: "Out for delivery", body: "Your order is out for delivery!", advanceToStatus: "OUT_FOR_DELIVERY" },
];

const TRIGGERED_STATUS_LABEL: Partial<Record<string, string>> = {
  ACCEPTED: "Order accepted",
  PREPARING: "Started preparing",
  OUT_FOR_DELIVERY: "Marked out for delivery",
  CANCELLED: "Order cancelled",
};

export default function OrderChatPage() {
  const params = useParams<{ id: string }>();
  const orderId = params.id;

  const [order, setOrder] = useState<KitchenOrderCard | null>(null);
  const [messages, setMessages] = useState<OrderChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sendingKey, setSendingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadMessages = useCallback(async () => {
    try {
      setMessages(await orderChatApi.messages(orderId));
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load messages, please try again");
    }
  }, [orderId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const [orderRes] = await Promise.all([kitchenOrdersApi.detail(orderId), loadMessages()]);
        if (!cancelled) setOrder(orderRes);
      } catch (err) {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Could not load this order, please try again");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    pollRef.current = setInterval(loadMessages, POLL_MS);
    return () => {
      cancelled = true;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [orderId, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (body: string, advanceToStatus: KitchenAdvanceStatus | undefined, key: string) => {
    const trimmed = body.trim();
    if (!trimmed || sendingKey) return;
    setError(null);
    setSendingKey(key);
    try {
      const message = await orderChatApi.send(orderId, trimmed, advanceToStatus);
      setMessages((prev) => [...prev, message]);
      if (key === "freeform") setInput("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send this message, please try again");
    } finally {
      setSendingKey(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="w-8 h-8 text-[#087F78]" />
      </div>
    );
  }

  return (
    <div>
      <BackLink href="/partner/orders" label="Back to Orders" />

      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            #{order?.orderNumber ?? "—"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">{order?.customer.name ?? "Customer"}</p>
        </div>
        {order ? (
          <a
            href={`tel:${order.customer.phone}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#087F78] shrink-0"
          >
            <Phone size={13} /> {order.customer.phone}
          </a>
        ) : null}
      </div>

      <Card className="!p-0 overflow-hidden flex flex-col h-[68vh] min-h-[440px]">
        <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-4">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center px-6">
              <p className="text-sm text-slate-400">
                No messages yet — send an update below and the customer will see it right away.
              </p>
            </div>
          ) : (
            messages.map((m) => <MessageBubble key={m.id} message={m} />)
          )}
          <div ref={bottomRef} />
        </div>

        {error ? <p className="text-xs font-semibold text-red-600 px-5 pb-2">{error}</p> : null}

        <div className="flex flex-wrap gap-2 px-4 pb-3 shrink-0">
          {QUICK_REPLIES.map((q) => (
            <button
              key={q.label}
              onClick={() => send(q.body, q.advanceToStatus, q.label)}
              disabled={Boolean(sendingKey)}
              className="px-3.5 py-2 rounded-full text-xs font-bold bg-[#087F78]/10 text-[#087F78] hover:bg-[#087F78]/15 transition-colors disabled:opacity-50"
            >
              {sendingKey === q.label ? <Spinner className="w-3 h-3 inline-block" /> : q.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input, undefined, "freeform");
          }}
          className="flex items-center gap-3 border-t border-slate-100 px-4 py-3 shrink-0"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
            disabled={Boolean(sendingKey)}
            className="flex-1 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 input-gradient-focus placeholder:text-slate-400 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={Boolean(sendingKey) || !input.trim()}
            className="w-11 h-11 shrink-0 rounded-xl text-white flex items-center justify-center disabled:opacity-40 transition-transform active:scale-95"
            style={GRADIENT_BG}
            aria-label="Send"
          >
            {sendingKey === "freeform" ? <Spinner className="w-4 h-4" /> : <Send size={16} />}
          </button>
        </form>
      </Card>
    </div>
  );
}

function MessageBubble({ message }: { message: OrderChatMessage }) {
  const isKitchen = message.sender === "KITCHEN";
  const statusLabel = message.triggeredStatus ? TRIGGERED_STATUS_LABEL[message.triggeredStatus] : null;
  return (
    <div className={`flex flex-col gap-1 ${isKitchen ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm font-medium whitespace-pre-wrap break-words ${
          isKitchen ? "rounded-br-md text-white" : "rounded-bl-md bg-slate-100 text-slate-800"
        }`}
        style={isKitchen ? GRADIENT_BG : undefined}
      >
        {message.body}
      </div>
      {statusLabel ? (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide px-1">{statusLabel}</span>
      ) : null}
    </div>
  );
}
