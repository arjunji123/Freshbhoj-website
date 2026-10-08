"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BadgeCheck, Clock, MapPin, Star } from "lucide-react";
import { ApiError, kitchensPublicApi } from "../../../lib/kitchenApi";
import type { PublicKitchenDetail } from "../../../lib/types";
import { Badge, Spinner } from "../../partner/components/ui";

export default function PublicKitchenPage() {
  const params = useParams<{ slug: string }>();
  const [kitchen, setKitchen] = useState<PublicKitchenDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.slug) return;
    kitchensPublicApi
      .get(params.slug)
      .then(setKitchen)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load this kitchen"))
      .finally(() => setIsLoading(false));
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F4F8F6]">
        <Spinner className="w-8 h-8 text-[#0A8068]" />
      </div>
    );
  }

  if (error || !kitchen) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F4F8F6] px-6 text-center">
        <h1 className="text-lg font-extrabold text-slate-900 mb-2">Kitchen not found</h1>
        <p className="text-sm text-slate-500">{error ?? "This kitchen page doesn't exist or is no longer available."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F4F8F6]">
      <div className="relative w-full h-48 sm:h-64 bg-slate-200">
        {kitchen.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={kitchen.coverImage} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ background: "linear-gradient(169.21deg, #16B088 9%, #0A8068 77%, #074A5C 100%)" }} />
        )}
      </div>

      <div className="max-w-xl mx-auto px-6 -mt-12 pb-16 relative">
        <div className="w-24 h-24 rounded-3xl bg-white shadow-lg overflow-hidden flex items-center justify-center border-4 border-white mb-4">
          {kitchen.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={kitchen.logoUrl} alt={kitchen.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-extrabold text-slate-300">{kitchen.name[0]}</span>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] p-6">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-xl font-extrabold text-slate-900">{kitchen.name}</h1>
            {kitchen.isVerified ? <BadgeCheck size={18} className="text-[#0A8068] shrink-0" /> : null}
          </div>
          {kitchen.tagline ? <p className="text-sm text-slate-500 mb-3">{kitchen.tagline}</p> : null}

          <div className="flex items-center gap-2 flex-wrap mb-4">
            <Badge tone={kitchen.isOpenNow ? "success" : "neutral"}>{kitchen.isOpenNow ? "Open now" : "Closed"}</Badge>
            {kitchen.rating > 0 ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 rounded-full px-3 py-1">
                <Star size={11} className="text-amber-400 fill-amber-400" />
                {kitchen.rating.toFixed(1)} ({kitchen.ratingCount})
              </span>
            ) : null}
          </div>

          {kitchen.description ? <p className="text-sm text-slate-600 mb-5 leading-relaxed">{kitchen.description}</p> : null}

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
            {kitchen.locality || kitchen.city ? (
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <MapPin size={15} className="text-slate-400 shrink-0" />
                {[kitchen.locality, kitchen.city].filter(Boolean).join(", ")}
              </div>
            ) : null}
            <div className="flex items-center gap-2.5 text-sm text-slate-600">
              <Clock size={15} className="text-slate-400 shrink-0" />
              {kitchen.openingHours.opensAt} – {kitchen.openingHours.closesAt}
            </div>
          </div>

          <div className="flex items-center gap-4 mt-5 pt-4 border-t border-slate-100 text-xs text-slate-400 font-semibold">
            <span>{kitchen.followerCount} followers</span>
            <span>{kitchen.prepTimeMins} min prep time</span>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">Powered by FreshBhoj</p>
      </div>
    </div>
  );
}
