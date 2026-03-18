"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function FreshBhojFix() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Common styles
  const badgeClasses = "inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 font-sans font-bold text-[10px] lg:text-xs uppercase tracking-widest bg-[#C41717]/10";

  // Interactive Mouse Effect for CTA Card
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [onButton, setOnButton] = useState(false);
  const ctaCardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ctaCardRef.current) return;
    const rect = ctaCardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const getTiltStyle = () => {
    if (!hovering || !ctaCardRef.current) return {};
    const rect = ctaCardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (mousePos.y - centerY) / 25;
    const rotateY = (centerX - mousePos.x) / 25;

    return {
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: "transform 0.1s ease-out",
    };
  };

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 lg:py-28 overflow-hidden font-sans"
    >
      <div className="w-full max-w-7xl mx-auto px-6">
        {/* ── Header ── */}
        <div className={`text-center mb-16 lg:mb-24 flex flex-col items-center justify-center transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h2 className="text-4xl md:text-5xl lg:text-7xl text-[#0F172A] mb-6 font-extrabold leading-tight tracking-tight">
            The FreshBhoj Fix
          </h2>
          <p className="mx-auto text-center font-medium text-slate-500 text-base md:text-xl leading-relaxed max-w-2xl">
            Solving the $50B fragmented food market with visual discovery, creator ecosystems, and AI-driven automation.
          </p>
        </div>

        {/* ── Containers Stack ── */}
        <div className="flex flex-col gap-12 lg:gap-20 ">

          {/* Card 1: Visual-First Discovery */}
          <div
            id="visual-first"
            className={`flex flex-col lg:flex-row items-center  bg-[#F8F6F6] rounded-[2.5rem] lg:rounded-[3.5rem] p-8 lg:p-16 transition-all duration-1000 ease-out border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] group
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
          >
            <div className="w-full lg:w-[45%] flex justify-center mb-10 lg:mb-0 ">
              <div className="relative w-full max-w-[280px] lg:max-w-[320px] aspect-[9/16] drop-shadow-2xl transition-transform group-hover:scale-105 duration-500">
                <Image
                  src="/visual-first.svg"
                  alt="Visual Discovery App"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="w-full lg:w-[55%] lg:pl-16 text-center lg:text-left">
              <div className={badgeClasses}>
                <Image src="/eye.svg" alt="eye" width={14} height={14} className="w-5 h-5 object-contain" />
                <span
                  className="inline-block"
                  style={{
                    background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}
                >
                  Discovery
                </span>
              </div>
              <h3
                className="font-extrabold mb-6 text-3xl lg:text-5xl leading-tight tracking-tight inline-block"
                style={{
                  background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                THE FIX: Visual–First Discovery
              </h3>
              <p className="mb-10 text-slate-500 text-base md:text-lg lg:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0">
                Traditional apps fail the street food sector. Our immersive Reels solve choice paralysis by providing authentic, high-definition visual discovery. Users see exactly how their food is prepared.
              </p>
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                <div className="flex items-center gap-3 text-[#0F172A] text-sm lg:text-base">
                  <img src="/right.svg" alt="check" className="w-5 h-5" />
                  65% faster ordering
                </div>
                <div className="flex items-center gap-3 text-[#0F172A] text-sm lg:text-base">
                  <img src="/right.svg" alt="check" className="w-5 h-5" />
                  Trust-based browsing
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Creator-Led Growth */}
          <div
            id="creator-growth"
            className={`flex flex-col-reverse lg:flex-row items-center  bg-[#F8F6F6] rounded-[2.5rem] lg:rounded-[3.5rem] p-8 lg:p-16 transition-all duration-1000 ease-out border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] group delay-200
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
          >
            <div className="w-full lg:w-[55%] lg:pr-16 text-center lg:text-left mt-10 lg:mt-0">
              <div className={badgeClasses}>
                <Image src="/growth.svg" alt="eye" width={14} height={14} className="w-5 h-5 object-contain" />
                <span
                  className="inline-block"
                  style={{
                    background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}
                >
                  Growth
                </span>
              </div>
              <h3
                className="font-extrabold mb-6 text-3xl lg:text-5xl leading-tight tracking-tight inline-block"
                style={{
                  background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                THE FIX: Creator–Led Growth
              </h3>
              <p className="text-slate-500 text-base md:text-lg lg:text-xl leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
                We empower local vendors to transition from cooks to ‘Food Creators.’ We help them build brand equity and direct–to–consumer relationships through performance data.
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 transition-all group-hover:bg-white group-hover:shadow-lg">
                  <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Early Waitlist</span>
                  <span className="text-3xl font-extrabold text-[#0F172A]">1,000+</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 transition-all group-hover:bg-white group-hover:shadow-lg">
                  <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Target ROI</span>
                  <span
                    className="text-3xl font-extrabold inline-block"
                    style={{
                      background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text"
                    }}
                  >
                    3x Growth
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-[45%] flex justify-center">
              <div className="relative w-full max-w-[420px] aspect-[1.3/1] drop-shadow-2xl transition-transform group-hover:scale-105 duration-500">
                <Image
                  src="/creator-led.svg"
                  alt="Performance Dashboard"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Card 3: AI-Smart Subscriptions */}
          <div
            id="ai-subscriptions"
            className={`flex flex-col lg:flex-row items-center bg-[#F8F6F6] rounded-[2.5rem] lg:rounded-[3.5rem] p-8 lg:p-16 transition-all duration-1000 ease-out border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] group delay-400
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
          >
            <div className="w-full lg:w-[45%] flex justify-center mb-10 lg:mb-0">
              <div className="relative w-full max-w-[420px] aspect-[1.4/1] drop-shadow-2xl transition-transform group-hover:scale-105 duration-500">
                <Image
                  src="/tiffin-schdule.svg"
                  alt="Subscription Schedule"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="w-full lg:w-[55%] lg:pl-16 text-center lg:text-left">
              <div className={badgeClasses}>
                <Image src="/automation.svg" alt="eye" width={14} height={14} className="w-5 h-5 object-contain" />
                <span
                  className="inline-block"
                  style={{
                    background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}
                >
                  Automation
                </span>
              </div>
              <h3
                className="font-extrabold mb-6 text-3xl lg:text-5xl leading-tight tracking-tight inline-block"
                style={{
                  background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                THE FIX: AI–Smart Subscriptions
              </h3>
              <p className="text-slate-500 text-base md:text-lg lg:text-xl leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
                Say goodbye to manual meal planning. Our AI-driven subscription model automates 30-day meal plans based on individual data, dietary needs, and budget.
              </p>
              {/* <a href="#" className="inline-flex items-center gap-2 text-[#BA2121] font-bold hover:gap-4 transition-all text-base lg:text-lg uppercase tracking-widest">
                Explore AI Logic <span>→</span>
              </a> */}
            </div>
          </div>

          {/* Final CTA */}
          <div
            ref={ctaCardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => { setHovering(false); setOnButton(false); }}
            className={`relative w-full rounded-[2.5rem] lg:rounded-[3.5rem] py-16 lg:py-24 px-6 lg:px-12 text-center overflow-hidden transition-all duration-700 delay-500 bg-[#0F172A] border border-white/5 shadow-2xl group
            ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
          >
            {/* Spotlight Glow Effect - Enhanced Multi-layer Glow */}
            <div
              className={`pointer-events-none absolute inset-0 transition-opacity duration-300 z-[1] ${hovering && !onButton ? "opacity-100" : "opacity-0"}`}
              style={{
                background: `
                  radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, rgba(186, 33, 33, 0.35), transparent 70%),
                  radial-gradient(200px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 107, 107, 0.2), transparent 50%)
                `
              }}
            />

            {/* Background elements (Fixed) */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#BA2121] opacity-20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none z-0" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 opacity-10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none z-0" />

            {/* Content with high Z-index */}
            <div className="relative z-20">
              <h3 className="text-white font-extrabold mb-6 text-2xl md:text-4xl lg:text-5xl tracking-tight leading-tight">
                Ready to fuel the <br className="md:hidden" /> future of food?
              </h3>
              <p className="mx-auto mb-10 font-medium text-slate-400 text-base md:text-lg max-w-xl md:max-w-none leading-relaxed">
                Access our full data room, financial projections, and roadmap for Series A.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/contact-us"
                  onMouseEnter={() => setOnButton(true)}
                  onMouseLeave={() => setOnButton(false)}
                  className="relative z-30 inline-flex items-center justify-center px-10 py-5 text-white font-bold rounded-3xl transition-all hover:scale-110 active:scale-95"
                  style={{
                    background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
                  }}
                >
                  Request Pitch Deck
                </Link>
                <Link
                  href="/contact-us"
                  onMouseEnter={() => setOnButton(true)}
                  onMouseLeave={() => setOnButton(false)}
                  className="relative z-30 inline-flex items-center justify-center px-10 py-5 text-white font-bold rounded-3xl transition-all hover:bg-white/20 bg-[#FFFFFF]/10 border border-white/10 hover:border-white/20"
                >
                  Contact Founders
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

