"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
  UtensilsCrossed,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { Navbar, Footer } from "../Components";

const gradientText = {
  background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  backgroundClip: "text" as const,
};

const gradientBg = {
  background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
};

const contactUsInputBorder =
  "bg-slate-50 border border-slate-200/80 hover:border-slate-300 focus:bg-white focus:border-[#BA2121]/20 focus:ring-4 focus:ring-[#BA2121]/5 outline-none transition-all placeholder:text-slate-300";

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

interface KitchenFormData {
  kitchenName: string;
  contactPerson: string;
  mobile: string;
  email: string;
  vendorType: string;
  priceRange: string;
  state: string;
  city: string;
  fssaiStatus: string;
  fssaiNumber: string;
  gstNumber: string;
  deliveryMethod: string;
  timings: string[];
  visualStorytelling: string;
  whyJoin: string;
}

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

export default function PreRegister() {
  const formTopRef = useRef<HTMLDivElement | null>(null);
  const [userType, setUserType] = useState<"foodie" | "kitchen" | null>(null);
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<KitchenFormData>({
    kitchenName: "",
    contactPerson: "",
    mobile: "",
    email: "",
    vendorType: "",
    priceRange: "",
    state: "",
    city: "",
    fssaiStatus: "", // Removing "registered" default
    fssaiNumber: "",
    gstNumber: "",
    deliveryMethod: "", // Removing "self" default
    timings: [], // Removing "Lunch", "Dinner" defaults
    visualStorytelling: "",
    whyJoin: ""
  });

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

  // Kitchen Validation
  const isKitchenStep1Valid =
    formData.kitchenName &&
    formData.contactPerson &&
    validateMobile(formData.mobile) &&
    validateEmail(formData.email) &&
    formData.vendorType &&
    formData.priceRange &&
    formData.state &&
    formData.city;

  const isKitchenStep2Valid =
    formData.fssaiStatus &&
    (formData.fssaiStatus === "registered" ? formData.fssaiNumber.length === 14 : true) &&
    formData.deliveryMethod &&
    formData.timings.length > 0 &&
    formData.visualStorytelling &&
    formData.whyJoin.length > 20;

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

  const handleKitchenSubmit = async () => {
    setIsSubmitting(true);
    setErr(null);

    const payload = {
      kitchenName: formData.kitchenName,
      contactPerson: formData.contactPerson,
      mobileNo: formData.mobile,
      email: formData.email,
      vendorType: formData.vendorType.toUpperCase().replace(/\s/g, "_"),
      avgMealPrice: formData.priceRange,
      state: formData.state,
      city: formData.city || "Not Specified",
      fssaiStatus: formData.fssaiStatus.toUpperCase(),
      fssaiLicenseNo: formData.fssaiNumber,
      gstNumber: formData.gstNumber,
      deliveryCapability: formData.deliveryMethod.toUpperCase(),
      serviceTiming: formData.timings.map(t => t.split(" ")[0].toUpperCase()),
      interestedInReels: formData.visualStorytelling === "yes",
      whyJoinFreshbhoj: formData.whyJoin,
    };

    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/web-waitlist/kitchen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.message || "Registration failed. Check your details.");
      }

      setIsSubmitted(true);
      scrollToTop();
    } catch (error: unknown) {
      setErr(error instanceof Error ? error.message : "Registration failed. Check your details.");
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

  const cities = userType === "kitchen"
    ? (formData.state ? (CITY_DATA[formData.state] || []) : [])
    : (foodieData.state ? (CITY_DATA[foodieData.state] || []) : []);

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

  const vendorTypes = ["Home Kitchen", "Tiffin Service", "Cloud Kitchen", "Street Food", "Restaurant", "Cafe",];
  const priceRanges = ["₹50 - ₹100", "₹100 - ₹200", "₹200 - ₹350", "₹350+"];
  const serviceTimings = ["Breakfast (7am - 11am)", "Lunch (12pm - 4pm)", "Dinner (7pm - 11pm)"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-[#F8FAFC] flex flex-col font-sans overflow-x-hidden relative">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-20 pt-32 md:pt-32 relative">
        {/* Subtle background accents (keeps page from looking flat) */}
        <div className="pointer-events-none absolute -top-20 right-[-140px] w-[420px] h-[420px] bg-[#BA2121]/[0.06] blur-[90px] rounded-full" />
        <div className="pointer-events-none absolute top-[420px] left-[-160px] w-[520px] h-[520px] bg-[#FF6B6B]/[0.05] blur-[110px] rounded-full" />
        <div className="pointer-events-none absolute bottom-[-120px] right-[-180px] w-[560px] h-[560px] bg-slate-900/[0.03] blur-[130px] rounded-full" />

        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-16 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-slate-200 shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[#BA2121]" />
            <span className="text-[11px] font-extrabold tracking-[0.24em] uppercase text-slate-600">
              Early access waitlist
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-[#0F172A] leading-[1.1] mb-6 tracking-tight">
            Join the <span style={gradientText}>Community</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Pre-register now to get early access and exclusive launch benefits <br className="hidden md:block" />
            across the FreshBhoj platform.
          </p>
        </div>

        {/* User Type Switcher */}
        <div className="flex justify-center mb-16 px-4">
          <div className="relative bg-white/80 backdrop-blur p-1.5 rounded-[2.5rem] flex w-full max-w-[420px] shadow-[0_18px_50px_-20px_rgba(15,23,42,0.25)] border border-slate-200/70 overflow-hidden ring-1 ring-black/[0.04]">
            {/* Sliding Background Indicator */}
            {userType && (
              <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-[2.2rem] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${userType === "foodie" ? "left-1" : "left-[calc(50%+1px)]"
                  }`}
                style={gradientBg}
              />
            )}

            <button
              onClick={() => { setUserType("foodie"); setStep(1); setIsSubmitted(false); scrollFormIntoView(); }}
              type="button"
              aria-pressed={userType === "foodie"}
              className={`relative flex-1 py-3.5 px-2 rounded-[2.2rem] font-bold text-sm md:text-base transition-all duration-500 flex items-center justify-center z-10 cursor-pointer select-none focus:outline-none focus:ring-4 focus:ring-[#BA2121]/10 ${
                userType === "foodie"
                  ? "text-white"
                  : "text-slate-600 hover:text-slate-900 bg-slate-50/60 hover:bg-slate-50 active:bg-slate-100"
                }`}
            >
              I am a Foodie
            </button>

            <button
              onClick={() => { setUserType("kitchen"); setStep(1); setIsSubmitted(false); scrollFormIntoView(); }}
              type="button"
              aria-pressed={userType === "kitchen"}
              className={`relative flex-1 py-3.5 px-2 rounded-[2.2rem] font-bold text-sm md:text-base transition-all duration-500 flex items-center justify-center z-10 cursor-pointer select-none focus:outline-none focus:ring-4 focus:ring-[#BA2121]/10 ${
                userType === "kitchen"
                  ? "text-white"
                  : "text-slate-600 hover:text-slate-900 bg-slate-50/60 hover:bg-slate-50 active:bg-slate-100"
                }`}
            >
              I am a Kitchen
            </button>
          </div>
        </div>

        {isSubmitted ? (
          /* Success Screen */
          <div className="max-w-2xl mx-auto py-12 md:py-20 px-6 text-center animate-in fade-in zoom-in duration-1000">
            <div className="relative w-32 h-32 mx-auto mb-10">
              <div className="absolute inset-0 bg-[#BA2121]/10 rounded-[3rem] animate-ping duration-[3s]" />
              <div className="relative w-full h-full bg-white rounded-[2.5rem] shadow-xl border border-[#BA2121]/10 flex items-center justify-center shadow-[#BA2121]/5">
                <Image src="/select.svg" alt="Success" width={60} height={60} />
              </div>
              <div className="absolute -top-2 -right-2 bg-white p-2 rounded-xl shadow-lg border border-slate-50 animate-bounce">
                <Sparkles className="w-6 h-6" style={gradientText} />
              </div>
            </div>

            <h2 className="text-4xl font-bold text-[#0F172A] mb-6">
              {userType === "kitchen" ? "Application Submitted!" : "You're on the list!"}
            </h2>
            <p className="text-lg text-slate-500 mb-12 leading-relaxed max-w-lg mx-auto">
              {userType === "kitchen"
                ? "Thank you for sharing your journey with us. Our team will review your kitchen details and get back to you within 48 hours."
                : "Welcome to the future of home-style dining! We've saved your spot and will notify you as soon as we launch in your city."}
            </p>

            <div className="space-y-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-12 py-5 rounded-3xl text-white font-bold text-lg shadow-[0_20px_40px_-10px_rgba(186,33,33,0.3)] hover:scale-[1.05] active:scale-95 transition-all"
                style={gradientBg}
              >
                Go Back Home <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
              <div className="block pt-12">
                <div className="flex justify-center gap-6 mt-12">
                  {[
                    { src: "/insta.svg", alt: "Instagram" },
                    { src: "/whatsapp.svg", alt: "WhatsApp" },
                    { src: "/facebook.svg", alt: "Facebook" },
                  ].map((social) => (
                    <a
                      key={social.alt}
                      href="#"
                      className="relative w-12 h-12 flex items-center justify-center rounded-full bg-white border border-slate-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg group"
                    >
                      {/* Gradient Hover Layer */}
                      <div
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={gradientBg}
                      />
                      <div className="relative w-5 h-5 z-10 transition-all">
                        <Image
                          src={social.src}
                          alt={social.alt}
                          width={20}
                          height={20}
                          className="object-contain brightness-0 opacity-40 group-hover:opacity-100 group-hover:invert transition-all"
                        />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : !userType ? (
          /* Neutral Initial State */
          <div className="max-w-xl mx-auto text-center py-12 animate-in fade-in zoom-in duration-700">
            <div className="w-24 h-24 bg-[#FFF5F5] rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Sparkles className="w-10 h-10 text-[#BA2121]" />
            </div>
            <h2 className="text-2xl font-bold text-[#0F172A] mb-4">How would you like to join?</h2>
            <p className="text-slate-500">
              Select whether you&apos;re here to discover incredible flavors or to share your culinary journey with the world.
            </p>
          </div>
        ) : userType === "foodie" ? (
          /* Foodie Registration Flow */
          <div ref={formTopRef} className="max-w-4xl mx-auto relative scroll-mt-28 md:scroll-mt-32">
            {/* Background Accent Gradients */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#BA2121] opacity-[0.03] blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF6B6B] opacity-[0.03] blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            
            <div className="relative bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-[#BA2121]/15 shadow-[0_40px_90px_-35px_rgba(186,33,33,0.28)] overflow-hidden mb-12 ring-1 ring-white/60">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
              {/* Stepper Header */}
              <div className="p-8 md:p-10 border-b border-slate-50">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-[#0F172A]">
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

              <div className="p-8 md:p-12 space-y-12">
                {step === 1 ? (
                  <>
                    {/* Personal Information */}
                    <div>
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-[#FFF5F5] flex items-center justify-center">
                          <Image src="/personal.svg" alt="Personal" width={20} height={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-[#0F172A]">Personal Information</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                          <label className="block text-sm font-semibold text-[#0F172A] ml-1 mb-4">Full Name</label>
                          <input
                            type="text"
                            placeholder="John Doe"
                            className={`w-full px-6 py-4 rounded-full ${contactUsInputBorder}`}
                            value={foodieData.fullName}
                            onChange={(e) => setFoodieData({ ...foodieData, fullName: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[#0F172A] ml-1 mb-4 flex justify-between">
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
                        <label className="block text-sm font-semibold text-[#0F172A] ml-1 mb-4">Email ID</label>
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
                        <h3 className="text-lg font-semibold text-[#0F172A]">Location Details</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-[#0F172A] ml-1 mb-4">State</label>
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
                          <label className="block text-sm font-semibold text-[#0F172A] ml-1 mb-4">City</label>
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
                          <label className="block text-sm font-semibold text-[#0F172A] ml-1 mb-4">Area / Pincode</label>
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
                        <div className="w-10 h-10 rounded-xl bg-[#FFF5F5] flex items-center justify-center">
                          <Image src="/about-yourself.svg" alt="About" width={20} height={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-[#0F172A]">Tell us about yourself</h3>
                      </div>
                      <div className="space-y-4">
                        <label className="block text-sm font-semibold text-[#0F172A] ml-1 mb-4">Who are you?</label>
                        <div className="flex flex-wrap gap-3">
                          {["Student", "Working Professional", "Family", "Other"].map((item) => (
                            <button
                              key={item}
                              onClick={() => setFoodieData({ ...foodieData, aboutSelf: item })}
                              className={`px-6 py-3 rounded-full font-semibold text-sm transition-all border-2 ${foodieData.aboutSelf === item
                                ? "border-[#BA2121] bg-[#FFF5F5]"
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
                        className={`w-full py-5 rounded-3xl text-white font-semibold text-xl shadow-[0_15px_30px_-5px_rgba(186,33,33,0.3)] transition-all flex items-center justify-center gap-3 group ${!isFoodieStep1Valid ? "opacity-50 cursor-not-allowed bg-slate-300 shadow-none scale-100" : "hover:scale-[1.02] active:scale-95"}`}
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
                        <div className="w-10 h-10 rounded-xl bg-[#FFF5F5] flex items-center justify-center">
                          <Image src="/taste.svg" alt="Taste" width={20} height={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-[#0F172A]">Tell us your taste</h3>
                      </div>

                      <div className="space-y-10">
                        <div>
                          <label className="block text-sm font-semibold text-[#0F172A] ml-1 mb-6">Food Preference</label>
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
                                  ? "border-[#BA2121] bg-[#BA2121]/5 shadow-md shadow-[#BA2121]/5"
                                  : "border-slate-100 bg-white hover:border-slate-200"
                                  }`}
                              >
                                <Image src={pref.icon} alt={pref.label} width={28} height={28} />
                                <div className="font-semibold text-[#0F172A] flex items-center gap-2">
                                  {foodieData.foodPreference === pref.id && <Image src="/select.svg" alt="Selected" width={14} height={14} />}
                                  {pref.label}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-[#0F172A] ml-1 mb-6">Looking for</label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                              { id: "Daily Tiffin", icon: "/daily-tiffin.svg" },
                              { id: "Occasional", icon: "/occasional.svg" },
                              { id: "Street Food", icon: "/street-food.svg" },
                              { id: "Home-Style", icon: "/home.svg" }
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
                                  ? "border-[#BA2121] bg-[#BA2121]/5 shadow-sm shadow-[#BA2121]/5"
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
                        className="flex items-center gap-4 text-[#0F172A] font-semibold text-sm hover:text-[#0F172A] transition-colors"
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
                          className="w-full md:w-auto flex items-center justify-center md:justify-start gap-2 text-slate-500 font-semibold text-sm hover:text-[#0F172A] transition-colors whitespace-nowrap py-3 md:py-0 rounded-2xl md:rounded-none bg-slate-50 md:bg-transparent border border-slate-200/70 md:border-0"
                        >
                          <ChevronLeft className="w-5 h-5" /> Back
                        </button>
                        <button
                          onClick={handleFoodieSubmit}
                          disabled={isSubmitting || !isFoodieStep2Valid}
                          className={`w-full md:flex-1 py-4 md:py-5 rounded-3xl text-white font-semibold text-lg md:text-xl shadow-[0_15px_30px_-5px_rgba(186,33,33,0.3)] transition-all flex items-center justify-center gap-2 md:gap-3 ${isSubmitting || !isFoodieStep2Valid ? "opacity-50 cursor-not-allowed bg-slate-300 shadow-none scale-100" : "hover:scale-[1.02] active:scale-95"}`}
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
        ) : (
          /* Kitchen Registration Flow */
          <div ref={formTopRef} className="max-w-4xl mx-auto relative scroll-mt-28 md:scroll-mt-32">
            {/* Background Accent Gradients */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#BA2121] opacity-[0.03] blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF6B6B] opacity-[0.03] blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            
            <div className="relative bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-[#BA2121]/15 shadow-[0_40px_90px_-35px_rgba(186,33,33,0.28)] overflow-hidden mb-12 ring-1 ring-white/60">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
              {/* Stepper Header */}
              <div className="p-8 md:p-10 border-b border-slate-50">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-[#0F172A]">
                    {step === 1 ? "List your kitchen on FreshBhoj" : "Help us understand your setup"}
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
                    {step === 1 ? "Basic Details & Operations" : "Finalizing Registration"}
                  </p>
                  <span className="font-semibold text-sm" style={gradientText}>Step {step} of 2</span>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8 md:p-10">
                {step === 1 ? (
                  /* STEP 1: Basic Details */
                  <div className="space-y-12">
                    {/* Basic Details Section */}
                    <div>
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-[#FFF5F5] flex items-center justify-center">
                          <Image src="/basic-details.svg" alt="Basic Details" width={20} height={20} />                        </div>
                        <h3 className="text-lg font-semibold text-[#0F172A]">Basic Details</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-[#0F172A] ml-1 mb-4">Kitchen Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Grandma's Spices"
                            className={`w-full px-5 py-4 rounded-full ${contactUsInputBorder}`}
                            value={formData.kitchenName}
                            onChange={(e) => setFormData({ ...formData, kitchenName: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[#0F172A] ml-1 mb-4">Contact Person</label>
                          <input
                            type="text"
                            placeholder="Your Full Name"
                            className={`w-full px-5 py-4 rounded-full ${contactUsInputBorder}`}
                            value={formData.contactPerson}
                            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[#0F172A] ml-1 mb-4 flex justify-between">
                            Mobile Number
                            {formData.mobile && !validateMobile(formData.mobile) && (
                              <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider animate-pulse">Invalid (10 Digits)</span>
                            )}
                          </label>
                          <input
                            type="tel"
                            maxLength={10}
                            placeholder="9876543210"
                            className={`w-full px-5 py-4 rounded-full ${contactUsInputBorder} ${formData.mobile && !validateMobile(formData.mobile) ? "!border-red-200 !shadow-[0_0_0_4px_rgba(239,68,68,0.1)]" : ""}`}
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[#0F172A] ml-1 mb-4">Email Address</label>
                          <input
                            type="email"
                            placeholder="kitchen@example.com"
                            className={`w-full px-5 py-4 rounded-full ${contactUsInputBorder}`}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Food & Operations Section */}
                    <div>
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-[#FFF5F5] flex items-center justify-center">
                          <UtensilsCrossed className="w-5 h-5" style={{ color: "#BA2121" }} />
                        </div>
                        <h3 className="text-lg font-semibold  text-[#0F172A]">Food & Operations</h3>
                      </div>

                      <div className="space-y-8">
                        {/* Vendor Type */}
                        <div>
                          <label className="block text-sm font-semibold text-[#0F172A] ml-1 mb-4">Vendor Type</label>
                          <div className="flex flex-wrap gap-3">
                            {vendorTypes.map((type) => (
                              <button
                                key={type}
                                onClick={() => setFormData({ ...formData, vendorType: type })}
                                className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 border-2 ${formData.vendorType === type
                                  ? "border-[#BA2121] bg-[#FFF5F5]"
                                  : "border-slate-100 text-slate-500 hover:border-slate-200"
                                  }`}
                                style={formData.vendorType === type ? gradientText : {}}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Average Meal Price */}
                        <div>
                          <label className="block text-sm font-semibold text-[#0F172A] ml-1 mb-4">Average Meal Price (Range)</label>
                          <div className="flex flex-wrap gap-3">
                            {priceRanges.map((range) => (
                              <button
                                key={range}
                                onClick={() => setFormData({ ...formData, priceRange: range })}
                                className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 border-2 ${formData.priceRange === range
                                  ? "border-[#BA2121] bg-[#FFF5F5]"
                                  : "border-slate-100 text-slate-500 hover:border-slate-200"
                                  }`}
                                style={formData.priceRange === range ? gradientText : {}}
                              >
                                {range}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Location Selects */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="text-left">
                            <label className="block text-sm font-semibold text-[#0F172A] ml-1 mb-4">State / Union Territory</label>
                            <div className="relative">
                              <select
                                className="w-full px-5 py-4 rounded-full input-gradient-focus appearance-none cursor-pointer"
                                value={formData.state}
                                onChange={(e) => {
                                  setFormData({ ...formData, state: e.target.value, city: "" });
                                }}
                              >
                                <option value="">Select State</option>
                                {states.map((s) => (
                                  <option key={s.name} value={s.name}>{s.name}</option>
                                ))}
                              </select>
                              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                            </div>
                          </div>
                          <div className="text-left">
                            <label className="block text-sm font-semibold text-[#0F172A] ml-1 mb-4">City</label>
                            <div className="relative">
                              <select
                                className="w-full px-5 py-4 rounded-full input-gradient-focus appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                disabled={!formData.state || loadingCities}
                              >
                                <option value="">{loadingCities ? "Loading Cities..." : "Select City"}</option>
                                {cities.map((c: string) => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 1 Button */}
                    <div className="pt-6">
                      <button
                        onClick={nextStep}
                        disabled={!isKitchenStep1Valid}
                        className={`w-full py-5 rounded-3xl text-white font-semibold text-xl shadow-[0_15px_30px_-5px_rgba(186,33,33,0.3)] transition-all flex items-center justify-center gap-3 group ${!isKitchenStep1Valid ? "opacity-50 cursor-not-allowed bg-slate-300 shadow-none scale-100" : "hover:scale-[1.02] active:scale-95"}`}
                        style={isKitchenStep1Valid ? gradientBg : {}}
                      >
                        Next Step <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <p className="text-center text-xs text-slate-400 mt-5">
                        By proceeding, you agree to FreshBhoj Partner Terms & Conditions.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* STEP 2: Legal & Delivery */
                  <div className="space-y-12 animate-in fade-in slide-in-from-right-10 duration-500">
                    {/* Legal & Hygiene Section */}
                    <div>
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-[#FFF5F5] flex items-center justify-center">
                          <ShieldCheck className="w-5 h-5" style={{ color: "#BA2121" }} />
                        </div>
                        <h3 className="text-lg font-semibold  text-[#0F172A]">Legal & Hygiene</h3>
                      </div>
                      <div className="space-y-4 mb-8">
                        <button
                          onClick={() => setFormData({ ...formData, fssaiStatus: "registered" })}
                          className={`w-full p-6 rounded-[1.5rem] border-2 transition-all flex items-center gap-5 text-left ${formData.fssaiStatus === "registered"
                            ? "border-[#BA2121]/50 bg-[#FFF5F5]"
                            : "border-slate-100 hover:border-slate-200"
                            }`}
                        >
                          {formData.fssaiStatus === "registered" ? (
                            <Image src="/select.svg" alt="Selected" width={24} height={24} className="flex-shrink-0" />
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-slate-200 flex-shrink-0" />
                          )}
                          <div>
                            <div className="font-semibold  text-[#0F172A] flex items-center gap-2">
                              <Image src="/shield-check.svg" alt="Shield Check" width={16} height={16} /> FSSAI Registered
                            </div>
                            <p className="text-xs text-slate-400 mt-1">I have a valid 14-digit FSSAI license number</p>
                          </div>
                        </button>
                        <button
                          onClick={() => setFormData({ ...formData, fssaiStatus: "applying" })}
                          className={`w-full p-6 rounded-[1.5rem] border-2 transition-all flex items-center gap-5 text-left ${formData.fssaiStatus === "applying"
                            ? "border-[#BA2121]/50 bg-[#FFF5F5]"
                            : "border-slate-100 hover:border-slate-200"
                            }`}
                        >
                          {formData.fssaiStatus === "applying" ? (
                            <Image src="/select.svg" alt="Selected" width={24} height={24} className="flex-shrink-0" />
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-slate-200 flex-shrink-0" />
                          )}
                          <div>
                            <div className="font-semibold  text-[#0F172A] flex items-center gap-2">
                              <Image src="/applying.svg" alt="Shield Check" width={16} height={16} /> Applying for FSSAI
                            </div>
                            <p className="text-xs text-slate-400 mt-1">I have applied and have a valid acknowledgment receipt</p>
                          </div>
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-[#0F172A] ml-1 mb-4">FSSAI License Number</label>
                          <input
                            type="text"
                            placeholder="e.g. 12345678901234"
                            className={`w-full px-5 py-4 rounded-full ${contactUsInputBorder}`}
                            value={formData.fssaiNumber}
                            onChange={(e) => setFormData({ ...formData, fssaiNumber: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[#0F172A] ml-1 mb-4">GST Number (Optional)</label>
                          <input
                            type="text"
                            placeholder="22AAAAA0000A1Z5"
                            className={`w-full px-5 py-4 rounded-full ${contactUsInputBorder}`}
                            value={formData.gstNumber}
                            onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Delivery & Availability */}
                    <div>
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-[#FFF5F5] flex items-center justify-center">
                          <Truck className="w-5 h-5" style={{ color: "#BA2121" }} />
                        </div>
                        <h3 className="text-lg font-semibold  text-[#0F172A]">Delivery & Availability</h3>
                      </div>
                      <div className="mb-8">
                        <label className="block text-base text-[#0F172A] ml-1 mb-4">Preferred Delivery Method</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <button
                            onClick={() => setFormData({ ...formData, deliveryMethod: "self" })}
                            className={`relative p-7 rounded-[2rem] border-2 transition-all flex flex-col items-start gap-4 text-left ${formData.deliveryMethod === "self"
                              ? "border-[#BA2121] bg-[#BA2121]/5 shadow-md shadow-[#BA2121]/5"
                              : "border-slate-100 bg-white hover:border-slate-200"
                              }`}
                          >
                            <div className="absolute top-6 right-6">
                              {formData.deliveryMethod === "self" ? (
                                <Image src="/select.svg" alt="Selected" width={24} height={24} />
                              ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
                              )}
                            </div>

                            <Image src="/self-delivery.svg" alt="Self Delivery" width={32} height={32} />

                            <div className="space-y-1">
                              <div className="font-semibold text-lg text-[#0F172A]">Self Delivery</div>
                              <p className="text-xs text-slate-500 leading-relaxed">I have my own riders/staff for delivery</p>
                            </div>
                          </button>

                          <button
                            onClick={() => setFormData({ ...formData, deliveryMethod: "freshbhoj" })}
                            className={`relative p-7 rounded-[2rem] border-2 transition-all flex flex-col items-start gap-4 text-left ${formData.deliveryMethod === "freshbhoj"
                              ? "border-[#BA2121] bg-[#BA2121]/5 shadow-md shadow-[#BA2121]/5"
                              : "border-slate-100 bg-white hover:border-slate-200"
                              }`}
                          >
                            <div className="absolute top-6 right-6">
                              {formData.deliveryMethod === "freshbhoj" ? (
                                <Image src="/select.svg" alt="Selected" width={24} height={24} />
                              ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
                              )}
                            </div>

                            <Image src="/freshbhoj-logistics.svg" alt="FreshBhoj Logistics" width={32} height={32} />

                            <div className="space-y-1">
                              <div className="font-semibold text-lg text-[#0F172A]">FreshBhoj Logistics</div>
                              <p className="text-xs text-slate-500 leading-relaxed">Use our partner delivery network</p>
                            </div>
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-base text-[#0F172A] ml-1 mb-4">Service Timings</label>
                        <div className="flex flex-wrap gap-4">
                          {serviceTimings.map((time) => {
                            const label = time.split(' ')[0];
                            const isSelected = formData.timings.includes(label);
                            return (
                              <button
                                key={time}
                                onClick={() => {
                                  const newTimings = isSelected
                                    ? formData.timings.filter(t => t !== label)
                                    : [...formData.timings, label];
                                  setFormData({ ...formData, timings: newTimings });
                                }}
                                className={`px-6 py-3 rounded-full font-semibold  text-sm border-2 transition-all flex items-center gap-3 ${isSelected
                                  ? "border-[#BA2121] bg-[#FFF5F5]"
                                  : "border-slate-100 text-slate-500 hover:border-slate-200"
                                  }`}
                                style={isSelected ? gradientText : {}}
                              >
                                {isSelected ? (
                                  <Image src="/select.svg" alt="Selected" width={16} height={16} className="flex-shrink-0" />
                                ) : (
                                  <div className="w-4 h-4 rounded-full border border-slate-300 flex-shrink-0" />
                                )}
                                {time}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* FreshBhoj Advantage */}
                    <div className="space-y-8">
                      <div className="flex items-center gap-4">
                        <div className="w-1.5 h-8 bg-[#BA2121] rounded-full"></div>
                        <h3 className="text-2xl font-semibold text-[#0F172A]">The FreshBhoj Advantage</h3>
                      </div>

                      <div className="bg-[#BA2121]/[0.03] border border-[#BA2121]/10 rounded-[2rem] p-6 md:p-8 space-y-6">
                        <div className="flex flex-col md:flex-row gap-5">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-[#BA2121]/5">
                            <Image src="/camera.svg" alt="Camera" width={24} height={24} />
                          </div>
                          <div className="space-y-1">
                            <div className="text-lg font-semibold text-[#0F172A]">Visual Storytelling</div>
                            <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                              We showcase kitchens through professional reels and videos. Are you interested in a free photoshoot session?
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <button
                            onClick={() => setFormData({ ...formData, visualStorytelling: "yes" })}
                            className={`py-4 rounded-2xl font-semibold text-base transition-all duration-300 shadow-md hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 ${formData.visualStorytelling === "yes"
                              ? "text-white"
                              : "bg-white text-slate-500 border border-slate-100"
                              }`}
                            style={formData.visualStorytelling === "yes" ? gradientBg : {}}
                          >
                            {formData.visualStorytelling === "yes" && <Image src="/select.svg" alt="Selected" width={18} height={18} />}
                            Yes, definitely!
                          </button>
                          <button
                            onClick={() => setFormData({ ...formData, visualStorytelling: "no" })}
                            className={`py-4 rounded-2xl font-semibold text-base transition-all duration-300 border flex items-center justify-center gap-3 ${formData.visualStorytelling === "no"
                              ? "bg-[#FFF5F5] text-[#BA2121] border-[#BA2121]/30 shadow-sm"
                              : "bg-white text-slate-500 border-slate-100 hover:border-slate-200"
                              }`}
                          >
                            {formData.visualStorytelling === "no" && <Image src="/select.svg" alt="Selected" width={18} height={18} />}
                            Maybe later
                          </button>
                        </div>
                      </div>

                      <div className="mt-12">
                        <label className="block text-base font-semibold text-[#0F172A] ml-1 mb-6">Why do you want to join FreshBhoj?</label>
                        <textarea
                          rows={4}
                          placeholder="Tell us about your culinary journey and your vision for your kitchen..."
                          className={`w-full px-6 py-6 rounded-[2rem] ${contactUsInputBorder} resize-none`}
                          value={formData.whyJoin}
                          onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Step 2 Buttons */}
                    <div className="pt-8 border-t border-slate-50 space-y-4">
                      {err && (
                        <p className="text-sm text-red-500 font-semibold bg-red-50 py-3 px-4 rounded-xl text-center">
                          {err}
                        </p>
                      )}
                      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-8">
                        <button
                          onClick={prevStep}
                          disabled={isSubmitting}
                          className="w-full md:w-auto flex items-center justify-center md:justify-start gap-2 text-slate-500 font-semibold text-sm hover:text-[#0F172A] transition-colors whitespace-nowrap py-3 md:py-0 rounded-2xl md:rounded-none bg-slate-50 md:bg-transparent border border-slate-200/70 md:border-0"
                        >
                          <ChevronLeft className="w-5 h-5" /> Back to Step 1
                        </button>
                        <button
                          onClick={handleKitchenSubmit}
                          disabled={isSubmitting || !isKitchenStep2Valid}
                          className={`w-full md:flex-1 py-4 md:py-5 rounded-3xl text-white font-semibold text-lg md:text-xl shadow-[0_15px_30px_-5px_rgba(186,33,33,0.3)] transition-all flex items-center justify-center gap-2 md:gap-3 ${isSubmitting || !isKitchenStep2Valid ? "opacity-50 cursor-not-allowed bg-slate-300 shadow-none scale-100" : "hover:scale-[1.02] active:scale-95"}`}
                          style={!isSubmitting && isKitchenStep2Valid ? gradientBg : {}}
                        >
                          {isSubmitting ? (
                            <>Submitting... <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /></>
                          ) : (
                            <>Submit for Verification <CheckCircle2 className="w-5 md:w-6 h-5 md:h-6" /></>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Benefit Mini Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: "/early-access.svg",
                  title: "Early Access",
                  desc: "Be the first to know when we launch in your area."
                },
                {
                  icon: "/zero-commision.svg",
                  title: "Zero Commission",
                  desc: "First 100 kitchens enjoy 3 months of 0% commission fees."
                },
                {
                  icon: "/community-growth.svg",
                  title: "Community Growth",
                  desc: "Join a network of 5000+ home chefs and foodies."
                }
              ].map((card) => (
                <div key={card.title} className="bg-white/90 backdrop-blur p-8 rounded-[2rem] border border-slate-200/70 shadow-[0_18px_40px_-20px_rgba(15,23,42,0.22)] flex flex-col items-center text-center group hover:bg-white transition-all duration-500 hover:-translate-y-1">
                  <Image src={card.icon} alt={card.title} width={34} height={34} />

                  <h4 className="font-semibold text-lg text-[#0F172A] mb-2">{card.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
