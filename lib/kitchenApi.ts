import type {
  BhojAiHistoryResponse,
  BhojAiMessageResult,
  Campaign,
  CampaignReachEstimate,
  CampaignStatus,
  CampaignSuggestion,
  Cuisine,
  DashboardSummary,
  DayOfWeek,
  FssaiAssistanceDocumentType,
  FssaiAssistanceStatusResponse,
  HolidayOverride,
  KitchenAccount,
  KitchenAdvanceStatus,
  KitchenOrderCard,
  KitchenProfile,
  KitchenReel,
  KitchenStory,
  KitchenTokenPair,
  KitchenType,
  MealDetail,
  NotificationCategory,
  NotificationListResponse,
  NutritionAnalysisResult,
  OnboardingStatus,
  OperatingHoursDay,
  OrderChatMessage,
  OrderDetail,
  OrderStatus,
  Paginated,
  Payout,
  PayoutSummary,
  PremiumSubscription,
  PremiumTier,
  PremiumTierCatalog,
  PublicKitchenDetail,
  SubscriptionDelivery,
  SubscriptionDetail,
  SubscriptionListResponse,
  SubscriptionStatus,
  SuggestionListResponse,
  SuggestionStatus,
  TransactionListResponse,
  WalletSummary,
  WalletTopupResult,
  WalletTransactionListResponse,
  WeeklySchedule,
} from './types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const TOKENS_KEY = 'fb_kitchen_tokens';

interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function readTokens(): KitchenTokenPair | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(TOKENS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as KitchenTokenPair;
  } catch {
    return null;
  }
}

function writeTokens(tokens: KitchenTokenPair | null) {
  if (typeof window === 'undefined') return;
  if (tokens) window.localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
  else window.localStorage.removeItem(TOKENS_KEY);
}

/** Set once from `KitchenAuthProvider` so a hard 401 (refresh also failed) can force a redirect. */
let onSessionExpired: (() => void) | null = null;
export function setOnSessionExpired(handler: (() => void) | null) {
  onSessionExpired = handler;
}

// The backend rotates refresh tokens on every use (single-use), so if two
// concurrent 401s each read the same refresh token and POST it independently,
// the "losing" call fails with 401 and would otherwise wipe out the tokens
// the "winning" call just wrote. Sharing one in-flight promise means every
// concurrent caller awaits the same refresh instead of racing.
let refreshPromise: Promise<KitchenTokenPair | null> | null = null;

async function refreshTokens(): Promise<KitchenTokenPair | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const current = readTokens();
    if (!current) return null;

    const res = await fetch(`${BASE_URL}/api/v1/partner/auth/token/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: current.refreshToken }),
    });
    if (!res.ok) return null;

    const body: ApiEnvelope<KitchenTokenPair> = await res.json();
    writeTokens(body.data);
    return body.data;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  skipAuth?: boolean;
  isRetry?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, skipAuth = false, isRetry = false } = options;
  const tokens = skipAuth ? null : readTokens();

  const isFormData = body instanceof FormData;
  const res = await fetch(`${BASE_URL}/api/v1${path}`, {
    method,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(tokens ? { Authorization: `Bearer ${tokens.accessToken}` } : {}),
    },
    body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
  });

  if (res.status === 401 && !skipAuth && !isRetry) {
    const refreshed = await refreshTokens();
    if (refreshed) return request<T>(path, { ...options, isRetry: true });
    writeTokens(null);
    onSessionExpired?.();
    throw new ApiError(401, 'Your session expired — please log in again');
  }

  const envelope: ApiEnvelope<T> & { message: string } = await res.json().catch(() => ({
    success: false,
    statusCode: res.status,
    message: 'Something went wrong, please try again',
    data: null as T,
  }));

  if (!res.ok || !envelope.success) {
    throw new ApiError(res.status, envelope.message || 'Something went wrong, please try again');
  }

  return envelope.data;
}

// ── Auth ──────────────────────────────────────────────────────────────────

export const kitchenAuthApi = {
  sendOtp: (phone: string) =>
    request<{ expiresInMinutes: number; devOtp?: string }>('/partner/auth/otp/send', {
      method: 'POST',
      body: { phone },
      skipAuth: true,
    }),

  verifyOtp: (phone: string, otp: string) =>
    request<{ isNewAccount: boolean; account: KitchenAccount; tokens: KitchenTokenPair }>(
      '/partner/auth/otp/verify',
      { method: 'POST', body: { phone, otp }, skipAuth: true },
    ),

  logout: () => request<null>('/partner/auth/logout', { method: 'POST' }),

  requestAccountDeletion: (phone: string) =>
    request<{ expiresInMinutes: number; devOtp?: string }>('/partner/auth/account-deletion/request', {
      method: 'POST',
      body: { phone },
      skipAuth: true,
    }),

  confirmAccountDeletion: (phone: string, otp: string) =>
    request<null>('/partner/auth/account-deletion/confirm', {
      method: 'POST',
      body: { phone, otp },
      skipAuth: true,
    }),

  getTokens: readTokens,
  setTokens: writeTokens,
};

// ── Onboarding ────────────────────────────────────────────────────────────

export const onboardingApi = {
  status: () => request<OnboardingStatus>('/partner/onboarding/status'),

  ownerDetails: (input: { ownerName: string; email?: string }) =>
    request<OnboardingStatus>('/partner/onboarding/owner-details', { method: 'POST', body: input }),

  kitchenDetails: (input: {
    name: string;
    kitchenType: KitchenType;
    tagline?: string;
    description?: string;
    logoUrl?: string;
    coverImage?: string;
    contactPhone?: string;
    prepTimeMins?: number;
    opensAt?: string;
    closesAt?: string;
    cuisineSlugs?: string[];
  }) => request<OnboardingStatus>('/partner/onboarding/kitchen-details', { method: 'POST', body: input }),

  location: (input: {
    addressLine: string;
    locality: string;
    city?: string;
    state?: string;
    pincode: string;
    latitude: number;
    longitude: number;
    serviceRadiusKm: number;
  }) => request<OnboardingStatus>('/partner/onboarding/location', { method: 'POST', body: input }),

  uploadDocument: (input: { type: string; number?: string; fileUrl: string }) =>
    request<OnboardingStatus>('/partner/onboarding/documents', { method: 'POST', body: input }),

  bankDetails: (input: {
    accountHolderName: string;
    accountNumber: string;
    ifsc: string;
    bankName?: string;
    upiId?: string;
  }) => request<OnboardingStatus>('/partner/onboarding/bank-details', { method: 'POST', body: input }),

  submit: () => request<OnboardingStatus>('/partner/onboarding/submit', { method: 'POST' }),

  /** Dev-only — the backend refuses this in production. */
  simulateApprove: () => request<OnboardingStatus>('/partner/onboarding/simulate/approve', { method: 'POST' }),
};

// ── Profile ───────────────────────────────────────────────────────────────

export const kitchenProfileApi = {
  get: () => request<KitchenProfile>('/partner/kitchen'),
  update: (input: Partial<KitchenProfile>) =>
    request<KitchenProfile>('/partner/kitchen', { method: 'PATCH', body: input }),
  setAcceptingOrders: (isAcceptingOrders: boolean) =>
    request<KitchenProfile>('/partner/kitchen/accepting-orders', {
      method: 'PATCH',
      body: { isAcceptingOrders },
    }),
};

// ── Menu ──────────────────────────────────────────────────────────────────

export interface UpsertMealCustomizationOptionInput {
  name: string;
  priceDelta: number;
}

export interface UpsertMealCustomizationGroupInput {
  name: string;
  isRequired: boolean;
  minSelect: number;
  maxSelect: number;
  options: UpsertMealCustomizationOptionInput[];
}

export interface UpsertMealInput {
  name: string;
  description?: string;
  images: string[];
  price: number;
  mrp?: number;
  foodType: string;
  /** Only valid when foodType is VEG or VEGAN — the backend 400s otherwise. */
  isJainAvailable?: boolean;
  categorySlug?: string;
  cuisineSlug?: string;
  slots?: string[];
  goalTags?: string[];
  calories: number;
  proteinG: number;
  carbsG?: number;
  fatG?: number;
  fiberG?: number;
  servingSize?: string;
  ingredients?: string[];
  allergens?: string[];
  prepTimeMins?: number;
  isAvailable?: boolean;
  customizationGroups?: UpsertMealCustomizationGroupInput[];
}

export const kitchenMenuApi = {
  list: (includeUnavailable = true) =>
    request<MealDetail[]>(`/partner/menu?includeUnavailable=${includeUnavailable}`),
  get: (id: string) => request<MealDetail>(`/partner/menu/${id}`),
  create: (input: UpsertMealInput) => request<MealDetail>('/partner/menu', { method: 'POST', body: input }),
  update: (id: string, input: Partial<UpsertMealInput>) =>
    request<MealDetail>(`/partner/menu/${id}`, { method: 'PATCH', body: input }),
  setAvailability: (id: string, isAvailable: boolean) =>
    request<{ id: string; isAvailable: boolean }>(`/partner/menu/${id}/availability`, {
      method: 'PATCH',
      body: { isAvailable },
    }),
  remove: (id: string) => request<{ id: string }>(`/partner/menu/${id}`, { method: 'DELETE' }),
  analyze: (input: { name: string; description?: string; ingredients?: string[] }) =>
    request<NutritionAnalysisResult>('/partner/menu/analyze', { method: 'POST', body: input }),
};

// ── Orders ────────────────────────────────────────────────────────────────

export const kitchenOrdersApi = {
  incoming: () => request<KitchenOrderCard[]>('/partner/orders/incoming'),
  detail: (id: string) => request<KitchenOrderCard>(`/partner/orders/${id}`),
  advanceStatus: (id: string, status: OrderStatus, note?: string) =>
    request<OrderDetail>(`/partner/orders/${id}/status`, { method: 'POST', body: { status, note } }),
  /** Powers the History view — any date range, any status, paginated. */
  list: (params: { page?: number; limit?: number; status?: OrderStatus[]; dateFrom?: string; dateTo?: string }) => {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.status?.length) query.set('status', params.status.join(','));
    if (params.dateFrom) query.set('dateFrom', params.dateFrom);
    if (params.dateTo) query.set('dateTo', params.dateTo);
    return request<Paginated<KitchenOrderCard>>(`/partner/orders?${query.toString()}`);
  },
};

// ── Stories ───────────────────────────────────────────────────────────────

export const kitchenStoriesApi = {
  list: () => request<KitchenStory[]>('/partner/stories'),
  publish: (input: {
    mediaType: string;
    mediaUrl: string;
    thumbnailUrl?: string;
    caption?: string;
    mealId?: string;
    durationSec?: number;
  }) => request<KitchenStory>('/partner/stories', { method: 'POST', body: input }),
  deactivate: (id: string) => request<{ id: string }>(`/partner/stories/${id}`, { method: 'DELETE' }),
  updateCaption: (id: string, caption: string) =>
    request<KitchenStory>(`/partner/stories/${id}`, { method: 'PATCH', body: { caption } }),
};

// ── Dashboard ─────────────────────────────────────────────────────────────

export const kitchenDashboardApi = {
  summary: () => request<DashboardSummary>('/partner/dashboard/summary'),
};

// ── FSSAI Assistance ─────────────────────────────────────────────────────────

export const fssaiAssistanceApi = {
  status: () => request<FssaiAssistanceStatusResponse>('/partner/fssai-assistance/status'),
  start: () => request<FssaiAssistanceStatusResponse>('/partner/fssai-assistance/start', { method: 'POST' }),
  uploadDocument: (input: { type: FssaiAssistanceDocumentType; fileUrl: string }) =>
    request<FssaiAssistanceStatusResponse>('/partner/fssai-assistance/documents', { method: 'POST', body: input }),
  confirmPayment: () =>
    request<FssaiAssistanceStatusResponse>('/partner/fssai-assistance/confirm-payment', { method: 'POST' }),
  cancel: () => request<FssaiAssistanceStatusResponse>('/partner/fssai-assistance/cancel', { method: 'POST' }),
  /** Dev-only — the backend refuses this in production. */
  simulateAdvance: () =>
    request<FssaiAssistanceStatusResponse>('/partner/fssai-assistance/simulate/advance', { method: 'POST' }),
};

// ── Upload ────────────────────────────────────────────────────────────────

export const kitchenUploadApi = {
  upload: (file: File, purpose: string) => {
    const form = new FormData();
    form.append('file', file);
    form.append('purpose', purpose);
    return request<{ url: string }>('/partner/upload', { method: 'POST', body: form });
  },
};

// ── BhojAI ────────────────────────────────────────────────────────────────

export const bhojaiApi = {
  sendMessage: (message: string) =>
    request<BhojAiMessageResult>('/partner/bhojai/message', { method: 'POST', body: { message } }),
  history: () => request<BhojAiHistoryResponse>('/partner/bhojai/history'),
  reset: () => request<null>('/partner/bhojai/reset', { method: 'POST' }),
};

// ── Notifications ─────────────────────────────────────────────────────────

export const notificationsApi = {
  list: (params: { category?: NotificationCategory; page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.set('category', params.category);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    const qs = query.toString();
    return request<NotificationListResponse>(`/partner/notifications${qs ? `?${qs}` : ''}`);
  },
  markRead: (id: string) => request<{ id: string; isRead: boolean }>(`/partner/notifications/${id}/read`, { method: 'POST' }),
  markAllRead: () => request<{ updatedCount: number }>('/partner/notifications/read-all', { method: 'POST' }),
};

// ── Payouts ───────────────────────────────────────────────────────────────

export const payoutsApi = {
  summary: () => request<PayoutSummary>('/partner/payouts/summary'),
  request: () => request<Payout>('/partner/payouts/request', { method: 'POST' }),
  transactions: (params: { page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    const qs = query.toString();
    return request<TransactionListResponse>(`/partner/payouts${qs ? `?${qs}` : ''}`);
  },
};

// ── Operating Hours ───────────────────────────────────────────────────────

export const operatingHoursApi = {
  get: () => request<WeeklySchedule>('/partner/operating-hours'),
  updateDay: (
    dayOfWeek: DayOfWeek,
    input: { isClosed: boolean; session1Start?: string; session1End?: string; session2Start?: string; session2End?: string },
  ) => request<OperatingHoursDay>(`/partner/operating-hours/${dayOfWeek}`, { method: 'PUT', body: input }),
  upsertHoliday: (input: {
    date: string;
    isClosed: boolean;
    session1Start?: string;
    session1End?: string;
    session2Start?: string;
    session2End?: string;
    note?: string;
  }) => request<HolidayOverride>('/partner/operating-hours/holidays', { method: 'POST', body: input }),
  removeHoliday: (date: string) => request<null>(`/partner/operating-hours/holidays/${date}`, { method: 'DELETE' }),
};

// ── Reels ─────────────────────────────────────────────────────────────────
// No dedicated web management page yet (Stories, above, covers that role on
// the web today) — these exist so the API surface is complete and ready for
// whichever screen picks it up next.

export const kitchenReelsApi = {
  list: () => request<KitchenReel[]>('/partner/reels'),
  publish: (input: { videoUrl: string; thumbnailUrl?: string; caption?: string; hashtags?: string[]; mealId?: string }) =>
    request<KitchenReel>('/partner/reels', { method: 'POST', body: input }),
  update: (id: string, input: { caption?: string; hashtags?: string[] }) =>
    request<KitchenReel>(`/partner/reels/${id}`, { method: 'PATCH', body: input }),
  archive: (id: string) => request<{ id: string }>(`/partner/reels/${id}`, { method: 'DELETE' }),
  pause: (id: string) => request<null>(`/partner/reels/${id}/pause`, { method: 'POST' }),
  resume: (id: string) => request<null>(`/partner/reels/${id}/resume`, { method: 'POST' }),
};

// ── Order Chat ────────────────────────────────────────────────────────────
// Calling `messages()` marks unread CUSTOMER messages as read (server-side side effect).

export const orderChatApi = {
  messages: (orderId: string) => request<OrderChatMessage[]>(`/partner/orders/${orderId}/messages`),
  send: (orderId: string, body: string, advanceToStatus?: KitchenAdvanceStatus) =>
    request<OrderChatMessage>(`/partner/orders/${orderId}/messages`, {
      method: 'POST',
      body: { body, advanceToStatus },
    }),
};

// ── Ads / Reel Campaigns ──────────────────────────────────────────────────

export const adsApi = {
  estimateReach: (dailyBudgetRs: number) =>
    request<CampaignReachEstimate>(`/partner/ads/campaigns/estimate?dailyBudgetRs=${dailyBudgetRs}`),
  /** `durationDays` is mandatory — the full `dailyBudgetRs × durationDays` cost is charged from the wallet immediately. */
  create: (input: { reelId: string; dailyBudgetRs: number; durationDays: number }) =>
    request<Campaign>('/partner/ads/campaigns', { method: 'POST', body: input }),
  list: (status?: CampaignStatus) =>
    request<Campaign[]>(`/partner/ads/campaigns${status ? `?status=${status}` : ''}`),
  get: (id: string) => request<Campaign>(`/partner/ads/campaigns/${id}`),
  analytics: (ids: string[]) =>
    request<Campaign[]>(`/partner/ads/campaigns/analytics?ids=${ids.map(encodeURIComponent).join(',')}`),
  pause: (id: string) => request<Campaign>(`/partner/ads/campaigns/${id}/pause`, { method: 'POST' }),
  resume: (id: string) => request<Campaign>(`/partner/ads/campaigns/${id}/resume`, { method: 'POST' }),
  stop: (id: string) => request<Campaign>(`/partner/ads/campaigns/${id}/stop`, { method: 'POST' }),
};

// ── AI Optimization Suggestions ───────────────────────────────────────────
// Capped to one real AI call per kitchen per IST calendar day — `generate()`
// called again the same day just re-returns that day's batch (expected, not
// an error). Can also 400 (zero ACTIVE campaigns) or 503 (Gemini is down);
// both are normal, retry-able error states callers should handle explicitly.

export const suggestionsApi = {
  generate: () => request<CampaignSuggestion[]>('/partner/ads/suggestions/generate', { method: 'POST' }),
  list: (params: { status?: SuggestionStatus; q?: string; page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.q) query.set('q', params.q);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    const qs = query.toString();
    return request<SuggestionListResponse>(`/partner/ads/suggestions${qs ? `?${qs}` : ''}`);
  },
  get: (id: string) => request<CampaignSuggestion>(`/partner/ads/suggestions/${id}`),
  /** Only callable while `status === 'NEW'` — 400 otherwise. */
  apply: (id: string) => request<CampaignSuggestion>(`/partner/ads/suggestions/${id}/apply`, { method: 'POST' }),
  /** Only callable while `status === 'NEW'` — 400 otherwise. */
  dismiss: (id: string) => request<CampaignSuggestion>(`/partner/ads/suggestions/${id}/dismiss`, { method: 'POST' }),
};

// ── Wallet ────────────────────────────────────────────────────────────────

export const walletApi = {
  summary: () => request<WalletSummary>('/partner/wallet'),
  transactions: (params: { page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    const qs = query.toString();
    return request<WalletTransactionListResponse>(`/partner/wallet/transactions${qs ? `?${qs}` : ''}`);
  },
  /** Completes immediately — no payment gateway wired, same as every other payment-adjacent flow in this app. */
  topup: (amountRs: number) =>
    request<WalletTopupResult>('/partner/wallet/topup', { method: 'POST', body: { amountRs } }),
};

// ── Kitchen Premium Plans ─────────────────────────────────────────────────

export const premiumApi = {
  listTiers: () => request<PremiumTierCatalog[]>('/partner/premium/tiers'),
  subscription: () => request<PremiumSubscription>('/partner/premium/subscription'),
  /** Same endpoint serves first purchase and upgrading from an existing tier. Charges the wallet immediately. */
  purchase: (tier: PremiumTier) =>
    request<PremiumSubscription>('/partner/premium/purchase', { method: 'POST', body: { tier } }),
};

// ── Subscriptions (kitchen-facing) ────────────────────────────────────────

export const subscriptionsApi = {
  list: (params: { status?: SubscriptionStatus; q?: string; page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.q) query.set('q', params.q);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    const qs = query.toString();
    return request<SubscriptionListResponse>(`/partner/subscriptions${qs ? `?${qs}` : ''}`);
  },
  get: (id: string) => request<SubscriptionDetail>(`/partner/subscriptions/${id}`),
  approve: (id: string) => request<SubscriptionDetail>(`/partner/subscriptions/${id}/approve`, { method: 'POST' }),
  reject: (id: string, reason: string) =>
    request<SubscriptionDetail>(`/partner/subscriptions/${id}/reject`, { method: 'POST', body: { reason } }),
  pause: (id: string) => request<SubscriptionDetail>(`/partner/subscriptions/${id}/pause`, { method: 'POST' }),
  resume: (id: string) => request<SubscriptionDetail>(`/partner/subscriptions/${id}/resume`, { method: 'POST' }),
  dispatchDelivery: (id: string, date: string) =>
    request<SubscriptionDelivery>(`/partner/subscriptions/${id}/deliveries/${date}/dispatch`, { method: 'POST' }),
  skipDelivery: (id: string, date: string, reason?: string) =>
    request<SubscriptionDelivery>(`/partner/subscriptions/${id}/deliveries/${date}/skip`, {
      method: 'POST',
      body: reason ? { reason } : undefined,
    }),
};

// ── Catalog (public) ──────────────────────────────────────────────────────

export const catalogApi = {
  cuisines: () => request<Cuisine[]>('/catalog/cuisines', { skipAuth: true }),
};

// ── Kitchens (public) ─────────────────────────────────────────────────────

export const kitchensPublicApi = {
  get: (idOrSlug: string) => request<PublicKitchenDetail>(`/kitchens/${encodeURIComponent(idOrSlug)}`, { skipAuth: true }),
};
