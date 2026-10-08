"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Clock, RotateCcw, Send, Sparkles, XCircle } from "lucide-react";
import { ApiError, bhojaiApi } from "../../../lib/kitchenApi";
import type { BhojAiHistoryItem, BhojAiMessageRole } from "../../../lib/types";
import { Badge, Card, GRADIENT_BG, Spinner } from "../components/ui";

interface ChatMessage {
  id: string;
  role: BhojAiMessageRole;
  text: string | null;
  card: Record<string, unknown> | null;
}

const QUICK_ACTIONS = [
  "Check my FSSAI status",
  "What documents do I need?",
  "How much does this cost?",
  "Show my recent orders",
];

function humanizeStage(stage: string): string {
  return stage
    .toLowerCase()
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

export default function BhojAiPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bhojaiApi
      .history()
      .then((res) => {
        setMessages(res.messages.map((m: BhojAiHistoryItem) => ({ id: m.id, role: m.role, text: m.text, card: m.card })));
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "Could not load your conversation");
      })
      .finally(() => setIsLoadingHistory(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;
    setError(null);
    setInput("");
    const userMessageId = `local-${Date.now()}`;
    setMessages((prev) => [...prev, { id: userMessageId, role: "USER", text: trimmed, card: null }]);
    setIsSending(true);
    try {
      const res = await bhojaiApi.sendMessage(trimmed);
      setMessages((prev) => [...prev, { id: `local-${Date.now()}-reply`, role: "MODEL", text: res.message, card: res.card }]);
    } catch (err) {
      // Take the failed message back out of the thread and give the text back to the partner to resend.
      setMessages((prev) => prev.filter((m) => m.id !== userMessageId));
      setInput((current) => current || trimmed);
      setError(err instanceof ApiError ? err.message : "BhojAI couldn't reply, please try again");
    } finally {
      setIsSending(false);
    }
  };

  const handleReset = async () => {
    if (isResetting) return;
    setIsResetting(true);
    setError(null);
    try {
      await bhojaiApi.reset();
      setMessages([]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not start a new conversation");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl text-white flex items-center justify-center shrink-0" style={GRADIENT_BG}>
              <Sparkles size={16} />
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">BhojAI</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1 sm:ml-[46px]">Your AI assistant — grounded in your own kitchen&apos;s data</p>
        </div>
        <button
          onClick={handleReset}
          disabled={isResetting || messages.length === 0}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#087F78] transition-colors disabled:opacity-40 disabled:pointer-events-none shrink-0"
        >
          <RotateCcw size={13} className={isResetting ? "animate-spin" : ""} />
          New conversation
        </button>
      </div>

      <Card className="!p-0 overflow-hidden flex flex-col h-[68vh] min-h-[440px]">
        <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-4">
          {isLoadingHistory ? (
            <div className="flex-1 flex items-center justify-center">
              <Spinner className="w-6 h-6 text-[#087F78]" />
            </div>
          ) : messages.length === 0 ? (
            <EmptyChatState onPick={handleSend} />
          ) : (
            messages.map((m) => <MessageBubble key={m.id} message={m} />)
          )}
          {isSending ? <TypingBubble /> : null}
          <div ref={bottomRef} />
        </div>

        {error ? <p className="text-xs font-semibold text-red-600 px-5 pb-2">{error}</p> : null}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-3 border-t border-slate-100 px-4 py-3 shrink-0"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask BhojAI anything…"
            maxLength={2000}
            disabled={isSending}
            className="flex-1 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 input-gradient-focus placeholder:text-slate-400 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isSending || !input.trim()}
            className="w-11 h-11 shrink-0 rounded-xl text-white flex items-center justify-center disabled:opacity-40 transition-transform active:scale-95"
            style={GRADIENT_BG}
            aria-label="Send"
          >
            <Send size={16} />
          </button>
        </form>
      </Card>
    </div>
  );
}

function EmptyChatState({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
      <div className="w-14 h-14 rounded-2xl text-white flex items-center justify-center mb-4" style={GRADIENT_BG}>
        <Sparkles size={22} />
      </div>
      <h3 className="text-base font-extrabold text-slate-900 mb-1">Ask me anything</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-6">
        FSSAI status, documents, pricing, your recent orders — I can look up your real data and answer directly.
      </p>
      <div className="flex flex-wrap justify-center gap-2 max-w-md">
        {QUICK_ACTIONS.map((q) => (
          <button
            key={q}
            onClick={() => onPick(q)}
            className="px-3.5 py-2 rounded-full text-xs font-bold bg-[#087F78]/10 text-[#087F78] hover:bg-[#087F78]/15 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="bg-slate-100 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "USER";
  return (
    <div className={`flex flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
      {message.text ? (
        <div
          className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm font-medium whitespace-pre-wrap break-words ${
            isUser ? "rounded-br-md text-white" : "rounded-bl-md bg-slate-100 text-slate-800"
          }`}
          style={isUser ? GRADIENT_BG : undefined}
        >
          {message.text}
        </div>
      ) : null}
      {message.card ? <BhojAiCard card={message.card} /> : null}
    </div>
  );
}

function BhojAiCard({ card }: { card: Record<string, unknown> }) {
  const type = card.type as string | undefined;

  if (type === "FSSAI_STATUS") {
    const progressPercent = Number(card.progressPercent ?? 0);
    const estimatedDaysLeft = card.estimatedDaysLeft as number | null;
    const timeline = (card.timeline as { stage: string; isComplete: boolean; isCurrent: boolean }[] | undefined) ?? [];
    return (
      <div className="max-w-[85%] w-full rounded-2xl rounded-bl-md border border-slate-100 bg-white shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">FSSAI application status</p>
          <Badge tone="brand">{progressPercent}%</Badge>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-100 mb-4 overflow-hidden">
          <div className="h-full rounded-full" style={{ ...GRADIENT_BG, width: `${Math.min(100, Math.max(0, progressPercent))}%` }} />
        </div>
        <div className="flex flex-col gap-2.5">
          {timeline.map((step) => (
            <div key={step.stage} className="flex items-center gap-2.5">
              {step.isComplete ? (
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
              ) : step.isCurrent ? (
                <Clock size={15} className="text-amber-500 shrink-0" />
              ) : (
                <span className="w-[15px] h-[15px] rounded-full border-2 border-slate-200 shrink-0" />
              )}
              <p className={`text-xs font-bold ${step.isCurrent ? "text-slate-900" : step.isComplete ? "text-slate-600" : "text-slate-400"}`}>
                {humanizeStage(step.stage)}
              </p>
            </div>
          ))}
        </div>
        {estimatedDaysLeft !== null && estimatedDaysLeft !== undefined ? (
          <p className="text-[11px] text-slate-400 mt-3">~{estimatedDaysLeft} day{estimatedDaysLeft === 1 ? "" : "s"} left (estimate)</p>
        ) : null}
        <Link href="/partner/fssai-assistance" className="inline-flex items-center gap-1 text-xs font-bold text-[#087F78] mt-3">
          Open FSSAI Assistance <ArrowRight size={12} />
        </Link>
      </div>
    );
  }

  if (type === "DOCUMENT_REJECTED") {
    const rejectionReason = card.rejectionReason as string | null;
    const rejectedDocuments = (card.rejectedDocuments as { type: string; remarks: string | null }[] | undefined) ?? [];
    const nextSteps = (card.nextSteps as string[] | undefined) ?? [];
    return (
      <div className="max-w-[85%] w-full rounded-2xl rounded-bl-md border border-red-100 bg-red-50 p-4">
        <div className="flex items-start gap-2.5 mb-3">
          <XCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-extrabold text-red-700 uppercase tracking-wide">Documents need changes</p>
            {rejectionReason ? <p className="text-xs text-red-600 mt-1">{rejectionReason}</p> : null}
          </div>
        </div>
        {rejectedDocuments.length ? (
          <div className="flex flex-col gap-1.5 mb-3">
            {rejectedDocuments.map((d, i) => (
              <div key={`${d.type}-${i}`} className="flex items-start gap-2">
                <AlertTriangle size={12} className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-xs font-semibold text-red-700">
                  {humanizeStage(d.type)}
                  {d.remarks ? <span className="font-normal text-red-500"> — {d.remarks}</span> : null}
                </p>
              </div>
            ))}
          </div>
        ) : null}
        {nextSteps.length ? (
          <ul className="flex flex-col gap-1.5 mb-3">
            {nextSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-red-600">
                <span className="w-1 h-1 rounded-full bg-red-400 mt-1.5 shrink-0" />
                {step}
              </li>
            ))}
          </ul>
        ) : null}
        <Link
          href="/partner/fssai-assistance"
          className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-white rounded-xl px-3 py-2 hover:bg-red-100/60 transition-colors"
        >
          Re-upload documents <ArrowRight size={12} />
        </Link>
      </div>
    );
  }

  if (type === "ESCALATION_CREATED") {
    return (
      <Badge tone="brand">
        <CheckCircle2 size={12} /> Connected you with a FreshBhoj specialist
      </Badge>
    );
  }

  return null;
}
