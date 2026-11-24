import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Navbar from "./navbar";

const serif = { fontFamily: "var(--font-instrument), Georgia, serif", fontStyle: "italic" as const, fontWeight: 400 };

const Hero = () => (
  <section className="relative w-full overflow-hidden font-sans bg-[linear-gradient(150deg,#14ADA0_0%,#087F78_45%,#0B4F6C_100%)]">
    <div className="pointer-events-none absolute -top-40 -left-32 w-[560px] h-[560px] rounded-full bg-[#5EE6D0]/30 blur-[120px]" />
    <Navbar />

    <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-2 items-center gap-12 px-6 pt-36 pb-20 lg:pt-40 lg:pb-28">
      <div className="text-left">
        <h1 className="font-extrabold text-white text-5xl sm:text-6xl xl:text-7xl leading-[1.02] tracking-[-0.03em] mb-6">
          Watch your food being made.{" "}
          <span className="text-[#FFC21A]" style={serif}>Then order.</span>
        </h1>
        <p className="text-white/85 text-lg md:text-xl leading-relaxed max-w-lg mb-9">
          Reels, real nutrition and verified kitchens, all in one app.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            href="/pre-register?type=foodie"
            className="group inline-flex items-center justify-center gap-3 h-14 pl-8 pr-2 rounded-full bg-white text-[#0D1B1E] font-extrabold text-base shadow-[0_20px_50px_-15px_rgba(0,0,0,0.45)] hover:scale-[1.03] active:scale-95 transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Pre-register now
            <span className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-[#087F78]">
              <ArrowUpRight size={20} />
            </span>
          </Link>
          <Link
            href="/partner/login"
            className="inline-flex items-center justify-center h-14 px-8 rounded-full border border-white/50 text-white font-bold text-base hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Register your kitchen
          </Link>
        </div>
      </div>

      <div className="relative flex justify-center lg:justify-end">
        <div className="relative w-full max-w-[300px] md:max-w-[360px] aspect-[9/18.5] drop-shadow-[0_40px_40px_rgba(0,0,0,0.3)]">
          <Image src="/phone_image1.png" alt="FreshBhoj app preview" fill priority sizes="(max-width: 1024px) 360px, 400px" className="object-contain scale-[1.15]" />
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
