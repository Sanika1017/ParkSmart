import { useState } from "react";
import axios from "axios";

export default function VehicleEntryForm({ onSuccess }) {
  const [vehicleNo, setVehicleNo] = useState("");
  const [vehicleType, setVehicleType] = useState("TWO_WHEELER");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:5000/api/staff/vehicle/entry",
        { vehicleNumber: vehicleNo, vehicleType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(`Vehicle ${vehicleNo} has been checked in successfully.`);
      setVehicleNo("");
      setVehicleType("TWO_WHEELER");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Internal system error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      {/* Visual Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl mb-4 shadow-sm">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Entry Registration</h2>
        <p className="text-slate-500 font-medium">Issue a new parking session</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vehicle Number Input */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
            License Plate Number
          </label>
          <input
            type="text"
            placeholder="MH 12 AB 1234"
            value={vehicleNo}
            onChange={(e) => setVehicleNo(e.target.value.toUpperCase())}
            className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black text-xl placeholder:text-slate-300 tracking-wider"
            required
          />
        </div>

        {/* Vehicle Type Selection */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
            Vehicle Category
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setVehicleType("TWO_WHEELER")}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                vehicleType === "TWO_WHEELER"
                  ? "border-indigo-600 bg-indigo-50/50 text-indigo-600 shadow-md shadow-indigo-100"
                  : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
              }`}
            >
              <span className="text-2xl">🛵</span>
              <span className="text-[10px] font-black uppercase tracking-widest">2-Wheeler</span>
            </button>
            <button
              type="button"
              onClick={() => setVehicleType("FOUR_WHEELER")}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                vehicleType === "FOUR_WHEELER"
                  ? "border-indigo-600 bg-indigo-50/50 text-indigo-600 shadow-md shadow-indigo-100"
                  : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
              }`}
            >
              <span className="text-2xl">🚗</span>
              <span className="text-[10px] font-black uppercase tracking-widest">4-Wheeler</span>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-5 rounded-2xl font-black text-white tracking-[0.2em] uppercase text-xs shadow-xl transition-all active:scale-[0.98] ${
            loading
              ? "bg-slate-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100"
          }`}
        >
          {loading ? "Registering..." : "Process Check-in"}
        </button>

        {/* Status Messages */}
        {message && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 text-xs font-bold text-center animate-in fade-in slide-in-from-top-2">
            ✨ {message}
          </div>
        )}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold text-center">
            ⚠️ {error}
          </div>
        )}
      </form>
    </div>
  );
}