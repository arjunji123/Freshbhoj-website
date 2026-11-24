"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ChevronLeft, ChevronDown, Check, Wallet, Clapperboard, Truck, BellRing, type LucideIcon } from "lucide-react";
import { Navbar, Footer } from "../Components";

const serif = { fontFamily: "var(--font-instrument), Georgia, serif" } as const;

const inputCls =
  "w-full px-5 py-3.5 rounded-2xl bg-[#F3F8F8] border border-transparent hover:border-slate-200 focus:bg-white focus:border-[#087F78]/40 focus:ring-4 focus:ring-[#087F78]/10 outline-none transition-all placeholder:text-slate-400 text-[#0D1B1E]";
const labelCls = "block text-sm font-semibold text-[#0D1B1E] mb-2";

const scrollToTop = () => {
  // Smooth scrolling can cause "fixed" navbar flicker on some mobile browsers.
  const behavior: ScrollBehavior =
    typeof window !== "undefined" && window.innerWidth < 768 ? "auto" : "smooth";
  window.scrollTo({ top: 0, behavior });
};

type StateItem = { name: string };

const BENEFITS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Wallet, title: "₹100 Wallet Credit", text: "Credited straight to your wallet, ready for your first order." },
  { icon: Clapperboard, title: "Early Access to Top Reels", text: "See the best-rated food reels before anyone else." },
  { icon: Truck, title: "30 Din Free Delivery", text: "Zero delivery fees for your first 30 days." },
  { icon: BellRing, title: "Launch Updates", text: "We'll notify you the moment the app goes live in your city." },
];

// Curated Major Cities Data to avoid "villages/small towns"
const CITY_DATA: Record<string, string[]> = {
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Bhilwara", "Alwar", "Sikar", "Pali", "Sri Ganganagar"],
  Delhi: ["New Delhi", "Noida", "Gurgaon", "Ghaziabad", "Faridabad"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Amravati", "Navi Mumbai", "Kolhapur"],
  Karnataka: ["Bangalore", "Mysore", "Hubballi-Dharwad", "Mangalore", "Belgaum", "Gulbarga", "Davangere", "Bellary"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Anand"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Ramagundam"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Vellore", "Erode"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Prayagraj", "Meerut", "Bareilly", "Aligarh", "Moradabad", "Gorakhpur"],
  "West Bengal": ["Kolkata", "Howrah", "Asansol", "Siliguri", "Durgapur", "Bardhaman", "Malda", "Baharampur"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Ratlam", "Rewa"],
  Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali"],
  Haryana: ["Faridabad", "Gurgaon", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar", "Panchkula"],
  Kerala: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati"],
  Bihar: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Arrah"],
  Jharkhand: ["Jamshedpur", "Ranchi", "Dhanbad", "Bokaro", "Deoghar"],
  Odisha: ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur"],
  Assam: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon"],
  Chhattisgarh: ["Raipur", "Bhilai", "Bilaspur", "Korba"],
  Uttarakhand: ["Dehradun", "Haridwar", "Roorkee", "Haldwani"],
  Goa: ["Panaji", "Margao", "Vasco da Gama"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan"],
  "Jammu and Kashmir": ["Srinagar", "Jammu"],
  Chandigarh: ["Chandigarh"],
};

interface FoodieFormData {
  fullName: string;
  mobile: string;
  email: string;
  state: string;
  city: string;
  pincode: string;
  aboutSelf: string;
  foodPreference: string;
  lookingFor: string[];
  notifyMe: boolean;
}

function PreRegisterContent() {
  const formTopRef = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const userType = "foodie" as const;

  // Kitchens no longer join a waitlist, they register directly in the partner portal.
  useEffect(() => {
    if (searchParams.get("type") === "kitchen") router.replace("/partner/login");
  }, [searchParams, router]);
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [foodieData, setFoodieData] = useState<FoodieFormData>({
    fullName: "",
    mobile: "",
    email: "",
    state: "",
    city: "",
    pincode: "",
    aboutSelf: "",
    foodPreference: "",
    lookingFor: [],
    notifyMe: false
  });

  const [states, setStates] = useState<StateItem[]>([]);

  // Validation Helpers
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateMobile = (mobile: string) => /^[0-9]{10}$/.test(mobile);

  // Foodie Validation
  const isStep1Valid =
    foodieData.fullName && validateMobile(foodieData.mobile) && validateEmail(foodieData.email);

  const isStep2Valid =
    foodieData.state && foodieData.city && foodieData.pincode.length === 6 && foodieData.aboutSelf;

  const isFoodieStep2Valid =
    foodieData.foodPreference &&
    foodieData.lookingFor.length > 0;

  const handleFoodieSubmit = async () => {
    setIsSubmitting(true);
    setErr(null);

    // Map UI values to API expected strings
    const mappedAbout = foodieData.aboutSelf.toUpperCase();
    const mappedTaste = foodieData.foodPreference === "veg" ? "VEG" : foodieData.foodPreference === "non-veg" ? "NON_VEG" : "BOTH";
    const mappedLooking = LOOKING_FOR_API[foodieData.lookingFor[0]] ?? "";

    const payload = {
      role: "USER",
      fullName: foodieData.fullName,
      mobileNo: foodieData.mobile,
      email: foodieData.email,
      state: foodieData.state,
      city: foodieData.city || "Not Specified",
      areaPincode: foodieData.pincode,
      aboutYourself: mappedAbout,
      taste: mappedTaste,
      lookingFor: mappedLooking,
    };

    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/web-waitlist/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.message || "Failed to submit. Please try again.");
      }

      setIsSubmitted(true);
      scrollToTop();
    } catch (error: unknown) {
      setErr(error instanceof Error ? error.message : "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch States on Mount
  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/states", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: "India" }),
    })
      .then((res) => res.json())
      .then((data: { error?: boolean; data?: { states?: StateItem[] } }) => {
        if (!data.error) {
          // Only show states that we have curated city data for, to maintain quality
          const fetchedStates = data.data?.states ?? [];
          const filteredStates = fetchedStates.filter((s) => CITY_DATA[s.name]);
          setStates(filteredStates.length > 0 ? filteredStates : fetchedStates);
        }
      })
      .catch((err) => console.error("Error fetching states:", err));
  }, []);

  const cities = foodieData.state ? (CITY_DATA[foodieData.state] || []) : [];

  // Avoid forcing scroll on tab/step change; it causes scrollbar layout shift on some devices/browsers.

  const scrollFormIntoView = () => {
    const behavior: ScrollBehavior =
      typeof window !== "undefined" && window.innerWidth < 768 ? "auto" : "smooth";
    // Run after render/layout settles.
    requestAnimationFrame(() => {
      formTopRef.current?.scrollIntoView({ behavior, block: "start" });
    });
  };

  const nextStep = () => {
    setStep((n) => Math.min(3, n + 1));
    scrollFormIntoView();
  };
  const prevStep = () => {
    setStep((n) => Math.max(1, n - 1));
    scrollFormIntoView();
  };

  const stepTitle = ["Who are you?", "Where do you eat?", "What do you like?"][step - 1];
  const canNext = step === 1 ? isStep1Valid : isStep2Valid;
  const pill = (on: boolean) =>
    `px-5 py-2.5 rounded-full font-semibold text-sm border transition-colors ${on ? "bg-[#087F78] border-[#087F78] text-white" : "bg-white border-slate-200 text-slate-600 hover:border-[#087F78]/50"}`;

  return (
    <div className="min-h-screen bg-[#F3F8F8] flex flex-col font-sans overflow-x-hidden">
      <Navbar />

      <main className="flex-1 w-full max-w-xl mx-auto px-6 pt-36 md:pt-44 pb-20 md:pb-28">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0D1B1E] leading-[1.05] tracking-tight mb-4">
            Join the <span className="italic text-[#087F78]" style={serif}>FreshBhoj family</span>
          </h1>
          <p className="text-slate-600 text-lg">Pre-register for early access and launch perks.</p>
        </div>

        {isSubmitted ? (
          <div className="rounded-3xl bg-white border border-slate-100 shadow-[0_30px_60px_-30px_rgba(8,127,120,0.4)] p-8 md:p-10 text-center">
            <span className="mx-auto w-14 h-14 rounded-full bg-[#087F78] text-white flex items-center justify-center mb-6">
              <Check size={28} strokeWidth={3} />
            </span>
            <h2 className="text-3xl font-extrabold text-[#0D1B1E] mb-3">You&apos;re on the list</h2>
            <p className="text-slate-600 mb-8">We&apos;ll let you know as soon as the app launches in your city.</p>
            <ul className="text-left space-y-4 mb-8">
              {BENEFITS.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-start gap-4">
                  <span className="w-10 h-10 shrink-0 rounded-xl bg-[#EFFAF8] text-[#087F78] flex items-center justify-center"><Icon size={18} /></span>
                  <div>
                    <p className="font-bold text-[#0D1B1E] leading-tight">{title}</p>
                    <p className="text-sm text-slate-600 mt-0.5">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/" className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-white font-bold bg-[#087F78] hover:bg-[#0B4F6C] transition-colors">
              Back to home <ChevronRight className="ml-1 w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div ref={formTopRef} className="scroll-mt-28 rounded-3xl bg-white border border-slate-100 shadow-[0_30px_60px_-30px_rgba(8,127,120,0.4)] p-6 md:p-10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-extrabold text-[#0D1B1E]">{stepTitle}</h2>
              <span className="text-sm font-semibold text-slate-500">Step {step} of 3</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-8" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step}>
              <div className="h-full bg-[#087F78] transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
            </div>

            <div className="space-y-5">
              {step === 1 && (
                <>
                  <div>
                    <label htmlFor="pr-name" className={labelCls}>Full name</label>
                    <input id="pr-name" type="text" placeholder="Your name" className={inputCls} value={foodieData.fullName} onChange={(e) => setFoodieData({ ...foodieData, fullName: e.target.value })} />
                  </div>
                  <div>
                    <label htmlFor="pr-mobile" className={`${labelCls} flex justify-between`}>
                      Mobile number
                      {foodieData.mobile && !validateMobile(foodieData.mobile) && (
                        <span className="text-xs text-red-500 font-semibold">Enter 10 digits</span>
                      )}
                    </label>
                    <input id="pr-mobile" type="tel" maxLength={10} placeholder="9876543210" className={inputCls} value={foodieData.mobile} onChange={(e) => setFoodieData({ ...foodieData, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })} />
                  </div>
                  <div>
                    <label htmlFor="pr-email" className={labelCls}>Email</label>
                    <input id="pr-email" type="email" placeholder="you@example.com" className={inputCls} value={foodieData.email} onChange={(e) => setFoodieData({ ...foodieData, email: e.target.value })} />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="pr-state" className={labelCls}>State</label>
                      <div className="relative">
                        <select id="pr-state" className={`${inputCls} appearance-none`} value={foodieData.state} onChange={(e) => setFoodieData({ ...foodieData, state: e.target.value, city: "" })}>
                          <option value="">Select state</option>
                          {states.map((st) => (
                            <option key={st.name} value={st.name}>{st.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="pr-city" className={labelCls}>City</label>
                      <div className="relative">
                        <select id="pr-city" className={`${inputCls} appearance-none disabled:opacity-50`} value={foodieData.city} onChange={(e) => setFoodieData({ ...foodieData, city: e.target.value })} disabled={!foodieData.state}>
                          <option value="">Select city</option>
                          {cities.map((c: string) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="pr-pin" className={labelCls}>Pincode</label>
                    <input id="pr-pin" type="text" inputMode="numeric" placeholder="400001" className={inputCls} value={foodieData.pincode} onChange={(e) => setFoodieData({ ...foodieData, pincode: e.target.value })} />
                  </div>
                  <div>
                    <span className={labelCls}>I am a</span>
                    <div className="flex flex-wrap gap-2">
                      {["Student", "Professional", "Family", "Other"].map((item) => (
                        <button key={item} type="button" aria-pressed={foodieData.aboutSelf === item} onClick={() => setFoodieData({ ...foodieData, aboutSelf: item })} className={pill(foodieData.aboutSelf === item)}>
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div>
                    <span className={labelCls}>Food preference</span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: "veg", label: "Veg" },
                        { id: "non-veg", label: "Non-Veg" },
                        { id: "both", label: "Both" },
                      ].map((pref) => (
                        <button key={pref.id} type="button" aria-pressed={foodieData.foodPreference === pref.id} onClick={() => setFoodieData({ ...foodieData, foodPreference: pref.id })} className={pill(foodieData.foodPreference === pref.id)}>
                          {pref.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className={labelCls}>What are you looking for?</span>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(LOOKING_FOR_API).map((id) => {
                        const on = foodieData.lookingFor.includes(id);
                        return (
                          <button
                            key={id}
                            type="button"
                            aria-pressed={on}
                            onClick={() => setFoodieData({ ...foodieData, lookingFor: on ? foodieData.lookingFor.filter((i) => i !== id) : [...foodieData.lookingFor, id] })}
                            className={pill(on)}
                          >
                            {id}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <label className="flex items-center gap-3 text-sm font-semibold text-[#0D1B1E] cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-[#087F78]" checked={foodieData.notifyMe} onChange={(e) => setFoodieData({ ...foodieData, notifyMe: e.target.checked })} />
                    Notify me when FreshBhoj launches in my city
                  </label>
                  {err && <p role="alert" className="text-sm text-red-600 font-semibold bg-red-50 py-3 px-4 rounded-xl text-center">{err}</p>}
                </>
              )}
            </div>

            <div className="flex items-center gap-4 mt-8">
              {step > 1 && (
                <button type="button" onClick={prevStep} disabled={isSubmitting} className="flex items-center gap-1 text-slate-600 font-semibold hover:text-[#0D1B1E] transition-colors">
                  <ChevronLeft className="w-5 h-5" /> Back
                </button>
              )}
              {step < 3 ? (
                <button type="button" onClick={nextStep} disabled={!canNext} className="flex-1 py-4 rounded-2xl text-white font-bold text-lg bg-[#087F78] hover:bg-[#0B4F6C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  Continue <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button type="button" onClick={handleFoodieSubmit} disabled={isSubmitting || !isFoodieStep2Valid} className="flex-1 py-4 rounded-2xl text-white font-bold text-lg bg-[#087F78] hover:bg-[#0B4F6C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isSubmitting ? "Joining..." : "Join the waitlist"}
                </button>
              )}
            </div>
            {step === 3 && (
              <p className="text-xs text-slate-500 text-center mt-5">
                By joining, you agree to our <Link href="/terms-of-service" className="underline">Terms of Service</Link> and <Link href="/privacy-policy" className="underline">Privacy Policy</Link>.
              </p>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

/** UI label -> value the waitlist API accepts (`lookingFor` enum on the backend). */
const LOOKING_FOR_API: Record<string, string> = {
  "Daily Meals": "DAILY_TIFFIN",
  "Occasional": "OCCASIONAL",
  "Restaurants & Dhabas": "STREET_FOOD",
  "Verified Kitchens": "HOME_STYLE",
};

export default function PreRegister() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F3F8F8] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#087F78]/20 border-t-[#087F78] rounded-full animate-spin" />
      </div>
    }>
      <PreRegisterContent />
    </Suspense>
  );
}
