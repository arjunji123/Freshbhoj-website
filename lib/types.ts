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
  | 'KITCHEN_PHOTOS';

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
  actionNeeded: string | null;
}

export interface Paginated<T> {
  items: T[];
  meta: { page: number; limit: number; total: number; totalPages: number; hasNextPage: boolean };
}
