import { motion } from "motion/react";

import { useEffect, useState } from "react";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Clock,
  Edit2,
  Save,
  Building,
  Globe,
  Telescope,
} from "lucide-react";
import { apiFetch } from "../../../utils/api";
import MapPicker from "./MapPicker";

type ProfileViewProps = {
  pharmacy: any;
  onRefresh: () => Promise<void>;
};

export function ProfileView({ pharmacy, onRefresh }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);

  // ✅ keep your profile state as a normal object (NO hooks inside)
  const [profile, setProfile] = useState<any>({
    pharmacyName: "",
    ownerName: "",
    email: "",
    website: "",
    licenseNumber: "",
    businessRegNumber: "",
    established: "",

    address: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    latitude: null,
    longitude: null,

    contactPersonName: "",
    contactPersonTitle: "",
    contactPersonPhone: "",
    pharmacyPhoneNumber: "",
    description: "",
    operatingHours: {
      weekdays: { open: "", close: "" },
      saturday: { open: "", close: "" },
      sunday: { open: "", close: "" },
    },
  });

  // ✅ useEffect must be HERE (top-level), not inside useState
  useEffect(() => {
    if (!pharmacy) return;

    setProfile((prev: any) => ({
      ...prev,
      pharmacyName:
        pharmacy.tradeName && pharmacy.tradeName.trim() !== ""
          ? pharmacy.tradeName
          : (pharmacy.legalEntityName ?? prev.pharmacyName),

      ownerName:
        pharmacy.ownerName ?? pharmacy.contactFullName ?? prev.ownerName,
      email: pharmacy.email ?? prev.email,
      licenseNumber:
        pharmacy.nmraLicense ?? pharmacy.licenseNumber ?? prev.licenseNumber,
      businessRegNumber: pharmacy.businessRegNo ?? prev.businessRegNo,
      established: pharmacy.established ?? pharmacy.estYear ?? prev.established,

      // Location
      address: pharmacy.address ?? prev.address,
      latitude: pharmacy.latitude ?? prev.latitude,
      longitude: pharmacy.longitude ?? prev.longitude,

      contactPersonName: pharmacy.contactFullName ?? prev.contactPersonName,
      contactPersonTitle: pharmacy.contactTitle ?? prev.contactPersonTitle,
      contactPersonPhone: pharmacy.contactPhone ?? prev.contactPersonPhone,
      pharmacyPhoneNumber: pharmacy.telephone ?? prev.telephone,
      description: pharmacy.aboutPharmacy ?? prev.description,

      operatingHours: (() => {
        const fallback = prev.operatingHours;
        const raw = pharmacy.openingHoursJson;
        if (!raw) return fallback;
        try {
          const obj = JSON.parse(raw);
          return {
            weekdays: obj.weekdays || { open: "", close: "" },
            saturday: obj.saturday || { open: "", close: "" },
            sunday: obj.sunday || { open: "", close: "" },
          };
        } catch {
          return fallback;
        }
      })(),
    }));
  }, [pharmacy]);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setProfile((p: any) => ({
          ...p,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
      },
      () => alert("Location permission denied. Please pin on the map."),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const handleSave = async () => {
    try {
      const openingHoursJson = JSON.stringify(profile.operatingHours);

      const res = await apiFetch("/api/v1/pharmacies/me", {
        method: "PATCH",
        body: JSON.stringify({
          contactFullName: profile.contactPersonName,
          contactTitle: profile.contactPersonTitle,
          contactPhone: profile.contactPersonPhone,
          telephone: profile.pharmacyPhoneNumber,
          openingHoursJson,
          aboutPharmacy: profile.description,
          address: profile.address,
          latitude: profile.latitude,
          longitude: profile.longitude,
        }),
      });

      console.log("PATCH OK:", res);
      await onRefresh();
      setIsEditing(false);
    } catch (e) {
      console.error("PATCH FAILED:", e);
      alert("Save failed. Check console (F12) for error.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-gray-900 text-xl sm:text-2xl">
            Pharmacy Profile
          </h2>
          <p className="text-gray-600 text-sm">
            View and manage your pharmacy information
          </p>
        </div>
        {!isEditing ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm sm:w-auto w-full"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Profile</span>
          </motion.button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </motion.button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl p-8 text-white shadow-sm"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center text-4xl text-blue-950">
            {(profile.pharmacyName ?? "P").charAt(0)}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-white mb-2">{pharmacy.legalEntityName || profile.pharmacyName}</h2>
            {pharmacy.tradeName && pharmacy.legalEntityName && (
              <p className="text-gray-200 text-sm">Trade Name: {pharmacy.tradeName}</p>
            )}
            {pharmacy.ownerName && (
              <p className="text-gray-200 text-sm">{pharmacy.ownerName}</p>
            )}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Building className="w-4 h-4" />
                <span>License: {profile.licenseNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 border border-gray-200/50 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-50">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-gray-900">Contact Information</h3>
            <p className="text-gray-500 text-sm">How customers can reach you</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Contact Person Name */}
          <div>
            <label className="block text-gray-700 mb-2 text-sm">
              Contact Person Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profile.contactPersonName || ""}
                onChange={(e) =>
                  setProfile((p: any) => ({
                    ...p,
                    contactPersonName: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            ) : (
              <div className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                {profile.contactPersonName || "-"}
              </div>
            )}
          </div>

          {/* Contact Person Title */}
          <div>
            <label className="block text-gray-700 mb-2 text-sm">
              Contact Person Title
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profile.contactPersonTitle || ""}
                onChange={(e) =>
                  setProfile((p: any) => ({
                    ...p,
                    contactPersonTitle: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            ) : (
              <div className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                {profile.contactPersonTitle || "-"}
              </div>
            )}
          </div>

          {/* Contact Person Phone */}
          <div>
            <label className="block text-gray-700 mb-2 text-sm">
              Contact Person Phone
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profile.contactPersonPhone || ""}
                onChange={(e) =>
                  setProfile((p: any) => ({
                    ...p,
                    contactPersonPhone: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            ) : (
              <div className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                {profile.contactPersonPhone || "-"}
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm">
              Pharmacy Phone Number
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profile.pharmacyPhoneNumber || ""}
                onChange={(e) =>
                  setProfile((p: any) => ({
                    ...p,
                    pharmacyPhoneNumber: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            ) : (
              <div className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                {profile.pharmacyPhoneNumber || "-"}
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm">
              Pharmacy Email Address
            </label>
            <div className="flex items-center gap-2 text-gray-900 bg-gray-50 px-4 py-2 rounded-lg text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              {profile.email}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm">
              License Number
            </label>
            <div className="flex items-center gap-2 text-gray-900 bg-gray-50 px-4 py-2 rounded-lg text-sm">
              <Building className="w-4 h-4 text-gray-400" />
              {profile.licenseNumber}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-2 text-sm">
              Business Registration Number
            </label>
            <div className="flex items-center gap-2 text-gray-900 bg-gray-50 px-4 py-2 rounded-lg text-sm">
              <Building className="w-4 h-4 text-gray-400" />
              {profile.businessRegNumber}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Location */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 border border-gray-200/50 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-lime-50">
            <MapPin className="w-5 h-5 text-lime-600" />
          </div>
          <div>
            <h3 className="text-gray-900">Location</h3>
            <p className="text-gray-500 text-sm">Your pharmacy address</p>
          </div>
        </div>


        <div className="grid grid-cols-1 gap-4">
          {/* Address (editable) */}
          <div>
            <label className="block text-gray-700 mb-2">Address</label>
            {isEditing ? (
              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-300"
                value={profile.address || ""}
                onChange={(e) =>
                  setProfile((p: any) => ({
                    ...p,
                    address: e.target.value,
                  }))
                }
              />
            ) : (
              <div className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">
                {profile.address || "text"}
              </div>
            )}
          </div>

          {/* Map + GPS */}
          <div className="md:col-span-2 mt-2">
            {isEditing && (
              <button
                type="button"
                onClick={useMyLocation}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 mb-3"
              >
                📍 Use my current location (GPS)
              </button>
            )}

            <div className="text-gray-500 text-sm mb-2">
              {isEditing
                ? "Click the map to pin location (drag marker too)."
                : "Pinned location"}
            </div>

            <MapPicker
              initial={
                profile.latitude != null && profile.longitude != null
                  ? { lat: profile.latitude, lng: profile.longitude }
                  : undefined
              }
              onPick={(lat, lng) => {
                if (!isEditing) return;
                setProfile((p: any) => ({
                  ...p,
                  latitude: lat,
                  longitude: lng,
                }));
              }}
            />

            {profile.latitude != null && profile.longitude != null && (
              <div className="text-xs mt-2 text-gray-700">
                Selected: {Number(profile.latitude).toFixed(6)},{" "}
                {Number(profile.longitude).toFixed(6)}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Operating Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 border border-gray-200/50 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-purple-50">
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-gray-900">Operating Hours</h3>
            <p className="text-gray-500 text-sm">When your pharmacy is open</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { key: "weekdays", label: "Monday - Friday" },
            { key: "saturday", label: "Saturday" },
            { key: "sunday", label: "Sunday" },
          ].map((day) => {
            const isWeekend = day.key === "saturday" || day.key === "sunday";
            const isClosed =
              isWeekend &&
              (!profile.operatingHours[day.key].open && !profile.operatingHours[day.key].close);
            return (
              <div
                key={day.key}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg gap-2"
              >
                <span className="text-gray-700 w-40">{day.label}</span>
                {isEditing ? (
                  <div className="flex gap-2 flex-1 items-center">
                    {isWeekend && (
                      <label className="flex items-center gap-1 mr-3">
                        <input
                          type="checkbox"
                          checked={isClosed}
                          onChange={e => {
                            if (e.target.checked) {
                              setProfile(p => ({
                                ...p,
                                operatingHours: {
                                  ...p.operatingHours,
                                  [day.key]: { open: "", close: "" },
                                },
                              }));
                            } else {
                              setProfile(p => ({
                                ...p,
                                operatingHours: {
                                  ...p.operatingHours,
                                  [day.key]: { open: "09:00", close: "17:00" },
                                },
                              }));
                            }
                          }}
                        />
                        <span className="text-gray-500 text-xs">Closed</span>
                      </label>
                    )}
                    <input
                      type="time"
                      value={profile.operatingHours[day.key].open}
                      onChange={e => setProfile(p => ({
                        ...p,
                        operatingHours: {
                          ...p.operatingHours,
                          [day.key]: {
                            ...p.operatingHours[day.key],
                            open: e.target.value
                          }
                        }
                      }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg w-32"
                      disabled={isWeekend && isClosed}
                    />
                    <span className="text-gray-500 self-center">to</span>
                    <input
                      type="time"
                      value={profile.operatingHours[day.key].close}
                      onChange={e => setProfile(p => ({
                        ...p,
                        operatingHours: {
                          ...p.operatingHours,
                          [day.key]: {
                            ...p.operatingHours[day.key],
                            close: e.target.value
                          }
                        }
                      }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg w-32"
                      disabled={isWeekend && isClosed}
                    />
                  </div>
                ) : (
                  <span className="text-gray-900">
                    {profile.operatingHours[day.key].open && profile.operatingHours[day.key].close
                      ? `${profile.operatingHours[day.key].open} - ${profile.operatingHours[day.key].close}`
                      : isWeekend && isClosed
                        ? "Closed"
                        : "Not set"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 border border-gray-200/50 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-green-50">
            <User className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-gray-900">About Your Pharmacy</h3>
            <p className="text-gray-500 text-sm">
              Tell customers about your pharmacy
            </p>
          </div>
        </div>

        {isEditing ? (
          <textarea
            value={profile.description || ""}
            onChange={(e) =>
              setProfile((p: any) => ({ ...p, description: e.target.value }))
            }
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        ) : (
          <div className="text-gray-700 bg-gray-50 p-4 rounded-lg">
            {profile.description || "-"}
          </div>
        )}
      </motion.div>
    </div>
  );
}
