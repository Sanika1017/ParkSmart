import { useState } from "react";
import axios from "axios";

export default function VehicleEntryForm() {
  const [vehicleNo, setVehicleNo] = useState("");
  const [vehicleType, setVehicleType] = useState("TWO_WHEELER");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await axios.post(
        "http://localhost:5000/api/staff/vehicle/entry",
        { vehicleNumber: vehicleNo, vehicleType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(`Vehicle ${vehicleNo} entry recorded ✅`);
      setVehicleNo("");
      setVehicleType("TWO_WHEELER");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to record entry");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-md">
      <h2 className="text-xl font-semibold mb-4">Vehicle Entry</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Vehicle Number"
          value={vehicleNo}
          onChange={(e) => setVehicleNo(e.target.value.toUpperCase())}
          className="w-full border p-2 rounded mb-4"
          required
        />

        <select
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="TWO_WHEELER">Two Wheeler</option>
          <option value="FOUR_WHEELER">Four Wheeler</option>
        </select>

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Add Entry
        </button>

        {message && <p className="mt-4 text-green-600">{message}</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </form>
    </div>
  );
}
