import { Eye, Leaf, TrendingUp } from "lucide-react";

const POINTS = [
  { icon: Eye, title: "See it being made", text: "Short Reels show each dish in the kitchen, so there are no surprises on your plate." },
  { icon: Leaf, title: "Know what you eat", text: "Calories, protein and diet tags on every dish, before you order." },
  { icon: TrendingUp, title: "Small kitchens get seen", text: "Every kitchen grows its own audience with free Reels, never buried under paid ads." },
] as const;

/** "Why FreshBhoj": three points, one row. */
export default function ProblemFix() {
  return (
    <section id="why" className="w-full font-sans py-20 md:py-28 bg-[#F3F8F8]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-14">
          <h2 className="text-4xl md:text-6xl font-extrabold text-[#0D1B1E] leading-[1.05] tracking-tight mb-4">
            Food you can{" "}
            <span className="text-[#087F78]" style={{ fontFamily: "var(--font-instrument), Georgia, serif", fontStyle: "italic", fontWeight: 400 }}>trust.</span>
          </h2>
          <p className="text-slate-600 text-lg md:text-xl leading-relaxed">Menus and photos only tell half the story. FreshBhoj shows the rest.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {POINTS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl bg-white border border-slate-100 p-8 shadow-[0_20px_50px_-30px_rgba(8,127,120,0.35)]">
              <span className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 bg-[linear-gradient(135deg,#1DB9A0,#0B4F6C)]">
                <Icon size={26} />
              </span>
              <h3 className="text-2xl font-extrabold text-[#0D1B1E] mb-2 tracking-tight">{title}</h3>
              <p className="text-slate-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
