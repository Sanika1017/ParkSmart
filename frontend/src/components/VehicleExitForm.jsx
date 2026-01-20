import { useState } from "react";
import axios from "axios";

export default function VehicleExitForm() {
  const [vehicleNo, setVehicleNo] = useState("");
  const [fee, setFee] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleExit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setFee(null);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/staff/vehicle/exit",
        { vehicle_number: vehicleNo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFee(res.data.fee);
      setMessage(`Vehicle ${vehicleNo} exit recorded. Fee: ₹${res.data.fee}`);
      setVehicleNo("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to record exit");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-md">
      <h2 className="text-xl font-semibold mb-4">Vehicle Exit</h2>

      <form onSubmit={handleExit}>
        <input
          type="text"
          placeholder="Vehicle Number (e.g. MH12AB1234)"
          value={vehicleNo}
          onChange={(e) => setVehicleNo(e.target.value.toUpperCase())}
          className="w-full border p-2 rounded mb-4"
          required
        />

        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Mark Exit & Calculate Fee
        </button>

        {fee !== null && <p className="mt-4 text-blue-600 font-bold">Fee: ₹{fee}</p>}
        {message && <p className="mt-4 text-green-600">{message}</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </form>
    </div>
  );
}