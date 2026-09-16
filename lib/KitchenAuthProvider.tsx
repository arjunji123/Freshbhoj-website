"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, kitchenAuthApi, onboardingApi, setOnSessionExpired } from "./kitchenApi";
import type { KitchenTokenPair, OnboardingStatus } from "./types";

interface KitchenAuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  onboarding: OnboardingStatus | null;
  /** Set when a `refresh()` failed for a reason other than a real session loss (network blip, 500, …). */
  loadError: string | null;
  refresh: () => Promise<void>;
  setSession: (tokens: KitchenTokenPair) => Promise<void>;
  logout: () => void;
}

const KitchenAuthContext = createContext<KitchenAuthState | null>(null);

/**
 * Wraps every `/partner/**` page. `onboarding` (from `GET /partner/onboarding/status`)
 * is the single source of truth for "where is this kitchen" — its `status` and
 * `currentStep` drive every routing decision in `app/partner/layout.tsx`, rather
 * than trusting a stale cached account object across sessions.
 */
export function KitchenAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [onboarding, setOnboarding] = useState<OnboardingStatus | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!kitchenAuthApi.getTokens()) {
      setOnboarding(null);
      setLoadError(null);
      setIsLoading(false);
      return;
    }
    try {
      setOnboarding(await onboardingApi.status());
      setLoadError(null);
    } catch (err) {
      // kitchenApi's request() already tried a token refresh on a 401 and,
      // if that also failed, cleared tokens and threw this exact ApiError —
      // that's the only case that's a real session loss. Anything else
      // (network blip, a 500, …) must NOT clear onboarding/log the user out,
      // since the session itself is still perfectly valid.
      const isRealSessionLoss =
        (err instanceof ApiError && err.status === 401) || kitchenAuthApi.getTokens() === null;
      if (isRealSessionLoss) {
        setOnboarding(null);
        setLoadError(null);
      } else {
        setLoadError(err instanceof ApiError ? err.message : "Could not load your account, please try again");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setOnSessionExpired(() => {
      setOnboarding(null);
      router.replace("/partner/login");
    });
    refresh();
    return () => setOnSessionExpired(null);
  }, [refresh, router]);

  const setSession = useCallback(
    async (tokens: KitchenTokenPair) => {
      kitchenAuthApi.setTokens(tokens);
      setIsLoading(true);
      await refresh();
    },
    [refresh],
  );

  const logout = useCallback(() => {
    kitchenAuthApi.logout().catch(() => undefined);
    kitchenAuthApi.setTokens(null);
    setOnboarding(null);
    router.replace("/partner/login");
  }, [router]);

  return (
    <KitchenAuthContext.Provider
      value={{ isLoading, isAuthenticated: Boolean(onboarding), onboarding, loadError, refresh, setSession, logout }}
    >
      {children}
    </KitchenAuthContext.Provider>
  );
}

export function useKitchenAuth(): KitchenAuthState {
  const ctx = useContext(KitchenAuthContext);
  if (!ctx) throw new Error("useKitchenAuth must be used within KitchenAuthProvider");
  return ctx;
}
