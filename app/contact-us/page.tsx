"use client";

import { useState } from "react";
import Image from "next/image";
import Script from "next/script";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Check,
  ChevronDown,
  MessageSquare,
  Instagram,
  Facebook,
  Linkedin,
  Users,
  Twitter,
  ChevronRight
} from "lucide-react";
import { Navbar, Footer } from "../Components";

declare global {
  interface Window {
    Calendly: any;
  }
}

const gradientText = {
  background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  backgroundClip: "text" as const,
};

const gradientBg = {
  background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
};

export default function ContactUs() {
  const [qrLoaded, setQrLoaded] = useState(false);
  const [msgSubmitted, setMsgSubmitted] = useState(false);
  const [msgData, setMsgData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    agreed: false
  });

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans overflow-x-hidden">
      <Navbar />

      {/* Calendly Integration Assets */}
      <link
        href="https://assets.calendly.com/assets/external/widget.css"
        rel="stylesheet"
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-20 pt-32 md:pt-32 flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center max-w-4xl mb-16 px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-[#0F172A] leading-[1.1] mb-6 tracking-tight">
            Let&apos;s Build India&apos;s Food <br />
            <span style={gradientText}>Infrastructure Together</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-full mx-auto leading-relaxed">
            Scaling the next generation of supply chain excellence for 1.4 billion people.
          </p>
        </div>

        {/* Premium Meeting Card - Click to Flow */}
        <div className="w-full max-w-5xl bg-white rounded-[2.5rem] p-8 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-50 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 relative overflow-hidden mb-20">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#BA2121] opacity-[0.03] blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />

          {/* Left Content */}
          <div className="flex-1 flex flex-col items-start text-left z-10">

            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] mb-6 leading-tight">
              30-Minute <br />
              <span style={gradientText}>Founders Discovery</span>
            </h2>
            <p className="text-slate-500 text-base md:text-lg mb-10 leading-relaxed font-medium max-w-md">
              Ready to dive deeper? Schedule a direct follow-up session with our founding team to discuss roadmap, financials, and unit economics.
            </p>

            <button
              onClick={() => {
                if (window.Calendly) {
                  window.Calendly.initPopupWidget({ url: 'https://calendly.com/singhnarukaarjun/30min' });
                } else {
                  window.open('https://calendly.com/singhnarukaarjun/30min', '_blank');
                }
              }}
              className="group flex items-center gap-3 px-6 md:px-10 py-5 rounded-2xl text-white text-lg md:text-xl transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(186,33,33,0.2)] cursor-pointer whitespace-nowrap"
              style={gradientBg}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 animate-bounce-slow flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Book via Calendly →</span>
            </button>
          </div>          {/* Right Visual (Interactive QR Code) */}
          <div className="relative z-10 lg:w-[40%] flex justify-center">
            <div
              onClick={() => window.Calendly?.initPopupWidget({ url: 'https://calendly.com/singhnarukaarjun/30min' })}
              className="bg-white p-6 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.12)] rotate-3 hover:rotate-0 transition-all duration-700 cursor-pointer group flex flex-col items-center"
            >
              <div className={`relative w-64 md:w-72 aspect-square overflow-hidden rounded-[1.5rem] bg-white flex items-center justify-center p-8 transition-opacity duration-700 ${qrLoaded ? 'opacity-100' : 'opacity-0'}`}>
                {/* Gradient Container */}
                <div
                  className="absolute inset-8"
                  style={{
                    background: "linear-gradient(169.21deg, #FF6B6B 9%, #BA2121 77%, #670000 100%)",
                  }}
                />

                {/* Real Functional QR Code Overlay with Screen Blend Mode */}
                <Image
                  src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://calendly.com/singhnarukaarjun/30min&margin=10"
                  alt="Calendly QR"
                  width={300}
                  height={300}
                  className="relative z-10 w-full h-full object-contain mix-blend-screen"
                  unoptimized
                  onLoadingComplete={() => setQrLoaded(true)}
                />

                {/* Hover Effect Light Overlay */}
                <div className="absolute inset-0 bg-[#BA2121] opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-[1.5rem] z-20" />
              </div>

              {/* FreshBhoj Logo & Action Text */}
              <div className="mt-8 flex flex-col items-center w-full">
                <div className="w-32 h-10 relative mb-3 transition-transform duration-500 group-hover:scale-110">
                  <Image src="/freshbhoj-red-new.svg" alt="FreshBhoj" fill className="object-contain" />
                </div>
                <div className="flex items-center gap-3 w-full max-w-[200px]">
                  <div className="h-px flex-1 bg-slate-100" />
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">Scan to Schedule</p>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>
              </div>
            </div>
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-[#FF6B6B]/10 to-[#BA2121]/5 blur-[60px] -z-10" />
          </div>
        </div>
        {/* Combined Contact & Message Section */}
        <div className="w-full max-w-6xl flex flex-col lg:grid lg:grid-cols-2 gap-16 md:gap-24 mb-20 animate-in fade-in duration-1000 px-4">

          {/* Left Column: Get in Touch */}
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-10">Get in Touch</h2>

            <div className="space-y-6 mb-12">
              {/* Email Card */}
              <div className="bg-white border border-slate-100 rounded-[2rem] p-6 flex items-center gap-6 shadow-sm hover:shadow-md transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF5F5] relative flex items-center justify-center flex-shrink-0 overflow-hidden transition-all group-hover:scale-105 shadow-inner">
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={gradientBg}
                  />
                  <Mail className="w-6 h-6 text-[#BA2121] transition-colors group-hover:text-white relative z-10" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#0F172A]">Email Us</span>
                  <a href="mailto:hello@freshbhoj.com" className="text-slate-500 text-sm hover:text-[#BA2121] transition-colors">hello@freshbhoj.com</a>
                  <p className="text-[11px] text-slate-400 mt-1">Expected reply: 2-4 hours</p>
                </div>
              </div>

              {/* LinkedIn Card */}
              <div className="bg-white border border-slate-100 rounded-[2rem] p-6 flex items-center gap-6 shadow-sm hover:shadow-md transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF5F5] relative flex items-center justify-center flex-shrink-0 overflow-hidden transition-all group-hover:scale-105 shadow-inner">
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={gradientBg}
                  />
                  <Linkedin className="w-6 h-6 text-[#BA2121] transition-colors group-hover:text-white relative z-10" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#0F172A]">LinkedIn</span>
                  <a href="https://www.linkedin.com/in/arjun-singh-naruka/" target="_blank" rel="noopener noreferrer" className="text-slate-500 text-sm hover:text-[#BA2121] transition-colors">Arjun Singh Naruka</a>
                  <p className="text-[11px] text-slate-400 mt-1">Connect for Partnerships</p>
                </div>
              </div>

              {/* WhatsApp Card */}
              <div className="bg-white border border-slate-100 rounded-[2rem] p-6 flex items-center gap-6 shadow-sm hover:shadow-md transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF5F5] relative flex items-center justify-center flex-shrink-0 overflow-hidden transition-all group-hover:scale-105 shadow-inner">
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={gradientBg}
                  />
                  <div className="relative w-6 h-6 transition-all group-hover:brightness-0 group-hover:invert text-[#BA2121] z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#0F172A]">WhatsApp/Call</span>
                  <a href="https://wa.me/918058318556" target="_blank" rel="noopener noreferrer" className="text-slate-500 text-sm hover:text-[#BA2121] transition-colors">+91 80583 18556</a>
                  <p className="text-[11px] text-slate-400 mt-1">Mon - Sat: 9am - 7pm</p>
                </div>
              </div>
            </div>

            {/* Social Follow */}
            <div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-8">Follow Our Journey</h3>
              <div className="flex gap-5 px-1">
                {[
                  { icon: <Instagram className="w-5 h-5" />, href: "#" },
                  { icon: <Facebook className="w-5 h-5" />, href: "#" },
                  { icon: <Twitter className="w-5 h-5" />, href: "#" },
                  { icon: <Linkedin className="w-5 h-5" />, href: "#" }
                ].map((social, i) => (
                  <a 
                    key={i} 
                    href={social.href} 
                    className="relative w-12 h-12 rounded-full flex items-center justify-center bg-white border border-slate-100 text-[#BA2121] shadow-sm transition-all duration-500 overflow-hidden group/social"
                  >
                    {/* Gradient Hover Layer */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover/social:opacity-100 transition-all duration-500 transform scale-0 group-hover/social:scale-100"
                      style={gradientBg}
                    />
                    <div className="relative z-10 transition-all duration-500 group-hover/social:text-white group-hover/social:scale-110">
                      {social.icon}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Send us a Message Form (Moved to order-1 on mobile, order-2 on desktop) */}
          <div className="relative order-1 lg:order-2">
            {msgSubmitted ? (
              <div className="bg-white rounded-[2.5rem] p-12 shadow-xl border border-slate-50 text-center h-full flex flex-col items-center justify-center min-h-[500px] animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-[#FFF5F5] rounded-[2rem] flex items-center justify-center mb-8 shadow-sm">
                  <Send className="w-10 h-10 text-[#BA2121]" />
                </div>
                <h3 className="text-3xl font-bold text-[#0F172A] mb-4">Message Sent!</h3>
                <p className="text-slate-500 mb-10 max-w-xs">We&apos;ve received your message and will get back to you shortly.</p>
                <button
                  onClick={() => setMsgSubmitted(false)}
                  className="px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105"
                  style={gradientBg}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-xl border border-slate-50 relative overflow-hidden">
                <h2 className="text-3xl font-bold text-[#0F172A] mb-10">Send us a Message</h2>

                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setMsgSubmitted(true); }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-widest mb-3 ml-1">Your Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        required
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 focus:bg-white focus:border-[#BA2121]/20 focus:ring-4 focus:ring-[#BA2121]/5 outline-none transition-all placeholder:text-slate-300"
                        value={msgData.name}
                        onChange={(e) => setMsgData({ ...msgData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-widest mb-3 ml-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        required
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 focus:bg-white focus:border-[#BA2121]/20 focus:ring-4 focus:ring-[#BA2121]/5 outline-none transition-all placeholder:text-slate-300"
                        value={msgData.email}
                        onChange={(e) => setMsgData({ ...msgData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-widest mb-3 ml-1">Subject</label>
                    <div className="relative">
                      <select
                        required
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[#BA2121]/20 focus:ring-4 focus:ring-[#BA2121]/5 outline-none transition-all appearance-none text-slate-600"
                        value={msgData.subject}
                        onChange={(e) => setMsgData({ ...msgData, subject: e.target.value })}
                      >
                        <option value="">Select an option</option>
                        <option value="partnership">Partnership Inquiry</option>
                        <option value="kitchen">Kitchen Onboarding</option>
                        <option value="support">Customer Support</option>
                        <option value="other">Other</option>
                      </select>
                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-widest mb-3 ml-1">Message</label>
                    <textarea
                      placeholder="Tell us how we can help..."
                      required
                      rows={5}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 focus:bg-white focus:border-[#BA2121]/20 focus:ring-4 focus:ring-[#BA2121]/5 outline-none transition-all resize-none placeholder:text-slate-300"
                      value={msgData.message}
                      onChange={(e) => setMsgData({ ...msgData, message: e.target.value })}
                    />
                  </div>

                  <button 
                    type="button"
                    className="flex items-start gap-4 py-3 text-left group/check mb-4 w-full" 
                    onClick={() => setMsgData({ ...msgData, agreed: !msgData.agreed })}
                  >
                    <div 
                      className={`mt-1 w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-500 relative overflow-hidden ${
                        msgData.agreed 
                        ? 'border-transparent shadow-lg shadow-[#BA2121]/20' 
                        : 'border-slate-200 bg-slate-50 group-hover/check:border-[#BA2121]/50'
                      }`}
                    >
                      {/* Perfect Internal Gradient Circle */}
                      <div 
                        className={`absolute inset-0 rounded-full transition-opacity duration-500 ${
                          msgData.agreed ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={gradientBg}
                      />
                      
                      <Check 
                        className={`relative z-10 w-3.5 h-3.5 text-white transition-all duration-500 ${
                          msgData.agreed ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                        }`} 
                        strokeWidth={4} 
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] text-slate-500 leading-relaxed font-medium select-none">
                        I agree to the <Link href="/privacy-policy" className="text-[#BA2121] font-bold hover:underline" onClick={(e) => e.stopPropagation()}>Privacy Policy</Link> and allow FreshBhoj to contact me regarding this inquiry.
                      </p>
                    </div>
                  </button>

                  <button
                    type="submit"
                    className="w-full py-5 rounded-2xl text-white font-bold text-lg shadow-[0_20px_40px_-10px_rgba(186,33,33,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                    style={gradientBg}
                  >
                    Send Message <Send className="w-5 h-5" />
                  </button>


                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
