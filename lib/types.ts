// Mirrors the backend's kitchen-partner DTOs (freshbhoj backend/src/modules/kitchen/**).
// Kept as plain types, not generated, since the two repos aren't wired together —
// if the backend contract changes, update here too.

export type KitchenAccountStatus =
  | 'PENDING_VERIFICATION'
  | 'ONBOARDING'
  | 'UNDER_REVIEW'
  | 'ACTIVE'
  | 'REJECTED'
  | 'SUSPENDED';

export type KitchenOnboardingStep =
  | 'PHONE_VERIFIED'
  | 'OWNER_DETAILS'
  | 'KITCHEN_DETAILS'
  | 'LOCATION'
  | 'DOCUMENTS'
  | 'BANK_DETAILS'
  | 'MENU_SETUP'
  | 'SUBMITTED'
  | 'COMPLETED';

export type KitchenDocumentType =
  | 'FSSAI'
  | 'GST'
  | 'PAN'
  | 'AADHAAR'
  | 'SHOP_LICENSE'
  | 'BANK_PROOF'
  /** Deprecated — superseded by KITCHEN_PHOTO_FRONT / KITCHEN_PHOTO_MAIN. Do not use for new uploads. */
  | 'KITCHEN_PHOTOS'
  | 'KITCHEN_PHOTO_FRONT'
  | 'KITCHEN_PHOTO_MAIN';

/** Business format the partner registers as, chosen during onboarding. */
export type KitchenType = 'HOME_KITCHEN' | 'CLOUD_KITCHEN' | 'RESTAURANT' | 'TIFFIN_SERVICE';

export type DocumentStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type KitchenStatus = 'PENDING' | 'ACTIVE' | 'PAUSED' | 'SUSPENDED';
export type FoodType = 'VEG' | 'EGG' | 'NON_VEG' | 'VEGAN';
export type MealSlot = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACKS';
export type GoalTag = 'HIGH_PROTEIN' | 'LOW_CALORIE' | 'WEIGHT_LOSS' | 'MUSCLE_GAIN' | 'HEALTHY_LIFESTYLE';
export type MediaType = 'IMAGE' | 'VIDEO';
export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PLACED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';
export type PaymentMethod = 'UPI' | 'CARD' | 'WALLET' | 'COD';
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface KitchenAccount {
  id: string;
  phone: string;
  email: string | null;
  ownerName: string | null;
  status: KitchenAccountStatus;
  onboardingStep: KitchenOnboardingStep;
  rejectionReason: string | null;
  submittedAt: string | null;
  approvedAt: string | null;
}

export interface KitchenTokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface OnboardingStepState {
  step: KitchenOnboardingStep;
  label: string;
  description: string;
  isComplete: boolean;
  isCurrent: boolean;
}

export interface KitchenDocument {
  id: string;
  type: KitchenDocumentType;
  number: string | null;
  fileUrl: string;
  status: DocumentStatus;
  remarks: string | null;
}

export interface KitchenBankAccount {
  accountHolderName: string;
  accountNumberMasked: string;
  ifsc: string;
  bankName: string | null;
  upiId: string | null;
  isVerified: boolean;
}

export interface OnboardingStatus {
  status: KitchenAccountStatus;
  currentStep: KitchenOnboardingStep;
  progressPercent: number;
  steps: OnboardingStepState[];
  canSubmit: boolean;
  pending: string[];
  rejectionReason: string | null;
  documents: KitchenDocument[];
  bankAccount: KitchenBankAccount | null;
  kitchenId: string | null;
}

export interface KitchenProfile {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  logoUrl: string | null;
  coverImage: string | null;
  status: KitchenStatus;
  isVerified: boolean;
  rating: number;
  ratingCount: number;
  followerCount: number;
  addressLine: string | null;
  locality: string | null;
  city: string;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
  prepTimeMins: number;
  opensAt: string;
  closesAt: string;
  isAcceptingOrders: boolean;
  contactPhone: string | null;
  fssaiLicense: string | null;
  hygieneScore: number | null;
  cuisines: string[];
  specialities: string[];
  capacity: number | null;
  createdAt: string;
}

export interface MealCustomizationOption {
  id: string;
  name: string;
  priceDelta: number;
  isDefault: boolean;
}

export interface MealCustomizationGroup {
  id: string;
  name: string;
  isRequired: boolean;
  minSelect: number;
  maxSelect: number;
  options: MealCustomizationOption[];
}

export interface MealDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  images: string[];
  price: number;
  mrp: number | null;
  discountPercent: number;
  foodType: FoodType;
  /** Can be prepared Jain-style (no onion/garlic/root veg) — only meaningful when foodType is VEG or VEGAN. */
  isJainAvailable: boolean;
  goalTags: GoalTag[];
  slots: MealSlot[];
  nutrition: {
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    fiberG: number;
    macroSplit: { proteinPercent: number; carbsPercent: number; fatPercent: number };
  };
  servingSize: string | null;
  ingredients: string[];
  allergens: string[];
  rating: number;
  ratingCount: number;
  prepTimeMins: number;
  isBestseller: boolean;
  isAvailable: boolean;
  isOrderable: boolean;
  isFavorite: boolean;
  orderCount: number;
  category: { id: string; slug: string; name: string } | null;
  customizationGroups: MealCustomizationGroup[];
}

export interface NutritionAnalysisResult {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  healthScore: number;
  isJunkFood: boolean;
  reason: string;
  suggestedGoalTags: GoalTag[];
}

export interface KitchenStory {
  id: string;
  mediaType: MediaType;
  mediaUrl: string;
  thumbnailUrl: string | null;
  caption: string | null;
  durationSec: number;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  orderCount: number;
  mealName: string | null;
  isActive: boolean;
  createdAt: string;
  expiresAt: string;
}

export interface KitchenOrderCard {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  totalAmount: number;
  customer: { name: string; phone: string };
  items: { name: string; quantity: number; customizations: unknown; specialInstructions: string | null }[];
  orderNotes: string | null;
  placedAt: string;
  etaMinutes: number;
  allowedNextStatuses: OrderStatus[];
}

export interface OrderDetail extends KitchenOrderCard {
  pricing: {
    itemsTotal: number;
    deliveryFee: number;
    taxes: number;
    discount: number;
    couponDiscount: number;
    coinsRedeemed: number;
    coinDiscount: number;
    totalAmount: number;
    couponCode: string | null;
  };
  address: Record<string, unknown>;
  slot: { type: 'NOW' | 'SCHEDULED'; scheduledFor: string | null };
  eta: { etaMinutes: number; expectedAt: string; minutesRemaining: number; rangeLabel: string };
  tracking: { isCancelled: boolean; currentIndex: number; steps: unknown[] };
  deliveryPartner: { id: string; name: string; phone: string; photoUrl: string | null; vehicleNumber: string | null } | null;
  cancelReason: string | null;
  canCancel: boolean;
  support: { whatsapp: string; kitchenPhone: string | null };
}

export interface DashboardSummary {
  accountStatus: KitchenAccountStatus;
  isAcceptingOrders: boolean;
  today: { orderCount: number; activeOrderCount: number; revenue: number };
  allTime: {
    orderCount: number;
    revenue: number;
    rating: number;
    ratingCount: number;
    followerCount: number;
    activeMealCount: number;
  };
  /** 7 entries, oldest-to-newest, `date` as `YYYY-MM-DD`. */
  weeklyRevenue: { date: string; revenue: number }[];
  actionNeeded: string | null;
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface Paginated<T> {
  items: T[];
  meta: PageMeta;
}

// ── FSSAI Assistance ─────────────────────────────────────────────────────────
// Mirrors `freshbhoj backend/src/modules/kitchen/portal/fssai-assistance/**`.

export type FssaiAssistanceStatus =
  | 'PENDING_PAYMENT'
  | 'DOCUMENTS_SUBMITTED'
  | 'APPLICATION_FILED'
  | 'GOVT_REVIEW_IN_PROGRESS'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED';

export type FssaiAssistanceDocumentType = 'IDENTITY_PROOF' | 'ADDRESS_PROOF' | 'KITCHEN_PHOTO' | 'PASSPORT_PHOTO';

export interface FssaiAssistanceRequest {
  id: string;
  status: FssaiAssistanceStatus;
  govtFee: number;
  serviceFee: number;
  totalFee: number;
  paymentStatus: PaymentStatus;
  licenseNumber: string | null;
  validFrom: string | null;
  validTill: string | null;
  certificateUrl: string | null;
  rejectionReason: string | null;
  submittedAt: string | null;
  filedAt: string | null;
  approvedAt: string | null;
  createdAt: string;
}

export interface FssaiAssistanceDocument {
  id: string;
  type: FssaiAssistanceDocumentType;
  fileUrl: string;
  status: DocumentStatus;
  remarks: string | null;
}

export interface FssaiAssistanceStatusResponse {
  request: FssaiAssistanceRequest | null;
  documents: FssaiAssistanceDocument[];
}

// ── BhojAI ───────────────────────────────────────────────────────────────────
// Mirrors `freshbhoj backend/src/modules/kitchen/portal/bhojai/**`.

export type BhojAiMessageRole = 'USER' | 'MODEL';

/**
 * `card` shapes below are deterministic, backend-built UI payloads (see
 * `bhojai-tools.ts`) — the model never authors them. The wire type is always
 * `Record<string, unknown> | null`; narrow with the `is*Card` guards in
 * `app/partner/bhojai/page.tsx` before trusting a shape.
 */
export interface BhojAiFssaiStatusCard {
  type: 'FSSAI_STATUS';
  status: string;
  progressPercent: number;
  timeline: { stage: string; isComplete: boolean; isCurrent: boolean }[];
  estimatedDaysLeft: number | null;
}

export interface BhojAiDocumentRejectedCard {
  type: 'DOCUMENT_REJECTED';
  rejectionReason: string | null;
  rejectedDocuments: { type: string; remarks: string | null }[];
  nextSteps: string[];
}

export interface BhojAiEscalationCreatedCard {
  type: 'ESCALATION_CREATED';
  reason: string;
}

export interface BhojAiMessageResult {
  message: string;
  card: Record<string, unknown> | null;
}

export interface BhojAiHistoryItem {
  id: string;
  role: BhojAiMessageRole;
  text: string | null;
  card: Record<string, unknown> | null;
  createdAt: string;
}

export interface BhojAiHistoryResponse {
  messages: BhojAiHistoryItem[];
}

// ── Notifications ────────────────────────────────────────────────────────────
// Mirrors `freshbhoj backend/src/modules/kitchen/portal/notifications/**`.

export type NotificationCategory = 'ORDER' | 'SUBSCRIPTION' | 'REEL' | 'GENERAL';

export interface KitchenNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  /** Drives inline quick-actions, e.g. `{ orderId, action: 'ACCEPT_ORDER' }`. */
  data: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListResponse {
  items: KitchenNotification[];
  meta: PageMeta;
  /** Unread count across ALL categories, not just the filtered page. */
  unreadCount: number;
}

// ── Payouts ──────────────────────────────────────────────────────────────────
// Mirrors `freshbhoj backend/src/modules/kitchen/portal/payouts/**`.

export type PayoutStatus = 'REQUESTED' | 'PROCESSING' | 'PAID' | 'FAILED';

export interface MaskedBankAccount {
  accountHolderName: string;
  accountNumberMasked: string;
  ifsc: string;
  bankName: string | null;
  isVerified: boolean;
}

export interface Payout {
  id: string;
  amount: number;
  status: PayoutStatus;
  transferRef: string | null;
  failureReason: string | null;
  requestedAt: string;
  processedAt: string | null;
  paidAt: string | null;
}

export interface PayoutSummary {
  totalEarnings: number;
  availableForPayout: number;
  lastPayout: Payout | null;
  /** Always null — no payout cadence/scheduling exists yet. */
  nextScheduledAt: string | null;
  bankAccount: MaskedBankAccount | null;
}

export interface Transaction {
  id: string;
  type: 'ORDER' | 'PAYOUT';
  amount: number;
  sign: 1 | -1;
  status: string;
  label: string;
  occurredAt: string;
}

export interface TransactionListResponse {
  items: Transaction[];
  meta: PageMeta;
}

// ── Operating Hours ──────────────────────────────────────────────────────────
// Mirrors `freshbhoj backend/src/modules/kitchen/portal/operating-hours/**`.

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface OperatingHoursDay {
  id: string;
  dayOfWeek: DayOfWeek;
  isClosed: boolean;
  session1Start: string | null;
  session1End: string | null;
  session2Start: string | null;
  session2End: string | null;
}

export interface HolidayOverride {
  id: string;
  /** YYYY-MM-DD, IST calendar date. */
  date: string;
  isClosed: boolean;
  session1Start: string | null;
  session1End: string | null;
  session2Start: string | null;
  session2End: string | null;
  note: string | null;
}

export interface WeeklySchedule {
  /** Exactly 7 rows, MONDAY..SUNDAY — lazily backfilled server-side on first read. */
  weekly: OperatingHoursDay[];
  holidays: HolidayOverride[];
}

// ── Reels ────────────────────────────────────────────────────────────────────
// Mirrors `freshbhoj backend/src/modules/kitchen/portal/reels/**`. Distinct from
// Stories (`/partner/stories`) — no web management UI exists for these yet.

export type ReelStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface KitchenReel {
  id: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  caption: string | null;
  hashtags: string[];
  durationSec: number;
  status: ReelStatus;
  isPaused: boolean;
  isSponsored: boolean;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  commentCount: number;
  orderCount: number;
  mealName: string | null;
  publishedAt: string;
  createdAt: string;
}

// ── Catalog (public) ─────────────────────────────────────────────────────────

export interface Cuisine {
  id: string;
  slug: string;
  name: string;
  iconUrl: string | null;
  imageUrl: string | null;
  mealCount: number;
}

// ── Order Chat ───────────────────────────────────────────────────────────────
// Mirrors `freshbhoj backend/src/modules/kitchen/portal/orders/chat/**`.

export type OrderChatSender = 'KITCHEN' | 'CUSTOMER';

/** The kitchen-settable subset of `OrderStatus` — the only values `advanceToStatus` accepts. */
export type KitchenAdvanceStatus = 'ACCEPTED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'CANCELLED';

export interface OrderChatMessage {
  id: string;
  sender: OrderChatSender;
  body: string;
  triggeredStatus: OrderStatus | null;
  isRead: boolean;
  createdAt: string;
}

// ── Ads / Reel Campaigns ─────────────────────────────────────────────────────
// Mirrors `freshbhoj backend/src/modules/kitchen/portal/ads/**`.

export type CampaignStatus = 'ACTIVE' | 'PAUSED' | 'ENDED';

export interface CampaignReachEstimate {
  min: number;
  max: number;
}

export interface CampaignDailyStat {
  date: string;
  impressions: number;
  clicks: number;
}

export interface Campaign {
  id: string;
  reelId: string;
  reel: { thumbnailUrl: string | null; videoUrl: string; caption: string | null } | null;
  dailyBudgetRs: number;
  endDate: string | null;
  /** Round 5+ campaigns always set this (wallet-funded, mandatory at creation); `null` only on a pre-Round-5 legacy campaign. */
  durationDays: number | null;
  status: CampaignStatus;
  spendRs: number;
  impressions: number;
  clicks: number;
  /** Percent, e.g. 5.23 */
  ctr: number;
  ordersCount: number;
  revenueRs: number;
  /** revenueRs / spendRs */
  roi: number;
  estimatedReach: CampaignReachEstimate;
  actualReach: number;
  /** Only present on the single-campaign GET and the analytics batch GET — not on the plain list. */
  dailyStats?: CampaignDailyStat[];
  createdAt: string;
  pausedAt: string | null;
  endedAt: string | null;
}

// ── AI Optimization Suggestions ───────────────────────────────────────────
// Mirrors `freshbhoj backend/src/modules/kitchen/portal/ads/suggestions/**`.

export type SuggestionType = 'BUDGET_INCREASE' | 'DELIVERY_RADIUS' | 'TARGET_CUISINE' | 'CREATIVE_REFRESH';
export type SuggestionStatus = 'NEW' | 'APPLIED' | 'DISMISSED';
export type SuggestionEffort = 'LOW' | 'MEDIUM' | 'HIGH';

export interface SuggestionImpact {
  reachDeltaPct: number | null;
  ordersDeltaPct: number | null;
  roiDeltaPct: number | null;
  expectedOrders: number | null;
  suggestedDailyBudgetRs: number | null;
  suggestedRadiusKm: number | null;
  costRs: number;
  effort: SuggestionEffort;
}

export interface SuggestionAppliedChange {
  field: string;
  before: number;
  after: number;
}

export interface CampaignSuggestion {
  id: string;
  type: SuggestionType;
  title: string;
  description: string;
  /** null for a kitchen-wide suggestion (DELIVERY_RADIUS / TARGET_CUISINE). */
  campaignId: string | null;
  impact: SuggestionImpact;
  reasoning: string;
  status: SuggestionStatus;
  appliedChanges: SuggestionAppliedChange | null;
  /** YYYY-MM-DD, IST calendar date of the generation batch this belongs to. */
  batchDate: string;
  appliedAt: string | null;
  dismissedAt: string | null;
  createdAt: string;
}

export interface SuggestionListResponse {
  items: CampaignSuggestion[];
  meta: PageMeta;
}

// ── Wallet ─────────────────────────────────────────────────────────────────
// Mirrors `freshbhoj backend/src/modules/kitchen/portal/wallet/**`.

export interface WalletSummary {
  balanceRs: number;
  totalCreditsRs: number;
  thisMonthSpentRs: number;
  /** The kitchen's premium-plan renewal date, if it has an active auto-renewing plan. */
  nextBillingAt: string | null;
}

export type WalletTransactionType = 'CREDIT' | 'DEBIT';
export type WalletTransactionReason = 'TOPUP' | 'AD_BOOST' | 'PREMIUM_PLAN';

export interface WalletTransaction {
  id: string;
  type: WalletTransactionType;
  reason: WalletTransactionReason;
  amountRs: number;
  description: string;
  referenceId: string | null;
  createdAt: string;
}

export interface WalletTransactionListResponse {
  items: WalletTransaction[];
  meta: PageMeta;
}

export interface WalletTopupResult {
  wallet: WalletSummary;
  transaction: WalletTransaction;
}

// ── Kitchen Premium Plans ─────────────────────────────────────────────────
// Mirrors `freshbhoj backend/src/modules/kitchen/portal/premium/**`.

export type PremiumTier = 'BASIC' | 'PRO' | 'ELITE';
export type PremiumSubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'NONE';

export interface PremiumFeatures {
  /** null = unlimited; 2 for BASIC. */
  reelsPerMonth: number | null;
  advancedAnalytics: boolean;
  priorityBoostMultiplier: number;
  aiVideoEditing: boolean;
  sponsoredProfile: boolean;
  aiMenuInsights: boolean;
  prioritySupport: boolean;
  verifiedBadge: boolean;
  dedicatedGrowthManager: boolean;
}

export interface PremiumTierCatalog {
  tier: PremiumTier;
  /** Whole rupees per 28-day period — placeholder prices, not final business numbers. */
  priceRs: number;
  /** true only for PRO. */
  isMostPopular: boolean;
  features: PremiumFeatures;
}

export interface PremiumSubscription {
  tier: PremiumTier | null;
  status: PremiumSubscriptionStatus;
  priceRs: number | null;
  currentPeriodEnd: string | null;
  autoRenew: boolean;
  features: PremiumFeatures;
}

// ── Subscriptions (kitchen-facing) ───────────────────────────────────────────
// Mirrors `freshbhoj backend/src/modules/kitchen/portal/subscriptions/**`.

export type SubscriptionStatus = 'PENDING' | 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'REJECTED';
export type SubscriptionDeliveryTime = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACKS';
export type SubscriptionBillingCycle = 'WEEKLY' | 'MONTHLY';
export type SubscriptionDeliveryStatus = 'SCHEDULED' | 'DISPATCHED' | 'SKIPPED';

export interface SubscriptionCustomer {
  id: string;
  fullName: string | null;
  phone: string;
  profileImage: string | null;
}

export interface Subscription {
  id: string;
  planName: string;
  foodType: FoodType;
  mealsPerDay: number;
  deliveryDays: DayOfWeek[];
  deliveryTime: SubscriptionDeliveryTime;
  billingCycle: SubscriptionBillingCycle;
  pricePerCycle: number;
  status: SubscriptionStatus;
  startDate: string;
  approvedAt: string | null;
  pausedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  customer: SubscriptionCustomer;
}

export interface SubscriptionDeliveryScheduleItem {
  date: string;
  status: SubscriptionDeliveryStatus;
  dispatchedAt: string | null;
  skipReason: string | null;
}

export interface SubscriptionBillingHistoryItem {
  cycleStart: string;
  amount: number;
  paymentStatus: PaymentStatus;
}

export interface SubscriptionDetail extends Subscription {
  specialInstructions: string | null;
  rejectionReason: string | null;
  /** Rolling 7-day window, today first. */
  deliverySchedule: SubscriptionDeliveryScheduleItem[];
  /** Always PAID in practice — placeholder billing, no real gateway. */
  billingHistory: SubscriptionBillingHistoryItem[];
}

export interface SubscriptionDelivery {
  id: string;
  subscriptionId: string;
  date: string;
  status: SubscriptionDeliveryStatus;
  dispatchedAt: string | null;
  skipReason: string | null;
  createdAt: string;
}

export interface SubscriptionCounts {
  PENDING: number;
  ACTIVE: number;
  PAUSED: number;
  CANCELLED: number;
  REJECTED: number;
}

export interface SubscriptionListResponse {
  items: Subscription[];
  meta: PageMeta;
  counts: SubscriptionCounts;
}

// ── Subscription Plans (kitchen-facing) ──────────────────────────────────────
// Mirrors `freshbhoj backend/src/modules/kitchen/portal/subscription-plans/**`.
// Reusable plan templates customers browse and subscribe to from the kitchen's
// page — distinct from the bespoke, customer-requested Subscriptions above.

export interface SubscriptionPlan {
  id: string;
  name: string;
  billingCycle: SubscriptionBillingCycle;
  deliveryDays: DayOfWeek[];
  mealsPerDay: number;
  priceRs: number;
  originalPriceRs: number | null;
  discountPercent: number;
  dietOptions: FoodType[];
  jainAvailable: boolean;
  slotOptions: MealSlot[];
  includesDescription: string;
  isPopular: boolean;
  isActive: boolean;
  subscriberCount: number;
  createdAt: string;
}

export interface CreateSubscriptionPlanInput {
  name: string;
  billingCycle: SubscriptionBillingCycle;
  deliveryDays: DayOfWeek[];
  mealsPerDay: number;
  priceRs: number;
  originalPriceRs?: number;
  dietOptions: FoodType[];
  jainAvailable?: boolean;
  slotOptions: MealSlot[];
  includesDescription: string;
  isPopular?: boolean;
}

/** Same fields as create, all optional, plus `isActive` — the only way to hide a plan from customer browsing (no delete endpoint, by design). */
export type UpdateSubscriptionPlanInput = Partial<CreateSubscriptionPlanInput> & { isActive?: boolean };

// ── Public kitchen page ──────────────────────────────────────────────────────
// Subset of `KitchenDetailDto` (`GET /kitchens/:idOrSlug`) used by the public,
// unauthenticated `/kitchen/[slug]` preview page.

export interface PublicKitchenDetail {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  logoUrl: string | null;
  coverImage: string | null;
  isVerified: boolean;
  rating: number;
  ratingCount: number;
  followerCount: number;
  locality: string | null;
  city: string;
  prepTimeMins: number;
  openingHours: { opensAt: string; closesAt: string };
  isOpenNow: boolean;
  description: string | null;
}
