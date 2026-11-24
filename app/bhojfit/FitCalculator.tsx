"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Droplets, Flame, Beef, Wheat, Droplet } from "lucide-react";

type Sex = "male" | "female";
type Goal = "muscle" | "fat" | "balanced";

const GOALS: { id: Goal; label: string; hint: string; kcalAdj: number; protein: number }[] = [
  { id: "muscle", label: "Muscle gain", hint: "+10% calories, 2.0 g/kg protein", kcalAdj: 1.1, protein: 2.0 },
  { id: "fat", label: "Fat loss", hint: "-20% calories, 2.2 g/kg protein", kcalAdj: 0.8, protein: 2.2 },
  { id: "balanced", label: "Stay balanced", hint: "Maintenance, 1.6 g/kg protein", kcalAdj: 1, protein: 1.6 },
];

const ACTIVITY = [
  { id: "light", label: "Lightly active (1-3 sessions a week)", factor: 1.375 },
  { id: "moderate", label: "Moderately active (3-5 sessions a week)", factor: 1.55 },
  { id: "very", label: "Very active (6-7 sessions a week)", factor: 1.725 },
  { id: "desk", label: "Mostly seated, little training", factor: 1.2 },
] as const;

const fieldCls =
  "w-full h-12 rounded-2xl bg-white border border-slate-200 px-4 text-base font-semibold text-[#0D1B1E] outline-none transition focus:border-[#12865F] focus:ring-4 focus:ring-[#12865F]/10";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">{label}</span>
      {children}
    </label>
  );
}

export default function FitCalculator() {
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("172");
  const [age, setAge] = useState("26");
  const [sex, setSex] = useState<Sex>("male");
  const [activity, setActivity] = useState<(typeof ACTIVITY)[number]["id"]>("moderate");
  const [goal, setGoal] = useState<Goal>("muscle");

  const result = useMemo(() => {
    const w = Number(weight), h = Number(height), a = Number(age);
    if (!(w >= 30 && w <= 250 && h >= 120 && h <= 230 && a >= 14 && a <= 90)) return null;
    const g = GOALS.find((x) => x.id === goal)!;
    const act = ACTIVITY.find((x) => x.id === activity)!;
    // Mifflin-St Jeor
    const bmr = 10 * w + 6.25 * h - 5 * a + (sex === "male" ? 5 : -161);
    const floor = sex === "male" ? 1500 : 1200;
    const kcal = Math.max(floor, Math.round((bmr * act.factor * g.kcalAdj) / 10) * 10);
    const protein = Math.round(w * g.protein);
    const fat = Math.round((kcal * 0.25) / 9);
    const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));
    const water = Math.round((w * 35) / 100) / 10; // litres
    return { kcal, protein, fat, carbs, water };
  }, [weight, height, age, sex, activity, goal]);

  const pShare = result ? Math.round(((result.protein * 4) / result.kcal) * 100) : 0;
  const cShare = result ? Math.round(((result.carbs * 4) / result.kcal) * 100) : 0;
  const fShare = result ? Math.max(0, 100 - pShare - cShare) : 0;

  return (
    <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6 lg:gap-8">
      <div className="rounded-[2rem] bg-[#F3F8F8] border border-[#12865F]/10 p-6 lg:p-9">
        <fieldset className="mb-6">
          <legend className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Your goal</legend>
          <div className="grid sm:grid-cols-3 gap-2.5">
            {GOALS.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGoal(g.id)}
                aria-pressed={goal === g.id}
                className={`text-left rounded-2xl border-2 px-4 py-3 transition-all ${
                  goal === g.id ? "border-[#12865F] bg-white shadow-[0_12px_30px_-16px_rgba(18, 134, 95,0.7)]" : "border-transparent bg-white/70 hover:bg-white"
                }`}
              >
                <span className="block font-extrabold text-[#0D1B1E] text-sm">{g.label}</span>
                <span className="block text-[11px] text-slate-500 leading-snug mt-0.5">{g.hint}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
          <Field label="Weight (kg)">
            <input className={fieldCls} type="number" inputMode="decimal" min={30} max={250} value={weight} onChange={(e) => setWeight(e.target.value)} />
          </Field>
          <Field label="Height (cm)">
            <input className={fieldCls} type="number" inputMode="decimal" min={120} max={230} value={height} onChange={(e) => setHeight(e.target.value)} />
          </Field>
          <Field label="Age">
            <input className={fieldCls} type="number" inputMode="numeric" min={14} max={90} value={age} onChange={(e) => setAge(e.target.value)} />
          </Field>
        </div>

        <div className="grid sm:grid-cols-[1fr_2fr] gap-4">
          <Field label="Sex">
            <select className={fieldCls} value={sex} onChange={(e) => setSex(e.target.value as Sex)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </Field>
          <Field label="Activity">
            <select className={fieldCls} value={activity} onChange={(e) => setActivity(e.target.value as typeof activity)}>
              {ACTIVITY.map((a) => (
                <option key={a.id} value={a.id}>{a.label}</option>
              ))}
            </select>
          </Field>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed mt-6">
          An estimate using the Mifflin-St Jeor formula, meant as a starting point and not medical advice. The app uses the same maths and lets you adjust your target any time.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[2rem] bg-[#0D1B1E] text-white p-6 lg:p-9 flex flex-col">
        <div className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-[#12865F]/50 blur-3xl" />

        {result ? (
          <div className="relative flex flex-col flex-1" aria-live="polite">
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="rounded-2xl bg-white/[0.07] border border-white/10 p-4">
                <Flame size={18} className="text-[#FFC21A] mb-2" />
                <p className="text-4xl lg:text-5xl font-extrabold leading-none">{result.kcal.toLocaleString("en-IN")}</p>
                <p className="text-xs text-white/60 font-semibold mt-1.5">kcal per day</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-[#2BBE82]/40 to-[#0C4A38]/40 border border-white/15 p-4">
                <Beef size={18} className="text-[#5EE6D0] mb-2" />
                <p className="text-4xl lg:text-5xl font-extrabold leading-none">{result.protein}<span className="text-xl">g</span></p>
                <p className="text-xs text-white/70 font-semibold mt-1.5">protein per day</p>
              </div>
            </div>

            <div className="h-3 rounded-full overflow-hidden flex bg-white/10 mb-3" role="img" aria-label={`Calories from protein ${pShare} percent, carbs ${cShare} percent, fat ${fShare} percent`}>
              <span style={{ width: `${pShare}%` }} className="bg-[#5EE6D0]" />
              <span style={{ width: `${cShare}%` }} className="bg-[#FFC21A]" />
              <span style={{ width: `${fShare}%` }} className="bg-[#2BBE82]/60" />
            </div>
            <ul className="grid grid-cols-3 gap-2 text-center mb-5">
              {[
                { icon: Beef, label: "Protein", v: result.protein, dot: "bg-[#5EE6D0]" },
                { icon: Wheat, label: "Carbs", v: result.carbs, dot: "bg-[#FFC21A]" },
                { icon: Droplet, label: "Fat", v: result.fat, dot: "bg-[#2BBE82]/60" },
              ].map(({ label, v, dot }) => (
                <li key={label} className="rounded-xl bg-white/[0.05] py-3">
                  <span className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/60">
                    <span className={`w-2 h-2 rounded-full ${dot}`} /> {label}
                  </span>
                  <span className="block text-xl font-extrabold mt-0.5">{v}g</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3 rounded-2xl bg-white/[0.06] border border-white/10 px-4 py-3 mb-6">
              <Droplets size={20} className="text-[#5EE6D0] shrink-0" />
              <p className="text-sm text-white/80">
                Aim for about <span className="font-extrabold text-white">{result.water} L</span> of water a day. The app tracks it for you.
              </p>
            </div>

            <Link
              href="/pre-register?type=foodie"
              className="group mt-auto inline-flex items-center justify-center gap-2 h-14 rounded-2xl bg-[#FFC21A] text-[#0D1B1E] font-extrabold text-base shadow-[0_20px_40px_-14px_rgba(255,194,26,0.6)] hover:scale-[1.02] active:scale-[0.99] transition-transform"
            >
              Get this target in the app <ArrowUpRight size={18} />
            </Link>
          </div>
        ) : (
          <p className="relative text-white/70 leading-relaxed">
            Enter a weight between 30 and 250 kg, a height between 120 and 230 cm and an age between 14 and 90 to see your target.
          </p>
        )}
      </div>
    </div>
  );
}
