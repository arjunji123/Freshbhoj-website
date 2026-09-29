"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { onboardingApi } from "../../../../lib/kitchenApi";
import { Button, Field, RangeSlider, TextInput } from "../../components/ui";
import { useStepForm } from "./useStepForm";
import type { LatLng } from "../../components/MapPicker";

// Leaflet touches `window` at import time — must stay client-only.
const MapPicker = dynamic(() => import("../../components/MapPicker"), {
  ssr: false,
  loading: () => <div className="h-[260px] rounded-2xl bg-slate-100 animate-pulse" />,
});

const DEFAULT_LATITUDE = 26.9124;
const DEFAULT_LONGITUDE = 75.7873;
const REVERSE_GEOCODE_DEBOUNCE_MS = 600;

interface NominatimAddress {
  road?: string;
  house_number?: string;
  suburb?: string;
  neighbourhood?: string;
  quarter?: string;
  village?: string;
  town?: string;
  city?: string;
  city_district?: string;
  county?: string;
  state?: string;
  postcode?: string;
}

async function reverseGeocode(lat: number, lon: number): Promise<NominatimAddress | null> {
  const params = new URLSearchParams({
    format: "jsonv2",
    lat: String(lat),
    lon: String(lon),
    addressdetails: "1",
    zoom: "18",
  });
  // Nominatim's usage policy wants a way to identify the caller. Browsers
  // block scripts from overriding the User-Agent header, so the best we can
  // do client-side is keep request volume low (debounced, drag-end only)
  // and rely on the Referer the browser sends automatically.
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
    headers: { "Accept-Language": "en-IN,en" },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.address ?? null;
}

export function LocationForm({ onSaved }: { onSaved: () => Promise<void> }) {
  const [addressLine, setAddressLine] = useState("");
  const [locality, setLocality] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [latitude, setLatitude] = useState(DEFAULT_LATITUDE);
  const [longitude, setLongitude] = useState(DEFAULT_LONGITUDE);
  const [serviceRadiusKm, setServiceRadiusKm] = useState(5);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const geocodeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { error, isSaving, submit } = useStepForm(
    () =>
      onboardingApi.location({
        addressLine: addressLine.trim(),
        locality: locality.trim(),
        city: city.trim() || undefined,
        state: state.trim() || undefined,
        pincode: pincode.trim(),
        latitude,
        longitude,
        serviceRadiusKm,
      }),
    onSaved,
  );

  const runReverseGeocode = useCallback(async (lat: number, lon: number) => {
    setIsGeocoding(true);
    try {
      const address = await reverseGeocode(lat, lon);
      if (!address) return;
      const line = [address.house_number, address.road].filter(Boolean).join(" ");
      if (line) setAddressLine(line);
      const localityGuess = address.suburb ?? address.neighbourhood ?? address.quarter ?? address.village;
      if (localityGuess) setLocality(localityGuess);
      const cityGuess = address.city ?? address.town ?? address.city_district ?? address.county;
      if (cityGuess) setCity(cityGuess);
      if (address.state) setState(address.state);
      if (address.postcode) setPincode(address.postcode.replace(/\D/g, "").slice(0, 6));
    } catch {
      // Best-effort prefill — the fields stay editable either way.
    } finally {
      setIsGeocoding(false);
    }
  }, []);

  const handleMapMoveEnd = useCallback(
    ({ latitude: lat, longitude: lon }: LatLng) => {
      setLatitude(lat);
      setLongitude(lon);
      if (geocodeTimeout.current) clearTimeout(geocodeTimeout.current);
      geocodeTimeout.current = setTimeout(() => {
        void runReverseGeocode(lat, lon);
      }, REVERSE_GEOCODE_DEBOUNCE_MS);
    },
    [runReverseGeocode],
  );

  const isValid = addressLine.trim().length >= 5 && locality.trim().length > 0 && /^\d{6}$/.test(pincode);

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-extrabold text-slate-900">Where should customers find you?</h2>

      <Field label="Pin your kitchen on the map">
        <MapPicker latitude={DEFAULT_LATITUDE} longitude={DEFAULT_LONGITUDE} onMoveEnd={handleMapMoveEnd} />
      </Field>
      <p className="text-xs text-slate-400 -mt-3">
        {isGeocoding ? "Looking up address…" : "Drag the map so the pin marks your kitchen — we'll prefill the address below, and you can always correct it."}
      </p>

      <Field label="Address line">
        <TextInput value={addressLine} onChange={(e) => setAddressLine(e.target.value)} placeholder="Shop 4, Malviya Nagar Market" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Locality">
          <TextInput value={locality} onChange={(e) => setLocality(e.target.value)} placeholder="Malviya Nagar" />
        </Field>
        <Field label="Pincode">
          <TextInput value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="302017" inputMode="numeric" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="City">
          <TextInput value={city} onChange={(e) => setCity(e.target.value)} placeholder="Jaipur" />
        </Field>
        <Field label="State">
          <TextInput value={state} onChange={(e) => setState(e.target.value)} placeholder="Rajasthan" />
        </Field>
      </div>

      <RangeSlider
        label={`Service radius — ${serviceRadiusKm} km`}
        min={1}
        max={40}
        step={1}
        value={serviceRadiusKm}
        onChange={setServiceRadiusKm}
        minLabel="1 km"
        maxLabel="40 km"
      />

      {error ? <p className="text-xs font-semibold text-red-600">{error}</p> : null}
      <Button onClick={submit} disabled={!isValid} loading={isSaving}>
        Continue
      </Button>
    </div>
  );
}
