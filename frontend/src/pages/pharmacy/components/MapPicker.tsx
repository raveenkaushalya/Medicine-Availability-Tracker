import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

type Props = {
  onPick: (lat: number, lng: number) => void;
  initial?: { lat: number; lng: number };
};

function ClickMarker({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);

  useMapEvents({
    click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      setPos({ lat, lng });
      onPick(lat, lng);
    },
  });

  return pos ? <Marker position={[pos.lat, pos.lng]} /> : null;
}

export default function MapPicker({ onPick, initial }: Props) {
  const center: [number, number] = initial
    ? [initial.lat, initial.lng]
    : [6.9271, 79.8612]; // Colombo default

  return (
    <div style={{ height: 300, width: "100%", borderRadius: 12, overflow: "hidden" }}>
      <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickMarker onPick={onPick} />
      </MapContainer>
    </div>
  );
}
