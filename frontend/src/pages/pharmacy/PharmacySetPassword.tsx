import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import MapPicker from "./components/MapPicker";

export const PharmacySetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Picked (not confirmed yet)
  const [pickedLat, setPickedLat] = useState<number | null>(null);
  const [pickedLng, setPickedLng] = useState<number | null>(null);

  // ✅ Confirmed (ONLY these will be sent to backend)
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // ✅ GPS button -> sets picked only (not confirmed)
  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setMsg("Geolocation is not supported in this device.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPickedLat(pos.coords.latitude);
        setPickedLng(pos.coords.longitude);
        setMsg("📍 Location detected. Now press ✅ Confirm Location.");
      },
      () => setMsg("❌ Location permission denied. Please pin on the map."),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const confirmPickedLocation = () => {
    if (pickedLat == null || pickedLng == null) {
      setMsg("Please select a location on the map first.");
      return;
    }
    setLatitude(pickedLat);
    setLongitude(pickedLng);
    setMsg("✅ Location confirmed!");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setMsg("Token is missing in the link.");
      return;
    }

    if (newPassword.length < 6) {
      setMsg("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMsg("Passwords do not match.");
      return;
    }

    // ✅ require CONFIRMED location
    if (latitude == null || longitude == null) {
      setMsg("Please pin your location and press ✅ Confirm Location.");
      return;
    }

    try {
      setLoading(true);
      setMsg("");

      await axios.post("http://localhost:8080/api/v1/pharmacies/set-password", {
        token,
        newPassword,
        confirmPassword,
        latitude,
        longitude,
      });

      alert("✅ Password set + Location saved!");
      navigate("/");
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "Failed to set password.");
    } finally {
      setLoading(false);
    }
  };

  const confirmed = latitude != null && longitude != null;
  const canConfirm = pickedLat != null && pickedLng != null;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f4f4f4",
      }}
    >
      <form
        onSubmit={submit}
        style={{
          width: 420,
          background: "white",
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ marginBottom: 16 }}>Set Pharmacy Password</h2>

        {msg && (
          <div style={{ marginBottom: 12, color: "red", fontSize: 14 }}>
            {msg}
          </div>
        )}

        <label style={{ fontSize: 14 }}>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          required
          style={{ width: "100%", padding: 10, marginTop: 6, marginBottom: 12 }}
        />

        <label style={{ fontSize: 14 }}>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter password"
          required
          style={{ width: "100%", padding: 10, marginTop: 6, marginBottom: 12 }}
        />

        {/* GPS */}
        <button
          type="button"
          onClick={useMyLocation}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ddd",
            background: "#fff",
            cursor: "pointer",
            marginBottom: 12,
          }}
        >
          📍 Use my current location (GPS)
        </button>

        {/* Map pin */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 14, marginBottom: 8 }}>
            Pin your pharmacy location (click on map)
          </div>

          <MapPicker
            onPick={(lat, lng) => {
              setPickedLat(lat);
              setPickedLng(lng);
              setMsg("");
            }}
            // show picked marker if exists, else show confirmed marker if exists
            initial={
              pickedLat != null && pickedLng != null
                ? { lat: pickedLat, lng: pickedLng }
                : latitude != null && longitude != null
                ? { lat: latitude, lng: longitude }
                : undefined
            }
          />

          {/* Picked */}
          {pickedLat != null && pickedLng != null && (
            <div style={{ fontSize: 12, marginTop: 8, color: "#333" }}>
              Picked: {pickedLat.toFixed(6)}, {pickedLng.toFixed(6)}
            </div>
          )}

          {/* Confirm button */}
          <button
            type="button"
            disabled={!canConfirm || loading}
            onClick={confirmPickedLocation}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "none",
              background: !canConfirm ? "#bbb" : "#16a34a",
              color: "white",
              cursor: !canConfirm ? "not-allowed" : "pointer",
              marginTop: 10,
            }}
          >
            ✅ Confirm Location
          </button>

          {/* Confirmed */}
          {confirmed && (
            <div style={{ fontSize: 12, marginTop: 8, color: "#333" }}>
              Confirmed: {latitude!.toFixed(6)}, {longitude!.toFixed(6)}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !confirmed}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 8,
            border: "none",
            background: loading || !confirmed ? "#888" : "#2563eb",
            color: "white",
            cursor: loading || !confirmed ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Setting..." : confirmed ? "Set Password" : "Confirm location first"}
        </button>
      </form>
    </div>
  );
};
