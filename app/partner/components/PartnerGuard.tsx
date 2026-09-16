"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useKitchenAuth } from "../../../lib/KitchenAuthProvider";
import { Spinner } from "./ui";
import PartnerShell from "./PartnerShell";

function FullScreenLoader() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8F6F6]">
      <Spinner className="w-8 h-8 text-[#BA2121]" />
    </div>
  );
}

/**
 * Routes by `onboarding.status`, not just "has a token" — a kitchen mid-way
 * through onboarding always lands back on the wizard, an approved one always
 * lands in the dashboard shell, and `/partner/login` is the only page a
 * signed-out visitor can reach.
 */
export default function PartnerGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoading, isAuthenticated, onboarding } = useKitchenAuth();

  const isLoginPage = pathname === "/partner/login";
  const isOnboardingPage = pathname === "/partner/onboarding";
  const isActive = onboarding?.status === "ACTIVE";
  // The review step explicitly sends a kitchen to add its first dish before it
  // can submit — "you can add your menu anytime, even while waiting for
  // approval" only holds if the guard actually lets them through to it.
  const hasKitchen = Boolean(onboarding?.kitchenId);
  const isPreApprovalMenuAccess = hasKitchen && (pathname?.startsWith("/partner/menu") || pathname?.startsWith("/partner/stories"));

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      if (!isLoginPage) router.replace("/partner/login");
      return;
    }

    if (isLoginPage || (isActive && isOnboardingPage)) {
      router.replace(isActive ? "/partner/dashboard" : "/partner/onboarding");
      return;
    }

    if (!isActive && !isOnboardingPage && !isPreApprovalMenuAccess) {
      router.replace("/partner/onboarding");
    }
  }, [isLoading, isAuthenticated, isActive, isLoginPage, isOnboardingPage, isPreApprovalMenuAccess, router]);

  if (isLoginPage) return <>{children}</>;
  if (isLoading || !isAuthenticated) return <FullScreenLoader />;

  if (isActive) {
    // Approval can land here while the tab is still sitting on the wizard
    // (e.g. right after the dev "simulate approve" button) — bounce to the
    // dashboard rather than rendering the onboarding page inside the shell.
    if (isOnboardingPage) return <FullScreenLoader />;
    return <PartnerShell>{children}</PartnerShell>;
  }

  if (isOnboardingPage) return <>{children}</>;
  if (isPreApprovalMenuAccess) return <PartnerShell>{children}</PartnerShell>;
  return <FullScreenLoader />;
}
