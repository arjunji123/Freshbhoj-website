"use client";

import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";

export interface LatLng {
  latitude: number;
  longitude: number;
}

interface MapPickerProps {
  latitude: number;
  longitude: number;
  onMoveEnd: (coords: LatLng) => void;
  zoom?: number;
  className?: string;
}

/**
 * "Pin drop" pattern: the pin is a fixed overlay at the exact center of the
 * viewport, and it's the *map* that moves underneath it — so we never need a
 * draggable Leaflet marker (and its icon-asset path headaches under Next.js).
 * We just read the map's center once a drag/zoom settles.
 */
function CenterTracker({ onMoveEnd }: { onMoveEnd: (coords: LatLng) => void }) {
  useMapEvents({
    moveend: (event) => {
      const center = event.target.getCenter();
      onMoveEnd({ latitude: center.lat, longitude: center.lng });
    },
  });
  return null;
}

/**
 * Client-only by construction (Leaflet touches `window` on import) — always
 * load this via `next/dynamic` with `ssr: false` from the caller.
 */
export default function MapPicker({ latitude, longitude, onMoveEnd, zoom = 16, className }: MapPickerProps) {
  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-200 ${className ?? ""}`}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={zoom}
        scrollWheelZoom
        style={{ height: "260px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CenterTracker onMoveEnd={onMoveEnd} />
      </MapContainer>

      {/* Fixed center pin, overlaid above the tiles/controls */}
      <div className="pointer-events-none absolute inset-0 z-[1000] flex items-center justify-center">
        <MapPin
          size={36}
          className="-translate-y-1/2 text-[#BA2121] drop-shadow-md"
          fill="#FF6B6B"
          fillOpacity={0.25}
          strokeWidth={2.4}
        />
      </div>
    </div>
  );
}
