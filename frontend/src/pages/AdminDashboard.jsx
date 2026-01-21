import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // New Filter State: 'all', 'on-duty', 'off-duty', 'pending'
  const [activeFilter, setActiveFilter] = useState("all");

  // Form states for new staff
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
  if (!token) {
    window.location.href = "/";
  }
}, []);

 const fetchStaff = async () => {
  try {
    setLoading(true);
    setError("");

    const res = await axios.get(
      "http://localhost:5000/api/admin/staff",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setStaffList(Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    console.error(err);
    setError("Failed to load staff list");
    setStaffList([]); // prevent crash
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchStaff();
  }, []);

  // Filter Logic
  const filteredStaff = (staffList || []).filter((staff) => {
    if (activeFilter === "on-duty") return staff.is_on_duty;
    if (activeFilter === "off-duty") return !staff.is_on_duty;
    if (activeFilter === "pending") return staff.access_requested;
    return true; // 'all'
  });

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    setFormMessage("");
    setFormError("");
    try {
     await axios.post(
  "http://localhost:5000/api/admin/create-staff",
  { name, username, password, phone },
  { headers: { Authorization: `Bearer ${token}` } }
);
      setFormMessage("Staff created successfully!");
      setName(""); setUsername(""); setPassword(""); setPhone("");
      setTimeout(() => setShowForm(false), 1500);
      fetchStaff();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create staff");
    }
  };

 const toggleDuty = async (id, currentStatus) => {
  const newStatus = currentStatus ? 0 : 1;

  try {
    await axios.put(
      "http://localhost:5000/api/admin/toggle-access",
      {
        staffId: id,
        is_on_duty: newStatus,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchStaff();
  } catch (err) {
    alert("Failed to update access status");
  }
};


  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // Helper for Sidebar Button Styles
  const getBtnClass = (filter) => 
    `w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all font-semibold text-sm ${
      activeFilter === filter 
      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
      : "text-slate-400 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col sticky top-0 h-screen border-r border-white/5">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <span className="font-black text-sm">AP</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Admin<span className="text-indigo-500">Hub</span></h2>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Staff Filters</p>
          
          <button onClick={() => setActiveFilter("all")} className={getBtnClass("all")}>
            <span className="flex items-center gap-3"><span>👥</span> All Staff</span>
            <span className="text-xs opacity-60">{staffList.length}</span>
          </button>

          <button onClick={() => setActiveFilter("on-duty")} className={getBtnClass("on-duty")}>
            <span className="flex items-center gap-3"><span>🟢</span> On Duty</span>
            <span className="text-xs opacity-60">{staffList.filter(s => s.is_on_duty).length}</span>
          </button>

          <button onClick={() => setActiveFilter("off-duty")} className={getBtnClass("off-duty")}>
            <span className="flex items-center gap-3"><span>🔴</span> Off Duty</span>
            <span className="text-xs opacity-60">{staffList.filter(s => !s.is_on_duty).length}</span>
          </button>

          <button onClick={() => setActiveFilter("pending")} className={getBtnClass("pending")}>
            <span className="flex items-center gap-3"><span>⏳</span> Pending Requests</span>
            <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-md">
              {staffList.filter(s => s.access_requested).length}
            </span>
          </button>
        </nav>

        <div className="p-6 mt-auto">
          <button onClick={handleLogout} className="w-full py-3 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all font-bold text-sm">
            Logout Account
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 px-8 py-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Dashboard / {activeFilter.replace('-', ' ')}
            </h2>
            <span className="text-sm font-bold text-slate-700">Super Admin</span>
          </div>
        </header>

        <main className="p-8 lg:p-12 max-w-6xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight capitalize">
                {activeFilter.replace('-', ' ')} List
              </h1>
              <p className="text-slate-500 mt-2 text-lg">Showing {filteredStaff.length} results.</p>
            </div>
            <button onClick={() => setShowForm(true)} className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl transition-all hover:-translate-y-1">
              <span className="text-2xl leading-none">+</span> Register New Staff
            </button>
          </div>

          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200">
                    <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">Identity</th>
                    <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">Username</th>
                    <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.1em] text-slate-400">Status</th>
                    <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.1em] text-slate-400 text-right">Access Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan="4" className="px-8 py-20 text-center text-slate-400 animate-pulse">Loading...</td></tr>
                  ) : filteredStaff.length === 0 ? (
                    <tr><td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-medium">No staff members found in this category.</td></tr>
                  ) : (
                    filteredStaff.map((staff) => (
                      <tr key={staff.id} className="hover:bg-slate-50/80 transition-all">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                              {staff.name.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800 leading-tight">{staff.name}</span>
                              <span className="text-xs text-slate-500 font-medium">{staff.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm font-semibold text-slate-600">@{staff.username}</td>
                       <td className="px-8 py-6">
  {staff.is_on_duty ? (
    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 border border-emerald-200">
      ACTIVE
    </span>
  ) : (
    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-400 border border-slate-200">
      INACTIVE
    </span>
  )}
</td>

                        <td className="px-8 py-6 text-right">
                          <button
                            onClick={() => toggleDuty(staff.id, staff.is_on_duty)}
                            className={`text-xs font-black px-5 py-2.5 rounded-xl transition-all border ${
                              staff.is_on_duty 
                              ? "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border-rose-200" 
                              : "bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white border-indigo-200"
                            }`}
                          >
                            {staff.is_on_duty ? "Revoke Access" : "Grant Access"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal remains the same as your previous version */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 transform">
            <h2 className="text-3xl font-black text-slate-900 mb-2">New Staff</h2>
            {formMessage && (
  <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-emerald-700 text-sm font-semibold">
    ✅ {formMessage}
  </div>
)}

{formError && (
  <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-rose-600 text-sm font-semibold">
    ❌ {formError}
  </div>
)}

            <form onSubmit={handleCreateStaff} className="space-y-5">
              <div className="space-y-4">
                <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                <input type="password" placeholder="Temporary Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <button type="button" onClick={() => setShowForm(false)} className="py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl">Discard</button>
               <button
  onClick={() => {
    setShowForm(true);
    setFormMessage("");
    setFormError("");
  }}
  className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl transition-all hover:-translate-y-1"
>
  <span className="text-2xl leading-none">+</span> Register New Staff
</button>

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}