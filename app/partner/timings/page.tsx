"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CalendarOff, Plus, Trash2 } from "lucide-react";
import { ApiError, kitchenProfileApi, operatingHoursApi } from "../../../lib/kitchenApi";
import type { DayOfWeek, HolidayOverride, OperatingHoursDay } from "../../../lib/types";
import { Badge, Button, Card, Field, PageHeader, Spinner, TextInput, Toggle } from "../components/ui";

const DAY_ORDER: DayOfWeek[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
const DAY_LABEL: Record<DayOfWeek, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

/** Both fields of a session must be set together, or neither — mirrors the backend's rule so we never send a half-pair. */
function sessionPairValid(start: string, end: string): boolean {
  return (start === "" && end === "") || (start !== "" && end !== "");
}

export default function TimingsPage() {
  const [weekly, setWeekly] = useState<OperatingHoursDay[]>([]);
  const [holidays, setHolidays] = useState<HolidayOverride[]>([]);
  const [isAcceptingOrders, setIsAcceptingOrders] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const [hoursRes, profileRes] = await Promise.all([operatingHoursApi.get(), kitchenProfileApi.get()]);
      setWeekly(hoursRes.weekly);
      setHolidays(hoursRes.holidays);
      setIsAcceptingOrders(profileRes.isAcceptingOrders);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load your operating hours, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggleAccepting = async () => {
    setIsToggling(true);
    try {
      const updated = await kitchenProfileApi.setAcceptingOrders(!isAcceptingOrders);
      setIsAcceptingOrders(updated.isAcceptingOrders);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update, please try again");
    } finally {
      setIsToggling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="w-8 h-8 text-[#087F78]" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Timings" subtitle="Your weekly hours, holidays, and emergency stop" />

      {error ? <p className="text-xs font-semibold text-red-600 mb-4">{error}</p> : null}

      {/* Emergency Close */}
      <Card className="mb-6 !bg-red-50/60 border-red-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle size={18} />
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900">Emergency close</p>
              <p className="text-xs text-slate-500 max-w-md">Stop all incoming orders immediately for today — your regular hours resume automatically tomorrow.</p>
            </div>
          </div>
          <Toggle
            checked={isAcceptingOrders}
            onChange={handleToggleAccepting}
            onLabel="Taking orders"
            offLabel="Closed"
            disabled={isToggling}
            className="bg-white rounded-2xl px-4 py-3 shrink-0 border border-red-100 text-slate-700"
          />
        </div>
      </Card>

      {/* Weekly grid */}
      <div className="flex flex-col gap-3 mb-8">
        {DAY_ORDER.map((day) => {
          const row = weekly.find((w) => w.dayOfWeek === day);
          if (!row) return null;
          return <DayRow key={day} day={day} initial={row} onSaved={(updated) => setWeekly((prev) => prev.map((w) => (w.dayOfWeek === day ? updated : w)))} />;
        })}
      </div>

      {/* Holidays */}
      <HolidaysSection holidays={holidays} setHolidays={setHolidays} />
    </div>
  );
}

function DayRow({
  day,
  initial,
  onSaved,
}: {
  day: DayOfWeek;
  initial: OperatingHoursDay;
  onSaved: (updated: OperatingHoursDay) => void;
}) {
  const [isClosed, setIsClosed] = useState(initial.isClosed);
  const [s1Start, setS1Start] = useState(initial.session1Start ?? "");
  const [s1End, setS1End] = useState(initial.session1End ?? "");
  const [s2Start, setS2Start] = useState(initial.session2Start ?? "");
  const [s2End, setS2End] = useState(initial.session2End ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const isDirty =
    isClosed !== initial.isClosed ||
    s1Start !== (initial.session1Start ?? "") ||
    s1End !== (initial.session1End ?? "") ||
    s2Start !== (initial.session2Start ?? "") ||
    s2End !== (initial.session2End ?? "");

  const session1Ok = sessionPairValid(s1Start, s1End);
  const session2Ok = sessionPairValid(s2Start, s2End);

  const handleSave = async () => {
    if (!session1Ok || !session2Ok) {
      setError("Fill in both the start and end time for a session, or clear both.");
      return;
    }
    setError(null);
    setSaved(false);
    setIsSaving(true);
    try {
      const updated = await operatingHoursApi.updateDay(day, {
        isClosed,
        session1Start: s1Start || undefined,
        session1End: s1End || undefined,
        session2Start: s2Start || undefined,
        session2End: s2End || undefined,
      });
      onSaved(updated);
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save, please try again");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="!p-4 lg:!p-5">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-1">
        <p className="text-sm font-extrabold text-slate-900 w-24 shrink-0">{DAY_LABEL[day]}</p>
        <Toggle
          checked={!isClosed}
          onChange={() => setIsClosed((v) => !v)}
          onLabel="Open"
          offLabel="Closed"
          className="ml-auto text-slate-500"
        />
      </div>

      {!isClosed ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Session 1 (e.g. Lunch)</p>
            <div className="flex items-center gap-2">
              <TextInput type="time" value={s1Start} onChange={(e) => setS1Start(e.target.value)} />
              <span className="text-slate-300 text-xs">to</span>
              <TextInput type="time" value={s1End} onChange={(e) => setS1End(e.target.value)} />
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Session 2 (e.g. Dinner)</p>
            <div className="flex items-center gap-2">
              <TextInput type="time" value={s2Start} onChange={(e) => setS2Start(e.target.value)} />
              <span className="text-slate-300 text-xs">to</span>
              <TextInput type="time" value={s2End} onChange={(e) => setS2End(e.target.value)} />
            </div>
          </div>
        </div>
      ) : null}

      {error ? <p className="text-xs font-semibold text-red-600 mt-3">{error}</p> : null}

      <div className="flex items-center gap-3 mt-3">
        <Button variant="outline" className="!py-2 !px-4 !text-xs" onClick={handleSave} loading={isSaving} disabled={!isDirty}>
          Save
        </Button>
        {saved && !isDirty ? <span className="text-xs font-semibold text-emerald-600">Saved</span> : null}
      </div>
    </Card>
  );
}

function HolidaysSection({
  holidays,
  setHolidays,
}: {
  holidays: HolidayOverride[];
  setHolidays: React.Dispatch<React.SetStateAction<HolidayOverride[]>>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState("");
  const [isClosed, setIsClosed] = useState(true);
  const [s1Start, setS1Start] = useState("");
  const [s1End, setS1End] = useState("");
  const [s2Start, setS2Start] = useState("");
  const [s2End, setS2End] = useState("");
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingDate, setDeletingDate] = useState<string | null>(null);

  const session1Ok = sessionPairValid(s1Start, s1End);
  const session2Ok = sessionPairValid(s2Start, s2End);

  const resetForm = () => {
    setDate("");
    setIsClosed(true);
    setS1Start("");
    setS1End("");
    setS2Start("");
    setS2End("");
    setNote("");
    setError(null);
  };

  const handleAdd = async () => {
    if (!date) {
      setError("Pick a date");
      return;
    }
    if (!session1Ok || !session2Ok) {
      setError("Fill in both the start and end time for a session, or clear both.");
      return;
    }
    setError(null);
    setIsSaving(true);
    try {
      const created = await operatingHoursApi.upsertHoliday({
        date,
        isClosed,
        session1Start: !isClosed ? s1Start || undefined : undefined,
        session1End: !isClosed ? s1End || undefined : undefined,
        session2Start: !isClosed ? s2Start || undefined : undefined,
        session2End: !isClosed ? s2End || undefined : undefined,
        note: note.trim() || undefined,
      });
      setHolidays((prev) => [...prev.filter((h) => h.date !== created.date), created].sort((a, b) => a.date.localeCompare(b.date)));
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save this override, please try again");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (holidayDate: string) => {
    setDeletingDate(holidayDate);
    try {
      await operatingHoursApi.removeHoliday(holidayDate);
      setHolidays((prev) => prev.filter((h) => h.date !== holidayDate));
    } catch {
      // Leave it in the list — the user can retry the delete.
    } finally {
      setDeletingDate(null);
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">Holidays &amp; overrides</h3>
          <p className="text-xs text-slate-500 mt-0.5">One-off exceptions to your regular weekly hours.</p>
        </div>
        <Button variant="outline" className="!py-2 !px-4 !text-xs" onClick={() => setShowForm((v) => !v)}>
          <Plus size={14} /> Add holiday
        </Button>
      </div>

      {showForm ? (
        <div className="rounded-2xl border border-slate-100 p-4 mb-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Date">
              <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().slice(0, 10)} />
            </Field>
            <Field label="Status">
              <div className="flex gap-2">
                <button
                  onClick={() => setIsClosed(true)}
                  className={`flex-1 rounded-xl px-3 py-3 text-xs font-bold transition-colors ${isClosed ? "bg-[#087F78] text-white" : "bg-slate-100 text-slate-500"}`}
                >
                  Closed all day
                </button>
                <button
                  onClick={() => setIsClosed(false)}
                  className={`flex-1 rounded-xl px-3 py-3 text-xs font-bold transition-colors ${!isClosed ? "bg-[#087F78] text-white" : "bg-slate-100 text-slate-500"}`}
                >
                  Custom hours
                </button>
              </div>
            </Field>
          </div>

          {!isClosed ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Session 1</p>
                <div className="flex items-center gap-2">
                  <TextInput type="time" value={s1Start} onChange={(e) => setS1Start(e.target.value)} />
                  <span className="text-slate-300 text-xs">to</span>
                  <TextInput type="time" value={s1End} onChange={(e) => setS1End(e.target.value)} />
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Session 2 (optional)</p>
                <div className="flex items-center gap-2">
                  <TextInput type="time" value={s2Start} onChange={(e) => setS2Start(e.target.value)} />
                  <span className="text-slate-300 text-xs">to</span>
                  <TextInput type="time" value={s2End} onChange={(e) => setS2End(e.target.value)} />
                </div>
              </div>
            </div>
          ) : null}

          <Field label="Note (optional)">
            <TextInput value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Closed for Diwali" />
          </Field>

          {error ? <p className="text-xs font-semibold text-red-600">{error}</p> : null}

          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => { resetForm(); setShowForm(false); }}>
              Cancel
            </Button>
            <Button onClick={handleAdd} loading={isSaving}>
              Save override
            </Button>
          </div>
        </div>
      ) : null}

      {holidays.length === 0 ? (
        <div className="flex flex-col items-center text-center py-10">
          <CalendarOff size={28} className="text-slate-300 mb-3" />
          <p className="text-sm text-slate-400">No upcoming overrides</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {holidays.map((h) => (
            <div key={h.id} className="flex items-center justify-between gap-3 border border-slate-100 rounded-xl px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-slate-800">
                    {new Date(h.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                  </p>
                  <Badge tone={h.isClosed ? "danger" : "warning"}>{h.isClosed ? "Closed" : "Custom hours"}</Badge>
                </div>
                {!h.isClosed && h.session1Start ? (
                  <p className="text-xs text-slate-500 mt-0.5">
                    {h.session1Start}–{h.session1End}
                    {h.session2Start ? `, ${h.session2Start}–${h.session2End}` : ""}
                  </p>
                ) : null}
                {h.note ? <p className="text-xs text-slate-400 mt-0.5">{h.note}</p> : null}
              </div>
              <button
                onClick={() => handleDelete(h.date)}
                disabled={deletingDate === h.date}
                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-600 flex items-center justify-center shrink-0 transition-colors disabled:opacity-50"
                aria-label="Remove"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
