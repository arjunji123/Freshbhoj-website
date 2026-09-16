import type {
  DashboardSummary,
  KitchenAccount,
  KitchenOrderCard,
  KitchenProfile,
  KitchenStory,
  KitchenTokenPair,
  MealDetail,
  NutritionAnalysisResult,
  OnboardingStatus,
  OrderDetail,
  OrderStatus,
  Paginated,
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
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
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

export interface UpsertMealInput {
  name: string;
  description?: string;
  images: string[];
  price: number;
  mrp?: number;
  foodType: string;
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

// ── Upload ────────────────────────────────────────────────────────────────

export const kitchenUploadApi = {
  upload: (file: File, purpose: string) => {
    const form = new FormData();
    form.append('file', file);
    form.append('purpose', purpose);
    return request<{ url: string }>('/partner/upload', { method: 'POST', body: form });
  },
};
