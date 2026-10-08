"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Clapperboard, Eye, Heart, Music, Pause, Pencil, Play, Plus, Scissors, Share2, ShoppingBag, SlidersHorizontal, Sparkles, Trash2, X } from "lucide-react";
import { ApiError, kitchenMenuApi, kitchenReelsApi, kitchenUploadApi, premiumApi } from "../../../lib/kitchenApi";
import type { KitchenReel, MealDetail } from "../../../lib/types";
import { Badge, Button, Card, ConfirmDialog, EmptyState, Field, PageHeader, Spinner, TextArea, TextInput, Select } from "../components/ui";

const CAPTION_MAX = 150;
const MAX_HASHTAGS = 10; // backend allows at most 10 hashtags
const MIN_DURATION_SEC = 3; // backend accepts 3-120s
const MAX_DURATION_SEC = 120;

/** "#a, b  #c" -> ["a","b","c"] (max 10). */
function parseHashtags(input: string): string[] {
  return input
    .split(/[\s,]+/)
    .map((tag) => tag.trim().replace(/^#+/, ""))
    .filter(Boolean)
    .slice(0, MAX_HASHTAGS);
}

export default function ReelsPage() {
  const [reels, setReels] = useState<KitchenReel[]>([]);
  const [meals, setMeals] = useState<MealDetail[]>([]);
  const [isElite, setIsElite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isComposing, setIsComposing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const [reelList, mealList, premium] = await Promise.all([
        kitchenReelsApi.list(),
        kitchenMenuApi.list().catch(() => [] as MealDetail[]),
        premiumApi.subscription().catch(() => null),
      ]);
      setReels(reelList);
      setMeals(mealList);
      setIsElite(premium?.tier === "ELITE" && premium.status === "ACTIVE");
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load your reels, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleTogglePause = async (reel: KitchenReel) => {
    setActionError(null);
    setBusyId(reel.id);
    try {
      if (reel.isPaused) await kitchenReelsApi.resume(reel.id);
      else await kitchenReelsApi.pause(reel.id);
      setReels((prev) => prev.map((r) => (r.id === reel.id ? { ...r, isPaused: !reel.isPaused } : r)));
    } catch (err) {
      const fallback = reel.isPaused ? "Could not resume this reel" : "Could not pause this reel";
      setActionError(err instanceof ApiError ? err.message : fallback);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setPendingDeleteId(null);
    setActionError(null);
    setBusyId(id);
    try {
      await kitchenReelsApi.archive(id);
      setReels((prev) => prev.filter((r) => r.id !== id));
      if (editingId === id) setEditingId(null);
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not delete this reel, please try again");
    } finally {
      setBusyId(null);
    }
  };

  const visibleReels = reels.filter((r) => r.status !== "ARCHIVED");
  const editingReel = visibleReels.find((r) => r.id === editingId) ?? null;

  return (
    <div>
      <PageHeader
        title="Reels"
        subtitle="Short dish videos that appear in every customer's Food Feed until you take them down"
        action={
          <Button onClick={() => setIsComposing((v) => !v)}>
            {isComposing ? <X size={16} /> : <Plus size={16} />} {isComposing ? "Cancel" : "New reel"}
          </Button>
        }
      />
      {actionError ? (
        <p role="alert" className="text-xs font-semibold text-red-600 mb-4">
          {actionError}
        </p>
      ) : null}

      {isComposing ? (
        <Card className="mb-6">
          <ComposeReel
            meals={meals}
            isElite={isElite}
            onPublished={() => {
              setIsComposing(false);
              load();
            }}
            onCancel={() => setIsComposing(false)}
          />
        </Card>
      ) : null}

      {editingReel ? (
        <Card className="mb-6">
          <EditReel
            reel={editingReel}
            onSaved={(updated) => {
              setEditingId(null);
              setReels((prev) => prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r)));
            }}
            onCancel={() => setEditingId(null)}
          />
        </Card>
      ) : null}

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner className="w-8 h-8 text-[#087F78]" />
        </div>
      ) : error ? (
        <Card>
          <EmptyState title="Couldn't load your reels" description={error} action={<Button onClick={load}>Retry</Button>} />
        </Card>
      ) : visibleReels.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Clapperboard />}
            title="No reels yet"
            description="Post a short video of a dish — it shows up in every customer's Food Feed until you take it down."
            action={
              !isComposing ? (
                <Button onClick={() => setIsComposing(true)}>
                  <Plus size={16} /> Post your first reel
                </Button>
              ) : undefined
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visibleReels.map((reel) => (
            <Card key={reel.id} className="!p-0 overflow-hidden flex flex-col">
              <div className="w-full aspect-[9/13] bg-slate-900 relative">
                {playingId === reel.id ? (
                  <video
                    src={reel.videoUrl}
                    poster={reel.thumbnailUrl ?? undefined}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain bg-black"
                    aria-label={reel.caption ? `Reel: ${reel.caption}` : "Reel video"}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setPlayingId(reel.id)}
                    className="group w-full h-full flex items-center justify-center"
                    aria-label={`Play reel${reel.caption ? `: ${reel.caption}` : ""}`}
                  >
                    {reel.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={reel.thumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <Clapperboard className="text-white/50" size={32} />
                    )}
                    <span className="relative w-12 h-12 rounded-full bg-black/55 text-white flex items-center justify-center backdrop-blur-sm group-hover:scale-105 transition-transform">
                      <Play size={20} className="ml-0.5" />
                    </span>
                  </button>
                )}
                {playingId !== reel.id && (reel.isPaused || reel.isSponsored || reel.status !== "PUBLISHED") ? (
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1.5 pointer-events-none">
                    {reel.status !== "PUBLISHED" ? <span className="rounded-full bg-white"><Badge>Draft</Badge></span> : null}
                    {reel.isPaused ? <span className="rounded-full bg-white"><Badge tone="warning">Paused</Badge></span> : null}
                    {reel.isSponsored ? (
                      <span className="rounded-full bg-white">
                        <Badge tone="brand">
                          <Sparkles size={11} /> Sponsored
                        </Badge>
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="p-4 flex flex-col gap-3 flex-1">
                {reel.mealName ? (
                  <span className="inline-flex items-center gap-1 self-start rounded-full bg-[#FFC21A]/20 px-2.5 py-1 text-[11px] font-bold text-slate-800">
                    <ShoppingBag size={11} /> {reel.mealName}
                  </span>
                ) : null}

                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                  <span className="flex items-center gap-1" title="Views" aria-label={`${reel.viewCount} views`}>
                    <Eye size={13} /> {reel.viewCount}
                  </span>
                  <span className="flex items-center gap-1" title="Likes" aria-label={`${reel.likeCount} likes`}>
                    <Heart size={13} /> {reel.likeCount}
                  </span>
                  <span className="flex items-center gap-1" title="Shares" aria-label={`${reel.shareCount} shares`}>
                    <Share2 size={13} /> {reel.shareCount}
                  </span>
                  <span className="flex items-center gap-1" title="Orders from this reel" aria-label={`${reel.orderCount} orders`}>
                    <ShoppingBag size={13} /> {reel.orderCount}
                  </span>
                </div>

                {reel.caption ? <p className="text-sm font-medium text-slate-700 line-clamp-2 break-words">{reel.caption}</p> : null}
                {reel.hashtags.length > 0 ? (
                  <p className="text-xs font-semibold text-[#087F78] line-clamp-1 break-words">{reel.hashtags.map((t) => `#${t}`).join(" ")}</p>
                ) : null}

                <div className="flex items-center gap-1 mt-auto pt-1">
                  <button
                    type="button"
                    onClick={() => handleTogglePause(reel)}
                    disabled={busyId === reel.id}
                    className="w-11 h-11 rounded-xl text-slate-600 hover:bg-slate-100 flex items-center justify-center disabled:opacity-50"
                    aria-label={reel.isPaused ? "Resume reel" : "Pause reel"}
                    title={reel.isPaused ? "Resume reel" : "Pause reel"}
                  >
                    {busyId === reel.id ? <Spinner /> : reel.isPaused ? <Play size={16} className="text-[#087F78]" /> : <Pause size={16} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(reel.id)}
                    className="w-11 h-11 rounded-xl text-slate-600 hover:bg-slate-100 flex items-center justify-center"
                    aria-label="Edit caption"
                    title="Edit caption and hashtags"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDeleteId(reel.id)}
                    disabled={busyId === reel.id}
                    className="w-11 h-11 rounded-xl text-red-600 hover:bg-red-50 flex items-center justify-center disabled:opacity-50"
                    aria-label="Delete reel"
                    title="Delete reel"
                  >
                    <Trash2 size={16} />
                  </button>
                  {reel.status === "PUBLISHED" && !reel.isPaused ? (
                    <Link href="/partner/ads" className="ml-auto text-xs font-bold text-[#087F78] hover:underline px-2 py-3">
                      Promote
                    </Link>
                  ) : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Take down this reel?"
        description="It will stop showing to customers immediately."
        confirmLabel="Delete"
        onConfirm={() => pendingDeleteId && handleDelete(pendingDeleteId)}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}

function EditReel({ reel, onSaved, onCancel }: { reel: KitchenReel; onSaved: (updated: KitchenReel) => void; onCancel: () => void }) {
  const [caption, setCaption] = useState(reel.caption ?? "");
  const [hashtagsInput, setHashtagsInput] = useState(reel.hashtags.map((t) => `#${t}`).join(" "));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    setIsSaving(true);
    try {
      const updated = await kitchenReelsApi.update(reel.id, { caption: caption.trim(), hashtags: parseHashtags(hashtagsInput) });
      onSaved(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save, please try again");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-slate-800">Edit reel</h3>
        <button type="button" onClick={onCancel} className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-600" aria-label="Close editor">
          <X size={18} />
        </button>
      </div>
      <Field label={`Caption (${caption.length}/${CAPTION_MAX})`}>
        <TextArea rows={2} value={caption} onChange={(e) => setCaption(e.target.value.slice(0, CAPTION_MAX))} placeholder="Fresh out of the tandoor" />
      </Field>
      <Field label={`Hashtags (up to ${MAX_HASHTAGS}, comma or space separated)`}>
        <TextInput value={hashtagsInput} onChange={(e) => setHashtagsInput(e.target.value)} placeholder="#homefood #thali" />
      </Field>
      {error ? (
        <p role="alert" className="text-xs font-semibold text-red-600">
          {error}
        </p>
      ) : null}
      <div className="flex gap-3">
        <Button onClick={handleSave} loading={isSaving}>
          Save changes
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

/** Grab a still frame from the local video file for use as the reel thumbnail. Best-effort. */
function captureThumbnail(video: HTMLVideoElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    try {
      const width = video.videoWidth;
      const height = video.videoHeight;
      if (!width || !height) return resolve(null);
      const scale = Math.min(1, 480 / width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(null);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.8);
    } catch {
      resolve(null);
    }
  });
}

function ComposeReel({ meals, isElite, onPublished, onCancel }: { meals: MealDetail[]; isElite: boolean; onPublished: () => void; onCancel: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [durationSec, setDurationSec] = useState<number | null>(null);
  const [caption, setCaption] = useState("");
  const [hashtagsInput, setHashtagsInput] = useState("");
  const [mealId, setMealId] = useState("");
  const [toolNotice, setToolNotice] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  const handlePickFile = (picked: File | null) => {
    setError(null);
    setDurationSec(null);
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    if (picked && !picked.type.startsWith("video/")) {
      previewRef.current = null;
      setFile(null);
      setPreviewUrl(null);
      setError("Please choose a video file (MP4, MOV or WebM).");
      return;
    }
    const url = picked ? URL.createObjectURL(picked) : null;
    previewRef.current = url;
    setFile(picked);
    setPreviewUrl(url);
  };

  const handleEditTool = (comingSoon: string) => {
    setToolNotice(isElite ? comingSoon : "This tool is part of AI Video Editing Tools, included in the Elite plan.");
  };

  const durationProblem =
    durationSec !== null && (durationSec < MIN_DURATION_SEC || durationSec > MAX_DURATION_SEC)
      ? `Reels must be between ${MIN_DURATION_SEC} and ${MAX_DURATION_SEC} seconds — this video is ${Math.round(durationSec)}s.`
      : null;

  const handlePublish = async () => {
    if (!file) return;
    if (durationProblem) return setError(durationProblem);
    setError(null);
    setIsPublishing(true);
    try {
      const { url: videoUrl } = await kitchenUploadApi.upload(file, "REEL_VIDEO");

      // Thumbnail is a nicety — never block the post on it.
      let thumbnailUrl: string | undefined;
      if (videoRef.current) {
        try {
          const blob = await captureThumbnail(videoRef.current);
          if (blob) {
            const thumbFile = new File([blob], "reel-thumbnail.jpg", { type: "image/jpeg" });
            thumbnailUrl = (await kitchenUploadApi.upload(thumbFile, "REEL_THUMBNAIL")).url;
          }
        } catch {
          thumbnailUrl = undefined;
        }
      }

      const hashtags = parseHashtags(hashtagsInput);
      await kitchenReelsApi.publish({
        videoUrl,
        thumbnailUrl,
        caption: caption.trim() || undefined,
        hashtags: hashtags.length ? hashtags : undefined,
        mealId: mealId || undefined,
        durationSec: durationSec !== null ? Math.round(durationSec) : undefined,
      });
      onPublished();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not post the reel, please try again");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-sm font-extrabold text-slate-800">New reel</h3>

      <Field label="Video (required, up to 20 MB)">
        {previewUrl ? (
          <div className="relative w-40 aspect-[9/13] rounded-xl overflow-hidden bg-slate-900">
            <video
              ref={videoRef}
              src={previewUrl}
              controls
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-contain"
              onLoadedMetadata={(e) => setDurationSec(Number.isFinite(e.currentTarget.duration) ? e.currentTarget.duration : null)}
              onError={() => setError("This video couldn't be read in your browser. Try an MP4 file.")}
            />
            <button
              type="button"
              onClick={() => handlePickFile(null)}
              className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center"
              aria-label="Remove video"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-40 aspect-[9/13] rounded-xl border-2 border-dashed border-slate-200 cursor-pointer text-xs font-bold text-slate-400 hover:border-[#087F78]/30 hover:text-[#087F78] transition-colors focus-within:border-[#087F78]/50">
            <Clapperboard size={22} className="mb-1" />
            Add video
            <input type="file" accept="video/*" className="sr-only" onChange={(e) => handlePickFile(e.target.files?.[0] ?? null)} />
          </label>
        )}
      </Field>

      {file ? (
        <div>
          <div className="flex flex-wrap gap-2">
            <EditToolPill icon={Scissors} label="Trim" onClick={() => handleEditTool("Trimming your reel is on the way.")} />
            <EditToolPill icon={Music} label="Music" onClick={() => handleEditTool("Adding music to your reel is on the way.")} />
            <EditToolPill icon={SlidersHorizontal} label="Filters" onClick={() => handleEditTool("Video filters are on the way.")} />
          </div>
          {toolNotice ? (
            <p className="mt-2 text-xs font-semibold text-slate-500">
              {toolNotice}{" "}
              {!isElite ? (
                <Link href="/partner/premium" className="text-[#087F78] underline">
                  View Elite plan
                </Link>
              ) : null}
            </p>
          ) : null}
        </div>
      ) : null}

      <Field label={`Caption (optional) — ${caption.length}/${CAPTION_MAX}`}>
        <TextArea rows={2} value={caption} onChange={(e) => setCaption(e.target.value.slice(0, CAPTION_MAX))} placeholder="Fresh out of the tandoor" />
      </Field>

      <Field label={`Hashtags (optional) — up to ${MAX_HASHTAGS}, comma or space separated`}>
        <TextInput value={hashtagsInput} onChange={(e) => setHashtagsInput(e.target.value)} placeholder="#homefood #thali" />
      </Field>

      {meals.length > 0 ? (
        <Field label="Link a dish (optional) — makes the reel shoppable, with order tracking">
          <Select value={mealId} onChange={(e) => setMealId(e.target.value)}>
            <option value="">No dish linked</option>
            {meals.map((meal) => (
              <option key={meal.id} value={meal.id}>
                {meal.name} — ₹{meal.price}
                {meal.isAvailable ? "" : " (paused)"}
              </option>
            ))}
          </Select>
        </Field>
      ) : null}

      {(error ?? durationProblem) ? (
        <p role="alert" className="text-xs font-semibold text-red-600">
          {error ?? durationProblem}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <Button onClick={handlePublish} disabled={!file || Boolean(durationProblem)} loading={isPublishing}>
          {isPublishing ? "Uploading…" : "Post reel"}
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={isPublishing}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

function EditToolPill({ icon: Icon, label, onClick }: { icon: React.ComponentType<{ size?: number }>; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-600 hover:border-[#087F78]/30 hover:text-[#087F78] transition-colors"
    >
      <Icon size={13} /> {label}
    </button>
  );
}
