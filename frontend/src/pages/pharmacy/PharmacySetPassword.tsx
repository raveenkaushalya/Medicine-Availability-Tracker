import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export const PharmacySetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

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

    try {
      setLoading(true);
      setMsg("");

      await axios.post("http://localhost:8080/api/v1/pharmacies/set-password", {
        token,
        newPassword,
      });

      alert("✅ Password set successfully!");
      navigate("/pharmacy/login"); // we will build this next
    } catch (err: any) {
      setMsg(err?.response?.data?.message || "Failed to set password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f4f4f4" }}>
      <form
        onSubmit={submit}
        style={{
          width: 380,
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
          style={{ width: "100%", padding: 10, marginTop: 6, marginBottom: 18 }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 8,
            border: "none",
            background: loading ? "#888" : "#2563eb",
            color: "white",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Setting..." : "Set Password"}
        </button>
      </form>
    </div>
  );
};
