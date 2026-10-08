"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { Navbar, Footer } from "../Components";

const gradientText = {
  background: "linear-gradient(169.21deg, #1DB9A0 9%, #087F78 77%, #0B4F6C 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  backgroundClip: "text" as const,
};

const gradientBg = {
  background: "linear-gradient(169.21deg, #1DB9A0 9%, #087F78 77%, #0B4F6C 100%)",
};

const contactUsInputBorder =
  "bg-slate-50 border border-slate-200/80 hover:border-slate-300 focus:bg-white focus:border-[#087F78]/20 focus:ring-4 focus:ring-[#087F78]/5 outline-none transition-all placeholder:text-slate-300";

const scrollToTop = () => {
  // Smooth scrolling can cause "fixed" navbar flicker on some mobile browsers.
  const behavior: ScrollBehavior =
    typeof window !== "undefined" && window.innerWidth < 768 ? "auto" : "smooth";
  window.scrollTo({ top: 0, behavior });
};

type StateItem = { name: string };

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
  const loadingCities = false;

  // Validation Helpers
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateMobile = (mobile: string) => /^[0-9]{10}$/.test(mobile);

  // Foodie Validation
  const isFoodieStep1Valid =
    foodieData.fullName &&
    validateMobile(foodieData.mobile) &&
    validateEmail(foodieData.email) &&
    foodieData.state &&
    foodieData.city &&
    foodieData.pincode.length === 6 &&
    foodieData.aboutSelf;

  const isFoodieStep2Valid =
    foodieData.foodPreference &&
    foodieData.lookingFor.length > 0;

  const handleFoodieSubmit = async () => {
    setIsSubmitting(true);
    setErr(null);

    // Map UI values to API expected strings
    const mappedAbout = foodieData.aboutSelf.toUpperCase();
    const mappedTaste = foodieData.foodPreference === "veg" ? "VEG" : foodieData.foodPreference === "non-veg" ? "NON_VEG" : "BOTH";
    const mappedLooking = foodieData.lookingFor[0]?.toUpperCase().replace(/[\s-]/g, "_") || "";

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
    setStep(2);
    scrollFormIntoView();
  };
  const prevStep = () => {
    setStep(1);
    scrollFormIntoView();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-[#F8FAFC] flex flex-col font-sans overflow-x-hidden relative">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-20 pt-36 md:pt-40 relative">
        {/* Subtle background accents (keeps page from looking flat) */}
        <div className="pointer-events-none absolute -top-20 right-[-140px] w-[420px] h-[420px] bg-[#087F78]/[0.06] blur-[90px] rounded-full" />
        <div className="pointer-events-none absolute top-[420px] left-[-160px] w-[520px] h-[520px] bg-[#1DB9A0]/[0.05] blur-[110px] rounded-full" />
        <div className="pointer-events-none absolute bottom-[-120px] right-[-180px] w-[560px] h-[560px] bg-slate-900/[0.03] blur-[130px] rounded-full" />

        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-10 md:mb-16 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-slate-200 shadow-sm mb-4 md:mb-6">
            <span className="w-2 h-2 rounded-full bg-[#087F78]" />
            <span className="text-[10px] md:text-[11px] font-extrabold tracking-[0.2em] md:tracking-[0.24em] uppercase text-slate-600">
              Early access waitlist
            </span>
          </div>
          <h1 className="text-3xl md:text-6xl lg:text-7xl font-extrabold text-[#0D1B1E] leading-[1.1] mb-4 md:mb-6 tracking-tight">
            Join the <span style={gradientText}>Community</span>
          </h1>
          <p className="text-slate-500 text-base md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Pre-register now to get early access and exclusive launch benefits <br className="hidden md:block" />
            across the FreshBhoj platform.
          </p>
        </div>

        {isSubmitted ? (
          /* Success Screen */
          <div className="max-w-2xl mx-auto py-12 md:py-20 px-6 text-center animate-in fade-in zoom-in duration-1000">
            <div className="relative w-32 h-32 mx-auto mb-10">
              <div className="absolute inset-0 bg-[#087F78]/10 rounded-[3rem] animate-ping duration-[3s]" />
              <div className="relative w-full h-full bg-white rounded-[2.5rem] shadow-xl border border-[#087F78]/10 flex items-center justify-center shadow-[#087F78]/5">
                <Image src="/select.svg" alt="Success" width={60} height={60} />
              </div>
              <div className="absolute -top-2 -right-2 bg-white p-2 rounded-xl shadow-lg border border-slate-50 animate-bounce">
                <Sparkles className="w-6 h-6" style={gradientText} />
              </div>
            </div>

            <h2 className="text-4xl font-bold text-[#0D1B1E] mb-6">
              You&apos;re on the list!
            </h2>
            <p className="text-lg text-slate-500 mb-12 leading-relaxed max-w-lg mx-auto">
              Welcome to the future of fresh food discovery! We&apos;ve saved your spot and will notify you as soon as we launch in your city.
            </p>

            <div className="space-y-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-12 py-5 rounded-3xl text-white font-bold text-lg shadow-[0_20px_40px_-10px_rgba(8,127,120,0.3)] hover:scale-[1.05] active:scale-95 transition-all"
                style={gradientBg}
              >
                Go Back Home <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
              <div className="block pt-12">
                <div className="flex gap-4">
                  {[
                    { src: "/insta.svg", alt: "Instagram", href: "https://www.instagram.com/freshbhoj" },
                    { src: "/whatsapp.svg", alt: "WhatsApp", href: "https://wa.me/918058318556" },
                    { src: "/x.svg", alt: "X", href: "https://x.com/freshbhoj" },
                  ].map((social) => (
                    <a
                      key={social.alt}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-[#087F78]/5 hover:border-[#087F78]/20 transition-all group"
                    >
                      <Image
                        src={social.src}
                        alt={social.alt}
                        width={20}
                        height={20}
                        className="object-contain brightness-0 opacity-40 group-hover:opacity-100 group-hover:invert transition-all"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : userType === "foodie" ? (
          /* Foodie Registration Flow */
          <div ref={formTopRef} className="max-w-4xl mx-auto relative scroll-mt-28 md:scroll-mt-32">
            {/* Background Accent Gradients */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#087F78] opacity-[0.03] blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1DB9A0] opacity-[0.03] blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-[#087F78]/15 shadow-[0_40px_90px_-35px_rgba(8,127,120,0.28)] overflow-hidden mb-12 ring-1 ring-white/60">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
              {/* Stepper Header */}
              <div className="p-8 md:p-10 border-b border-slate-50">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-[#0D1B1E]">
                    {step === 1 ? "Start your foodie journey" : "Tell us your preferences"}
                  </h2>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-700"
                    style={{
                      ...gradientBg,
                      width: step === 1 ? "50%" : "100%"
                    }}
                  />
                </div>
                <div className="flex justify-between items-center mt-3">
                  <p className="text-sm text-slate-400">
                    {step === 1 ? "Basic Information" : "Customizing Experience"}
                  </p>
                  <span className="font-semibold text-sm" style={gradientText}>Step {step} of 2</span>
                </div>
              </div>

              <div className="p-6 md:p-12 space-y-8 md:space-y-12">
                {step === 1 ? (
                  <>
                    {/* Personal Information */}
                    <div>
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-[#EFFAF8] flex items-center justify-center">
                          <Image src="/personal.svg" alt="Personal" width={20} height={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-[#0D1B1E]">Personal Information</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                          <label className="block text-sm font-semibold text-[#0D1B1E] ml-1 mb-4">Full Name</label>
                          <input
                            type="text"
                            placeholder="John Doe"
                            className={`w-full px-6 py-4 rounded-full ${contactUsInputBorder}`}
                            value={foodieData.fullName}
                            onChange={(e) => setFoodieData({ ...foodieData, fullName: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[#0D1B1E] ml-1 mb-4 flex justify-between">
                            Mobile Number
                            {foodieData.mobile && !validateMobile(foodieData.mobile) && (
                              <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider animate-pulse">Invalid (10 Digits)</span>
                            )}
                          </label>
                          <input
                            type="tel"
                            maxLength={10}
                            placeholder="9876543210"
                            className={`w-full px-6 py-4 rounded-full ${contactUsInputBorder} ${foodieData.mobile && !validateMobile(foodieData.mobile) ? "!border-red-200 !shadow-[0_0_0_4px_rgba(239,68,68,0.1)]" : ""}`}
                            value={foodieData.mobile}
                            onChange={(e) => setFoodieData({ ...foodieData, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-[#0D1B1E] ml-1 mb-4">Email ID</label>
                        <input
                          type="email"
                          placeholder="example@freshbhoj.com"
                          className={`w-full px-6 py-4 rounded-full ${contactUsInputBorder}`}
                          value={foodieData.email}
                          onChange={(e) => setFoodieData({ ...foodieData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Location Details */}
                    <div>
                      <div className="flex items-center gap-3 mb-8">
                        <Image src="/location.svg" alt="Location" width={20} height={20} />
                        <h3 className="text-lg font-semibold text-[#0D1B1E]">Location Details</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-[#0D1B1E] ml-1 mb-4">State</label>
                          <div className="relative">
                            <select
                              className="w-full px-5 py-4 rounded-full input-gradient-focus appearance-none"
                              value={foodieData.state}
                              onChange={(e) => setFoodieData({ ...foodieData, state: e.target.value, city: "" })}
                            >
                              <option value="">Select State</option>
                              {states.map((s) => (
                                <option key={s.name} value={s.name}>{s.name}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[#0D1B1E] ml-1 mb-4">City</label>
                          <div className="relative">
                            <select
                              className="w-full px-5 py-4 rounded-full input-gradient-focus appearance-none disabled:opacity-50"
                              value={foodieData.city}
                              onChange={(e) => setFoodieData({ ...foodieData, city: e.target.value })}
                              disabled={!foodieData.state}
                            >
                              <option value="">Select City</option>
                              {cities.map((c: string) => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[#0D1B1E] ml-1 mb-4">Area / Pincode</label>
                          <input
                            type="text"
                            placeholder="400001"
                            className={`w-full px-6 py-4 rounded-full ${contactUsInputBorder}`}
                            value={foodieData.pincode}
                            onChange={(e) => setFoodieData({ ...foodieData, pincode: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* About Yourself */}
                    <div>
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-[#EFFAF8] flex items-center justify-center">
                          <Image src="/about-yourself.svg" alt="About" width={20} height={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-[#0D1B1E]">Tell us about yourself</h3>
                      </div>
                      <div className="space-y-4">
                        <label className="block text-sm font-semibold text-[#0D1B1E] ml-1 mb-4">Who are you?</label>
                        <div className="flex flex-wrap gap-3">
                          {["Student", "Professional", "Family", "Other"].map((item) => (
                            <button
                              key={item}
                              onClick={() => setFoodieData({ ...foodieData, aboutSelf: item })}
                              className={`px-6 py-3 rounded-full font-semibold text-sm transition-all border-2 ${foodieData.aboutSelf === item
                                ? "border-[#087F78] bg-[#EFFAF8]"
                                : "border-slate-100 text-slate-500 hover:border-slate-200"
                                }`}
                              style={foodieData.aboutSelf === item ? gradientText : {}}
                            >
                              <div className="flex items-center gap-2">
                                {foodieData.aboutSelf === item && <Image src="/select.svg" alt="Selected" width={14} height={14} />}
                                {item}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Step 1 Button */}
                    <div className="pt-6">
                      <button
                        onClick={nextStep}
                        disabled={!isFoodieStep1Valid}
                        className={`w-full py-5 rounded-3xl text-white font-semibold text-xl shadow-[0_15px_30px_-5px_rgba(8,127,120,0.3)] transition-all flex items-center justify-center gap-3 group ${!isFoodieStep1Valid ? "opacity-50 cursor-not-allowed bg-slate-300 shadow-none scale-100" : "hover:scale-[1.02] active:scale-95"}`}
                        style={isFoodieStep1Valid ? gradientBg : {}}
                      >
                        Next Step <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Taste Section */}
                    <div className="animate-in fade-in slide-in-from-right-10 duration-500">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-[#EFFAF8] flex items-center justify-center">
                          <Image src="/taste.svg" alt="Taste" width={20} height={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-[#0D1B1E]">Tell us your taste</h3>
                      </div>

                      <div className="space-y-10">
                        <div>
                          <label className="block text-sm font-semibold text-[#0D1B1E] ml-1 mb-6">Food Preference</label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                              { id: "veg", label: "Veg", icon: "/veg.svg" },
                              { id: "non-veg", label: "Non-Veg", icon: "/non-veg.svg" },
                              { id: "both", label: "Both", icon: "/both.svg" }
                            ].map((pref) => (
                              <button
                                key={pref.id}
                                onClick={() => setFoodieData({ ...foodieData, foodPreference: pref.id })}
                                className={`p-6 rounded-[1.5rem] border-2 transition-all flex flex-col items-center gap-4 text-center ${foodieData.foodPreference === pref.id
                                  ? "border-[#087F78] bg-[#087F78]/5 shadow-md shadow-[#087F78]/5"
                                  : "border-slate-100 bg-white hover:border-slate-200"
                                  }`}
                              >
                                <Image src={pref.icon} alt={pref.label} width={28} height={28} />
                                <div className="font-semibold text-[#0D1B1E] flex items-center gap-2">
                                  {foodieData.foodPreference === pref.id && <Image src="/select.svg" alt="Selected" width={14} height={14} />}
                                  {pref.label}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#0D1B1E] ml-1 mb-6">Looking for</label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                              { id: "Daily Meals", icon: "/daily-tiffin.svg" },
                              { id: "Occasional", icon: "/occasional.svg" },
                              { id: "Restaurants & Dhabas", icon: "/street-food.svg" },
                              { id: "Verified Kitchens", icon: "/home.svg" }
                            ].map((item) => (
                              <button
                                key={item.id}
                                onClick={() => {
                                  const newLooking = foodieData.lookingFor.includes(item.id)
                                    ? foodieData.lookingFor.filter(i => i !== item.id)
                                    : [...foodieData.lookingFor, item.id];
                                  setFoodieData({ ...foodieData, lookingFor: newLooking });
                                }}
                                className={`px-6 py-4 rounded-2xl font-semibold text-sm transition-all border-2 flex items-center justify-between ${foodieData.lookingFor.includes(item.id)
                                  ? "border-[#087F78] bg-[#087F78]/5 shadow-sm shadow-[#087F78]/5"
                                  : "border-slate-100 text-slate-500 hover:border-slate-200 bg-white"
                                  }`}
                              >
                                <div className="flex items-center gap-3">
                                  <Image src={item.icon} alt={item.id} width={20} height={20} />
                                  <span className={foodieData.lookingFor.includes(item.id) ? "" : "text-slate-500"} style={foodieData.lookingFor.includes(item.id) ? gradientText : {}}>{item.id}</span>
                                </div>
                                {foodieData.lookingFor.includes(item.id) ? (
                                  <Image src="/select.svg" alt="Selected" width={20} height={20} />
                                ) : (
                                  <div className="w-5 h-5 rounded-full border border-slate-200" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notify Me */}
                    <div className="flex items-center gap-3 pt-4">
                      <button
                        onClick={() => setFoodieData({ ...foodieData, notifyMe: !foodieData.notifyMe })}
                        className="flex items-center gap-4 text-[#0D1B1E] font-semibold text-sm hover:text-[#0D1B1E] transition-colors"
                      >
                        {foodieData.notifyMe ? (
                          <Image src="/select.svg" alt="Checked" width={24} height={24} />
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-slate-300 bg-slate-50 shadow-sm flex-shrink-0" />
                        )}
                        Notify me when FreshBhoj launches in my city
                      </button>
                    </div>

                    {/* Submit Button */}
                    <div className="flex flex-col gap-6 pt-12 border-t border-slate-50">
                      {err && <p className="text-sm text-red-500 font-semibold bg-red-50 py-3 px-4 rounded-xl text-center">{err}</p>}
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-8">
                        <button
                          onClick={prevStep}
                          disabled={isSubmitting}
                          className="w-full md:w-auto flex items-center justify-center md:justify-start gap-2 text-slate-500 font-semibold text-sm hover:text-[#0D1B1E] transition-colors whitespace-nowrap py-3 md:py-0 rounded-2xl md:rounded-none bg-slate-50 md:bg-transparent border border-slate-200/70 md:border-0"
                        >
                          <ChevronLeft className="w-5 h-5" /> Back
                        </button>
                        <button
                          onClick={handleFoodieSubmit}
                          disabled={isSubmitting || !isFoodieStep2Valid}
                          className={`w-full md:flex-1 py-4 md:py-5 rounded-3xl text-white font-semibold text-lg md:text-xl shadow-[0_15px_30px_-5px_rgba(8,127,120,0.3)] transition-all flex items-center justify-center gap-2 md:gap-3 ${isSubmitting || !isFoodieStep2Valid ? "opacity-50 cursor-not-allowed bg-slate-300 shadow-none scale-100" : "hover:scale-[1.02] active:scale-95"}`}
                          style={!isSubmitting && isFoodieStep2Valid ? gradientBg : {}}
                        >
                          {isSubmitting ? (
                            <>Joining... <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /></>
                          ) : (
                            <>Join Waitlist <CheckCircle2 className="w-5 md:w-6 h-5 md:h-6" /></>
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-slate-400 text-center">
                        By joining, you agree to our Terms of Service and Privacy Policy.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}

export default function PreRegister() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#087F78]/20 border-t-[#087F78] rounded-full animate-spin" />
      </div>
    }>
      <PreRegisterContent />
    </Suspense>
  );
}
