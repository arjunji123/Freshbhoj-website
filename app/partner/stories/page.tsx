"use client";

import { useEffect, useState } from "react";
import { Eye, Heart, Pencil, Plus, Share2, ShoppingBag, Trash2, Video, X } from "lucide-react";
import { ApiError, kitchenMenuApi, kitchenStoriesApi, kitchenUploadApi } from "../../../lib/kitchenApi";
import type { KitchenStory, MealDetail } from "../../../lib/types";
import { Badge, Button, Card, EmptyState, Field, PageHeader, Select, Spinner, TextArea, TextInput } from "../components/ui";

function timeLeft(expiresAt: string): string {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return "Expired";
  const hours = Math.floor(ms / (1000 * 60 * 60));
  return hours > 0 ? `${hours}h left` : `${Math.max(1, Math.floor(ms / 60000))}m left`;
}

export default function StoriesPage() {
  const [stories, setStories] = useState<KitchenStory[]>([]);
  const [meals, setMeals] = useState<MealDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isComposing, setIsComposing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const [storyList, mealList] = await Promise.all([kitchenStoriesApi.list(), kitchenMenuApi.list()]);
      setStories(storyList);
      setMeals(mealList);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDeactivate = async (id: string) => {
    if (!window.confirm("Remove this story? It disappears from the customer app immediately.")) return;
    setBusyId(id);
    try {
      await kitchenStoriesApi.deactivate(id);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not remove, please try again");
    } finally {
      setBusyId(null);
    }
  };

  const activeStories = stories.filter((s) => s.isActive && new Date(s.expiresAt) > new Date());
  const editingStory = activeStories.find((s) => s.id === editingId) ?? null;

  return (
    <div>
      <PageHeader
        title="Stories"
        subtitle="Show off today's specials — live for 24 hours, with real engagement stats"
        action={
          <Button onClick={() => setIsComposing((v) => !v)}>
            <Plus size={16} /> {isComposing ? "Cancel" : "New story"}
          </Button>
        }
      />
      {error ? <p className="text-xs font-semibold text-red-600 mb-4">{error}</p> : null}

      {isComposing ? (
        <Card className="mb-6">
          <ComposeStory
            meals={meals}
            onPublished={() => {
              setIsComposing(false);
              load();
            }}
          />
        </Card>
      ) : null}

      {editingStory ? (
        <Card className="mb-6">
          <EditCaption
            story={editingStory}
            onSaved={() => {
              setEditingId(null);
              load();
            }}
            onCancel={() => setEditingId(null)}
          />
        </Card>
      ) : null}

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner className="w-8 h-8 text-[#BA2121]" />
        </div>
      ) : activeStories.length === 0 ? (
        <Card>
          <EmptyState title="No active stories" description="Publish one to show up in the customer app's Kitchen Stories rail." />
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {activeStories.map((story) => (
            <Card key={story.id} className="!p-0 overflow-hidden">
              <div className="w-full aspect-[9/13] bg-slate-900 relative">
                {story.mediaType === "VIDEO" ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="text-white/60" size={28} />
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={story.mediaUrl} alt={story.caption ?? "Story"} className="w-full h-full object-cover" />
                )}
                <div className="absolute top-2 left-2">
                  <Badge tone="brand">{timeLeft(story.expiresAt)}</Badge>
                </div>
                <div className="absolute top-2 right-2 flex gap-1.5">
                  <button
                    onClick={() => setEditingId(story.id)}
                    className="w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center"
                    aria-label="Edit caption"
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={() => handleDeactivate(story.id)}
                    disabled={busyId === story.id}
                    className="w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center disabled:opacity-50"
                    aria-label="Delete story"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  {story.caption ? <p className="text-xs text-white font-semibold line-clamp-2 mb-2">{story.caption}</p> : null}
                  {story.mealName ? (
                    <div className="flex items-center gap-1 text-[10px] text-white/90 font-bold mb-2">
                      <ShoppingBag size={10} /> {story.mealName}
                    </div>
                  ) : null}
                  <div className="flex items-center gap-3 text-[11px] text-white/80 font-semibold">
                    <span className="flex items-center gap-1">
                      <Eye size={11} /> {story.viewCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={11} /> {story.likeCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 size={11} /> {story.shareCount}
                    </span>
                  </div>
                  {story.orderCount > 0 ? (
                    <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                      {story.orderCount} order{story.orderCount === 1 ? "" : "s"} from this story
                    </div>
                  ) : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function EditCaption({ story, onSaved, onCancel }: { story: KitchenStory; onSaved: () => void; onCancel: () => void }) {
  const [caption, setCaption] = useState(story.caption ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    setIsSaving(true);
    try {
      await kitchenStoriesApi.updateCaption(story.id, caption.trim());
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save, please try again");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-slate-800">Edit caption</h3>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
          <X size={18} />
        </button>
      </div>
      <Field label={`Caption (${caption.length}/150)`}>
        <TextInput value={caption} onChange={(e) => setCaption(e.target.value.slice(0, 150))} placeholder="Fresh out of the tandoor 🔥" />
      </Field>
      {error ? <p className="text-xs font-semibold text-red-600">{error}</p> : null}
      <Button onClick={handleSave} loading={isSaving} className="self-start">
        Save caption
      </Button>
    </div>
  );
}

function ComposeStory({ meals, onPublished }: { meals: MealDetail[]; onPublished: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [mealId, setMealId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePickFile = (picked: File | null) => {
    setFile(picked);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return picked ? URL.createObjectURL(picked) : null;
    });
  };

  const isVideo = file?.type.startsWith("video");

  const handlePublish = async () => {
    if (!file) return;
    setError(null);
    setIsUploading(true);
    try {
      const { url } = await kitchenUploadApi.upload(file, "STORY_MEDIA");
      const mediaType = isVideo ? "VIDEO" : "IMAGE";
      await kitchenStoriesApi.publish({
        mediaType,
        mediaUrl: url,
        caption: caption.trim() || undefined,
        mealId: mealId || undefined,
        durationSec: mediaType === "VIDEO" ? 15 : undefined,
      });
      onPublished();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not publish, please try again");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-sm font-extrabold text-slate-800">New story — live for 24 hours</h3>

      <Field label="Photo or short video (required)">
        {previewUrl ? (
          <div className="relative w-32 h-44 rounded-xl overflow-hidden bg-slate-900">
            {isVideo ? (
              <div className="w-full h-full flex items-center justify-center">
                <Video className="text-white/60" size={24} />
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            )}
            <button
              onClick={() => handlePickFile(null)}
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-32 h-44 rounded-xl border-2 border-dashed border-slate-200 cursor-pointer text-xs font-bold text-slate-400 hover:border-[#BA2121]/30 hover:text-[#BA2121] transition-colors">
            <Plus size={20} className="mb-1" />
            Add media
            <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => handlePickFile(e.target.files?.[0] ?? null)} />
          </label>
        )}
      </Field>

      <Field label={`Caption (optional) — ${caption.length}/150`}>
        <TextArea rows={2} value={caption} onChange={(e) => setCaption(e.target.value.slice(0, 150))} placeholder="Fresh out of the tandoor 🔥" />
      </Field>

      <Field label="Link a dish (optional) — makes the story shoppable, with order tracking">
        <Select value={mealId} onChange={(e) => setMealId(e.target.value)}>
          <option value="">No dish linked</option>
          {meals.map((meal) => (
            <option key={meal.id} value={meal.id}>
              {meal.name} — ₹{meal.price}
            </option>
          ))}
        </Select>
      </Field>

      {error ? <p className="text-xs font-semibold text-red-600">{error}</p> : null}
      <Button onClick={handlePublish} disabled={!file} loading={isUploading} className="self-start">
        Publish story
      </Button>
    </div>
  );
}
