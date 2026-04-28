import React, { useEffect, useMemo, useState } from "react";

import { toast } from "react-toastify";
import {
  FlaskConical,
  Search,
  RefreshCcw,
  Loader2,
  UserRound,
  Stethoscope,
  BadgeCheck,
  CheckCircle2,
  XCircle,
  Clock3,
  MapPin,
  IndianRupee,
  TestTubeDiagonal,
} from "lucide-react";
import API from "../api";



function AdminLabBookings() {
  const token = localStorage.getItem("access") || localStorage.getItem("token");

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [drafts, setDrafts] = useState({});
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      bookings.length === 0 ? setLoading(true) : setRefreshing(true);

      const res = await API.get("/lab-orders/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data) ? res.data : [];
      setBookings(data);

      const map = {};
      data.forEach((item) => {
        map[item.id] = item.status || "BOOKED";
      });
      setDrafts(map);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to fetch lab bookings");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function updateLabStatus(id) {
    const status = drafts[id];

    if (!status) {
      toast.error("Please select status");
      return;
    }

    try {
      setUpdatingId(id);

      const res = await API.patch(
        `/lab-orders/${id}/update-status/`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBookings((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: res.data?.status || status } : item
        )
      );

      toast.success(res.data?.message || "Lab booking updated");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Lab booking update failed");
    } finally {
      setUpdatingId(null);
    }
  }

  function formatDate(date) {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatStatus(status) {
    if (!status) return "N/A";
    return String(status).replaceAll("_", " ");
  }

  function getStatusStyle(status) {
    const value = String(status || "").toUpperCase();

    if (value === "COMPLETED") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (value === "CANCELLED") return "bg-rose-50 text-rose-700 border-rose-200";
    if (value === "SAMPLE_COLLECTED" || value === "PROCESSING") return "bg-blue-50 text-blue-700 border-blue-200";
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  const filteredBookings = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return bookings;

    return bookings.filter((item) => {
      return (
        String(item.id).includes(q) ||
        String(item.status || "").toLowerCase().includes(q) ||
        String(item.full_name || "").toLowerCase().includes(q) ||
        String(item.doctor_name || "").toLowerCase().includes(q) ||
        String(item.address || "").toLowerCase().includes(q) ||
        item.items?.some((test) => String(test.test_name || "").toLowerCase().includes(q))
      );
    });
  }, [bookings, search]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.14),_transparent_35%),linear-gradient(to_bottom,_#f8fafc,_#eef6ff)] px-3 py-4 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* HEADER */}
        <section className="rounded-[28px] bg-slate-950 p-5 text-white shadow-2xl sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest">
                <FlaskConical size={14} />
                Admin Lab Bookings
              </div>
              <h1 className="mt-4 text-3xl font-bold sm:text-5xl">Manage Lab Bookings</h1>
              <p className="mt-2 text-sm text-slate-300">
                Update sample, processing, completed, or cancelled status.
              </p>
            </div>

            <button
              onClick={fetchBookings}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-900"
            >
              {refreshing ? <Loader2 size={18} className="animate-spin" /> : <RefreshCcw size={18} />}
              Refresh
            </button>
          </div>
        </section>

        {/* SEARCH */}
        <section className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative w-full lg:max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search lab booking..."
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />
          </div>
        </section>

        {/* LIST */}
        {loading ? (
          <LoadingBox text="Loading lab bookings..." />
        ) : (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredBookings.map((item) => (
              <article
                key={item.id}
                className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm hover:shadow-xl transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {/* ✅ FIXED HERE */}
                    <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
                      Booking
                      <span className="rounded-md bg-cyan-100 px-2 py-0.5 text-xs font-bold text-cyan-700">
                        {item.id}
                      </span>
                    </h2>

                    <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                      <Clock3 size={14} />
                      {formatDate(item.booking_date || item.created_at)}
                    </p>
                  </div>

                  <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(item.status)}`}>
                    <BadgeCheck size={12} />
                    {formatStatus(item.status)}
                  </span>
                </div>

                <div className="mt-4 space-y-2 rounded-2xl bg-slate-50 p-3">
                  <InfoRow icon={<UserRound size={14} />} label="Patient" value={item.full_name || "N/A"} />
                  <InfoRow icon={<Stethoscope size={14} />} label="Doctor" value={item.doctor_name || "N/A"} />
                  <InfoRow icon={<MapPin size={14} />} label="Address" value={item.address || "N/A"} />
                  <InfoRow icon={<IndianRupee size={14} />} label="Total" value={`₹${Number(item.total_amount || 0).toFixed(2)}`} />
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <select
                    value={drafts[item.id] || item.status || "BOOKED"}
                    onChange={(e) =>
                      setDrafts((prev) => ({
                        ...prev,
                        [item.id]: e.target.value,
                      }))
                    }
                    className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"
                  >
                    <option value="BOOKED">BOOKED</option>
                    <option value="SAMPLE_COLLECTED">SAMPLE COLLECTED</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>

                  <button
                    onClick={() => updateLabStatus(item.id)}
                    disabled={updatingId === item.id}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm text-white"
                  >
                    {updatingId === item.id ? <Loader2 size={14} className="animate-spin" /> : <FlaskConical size={14} />}
                    Update
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-1 text-slate-500">
        {icon}
        {label}
      </span>
      <span className="font-bold text-slate-900">{value}</span>
    </div>
  );
}

function LoadingBox({ text }) {
  return (
    <div className="flex justify-center py-10">
      <Loader2 className="animate-spin text-slate-600" />
      <span className="ml-2 text-sm">{text}</span>
    </div>
  );
}

export default AdminLabBookings;