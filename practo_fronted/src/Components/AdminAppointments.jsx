import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import {
  CalendarDays,
  Clock3,
  Search,
  RefreshCcw,
  Loader2,
  UserRound,
  Stethoscope,
  BadgeCheck,
  CheckCircle2,
  XCircle,
  ClipboardCheck,
} from "lucide-react";
import API from "../api";

function AdminAppointments() {
  const token = localStorage.getItem("access") || localStorage.getItem("token");

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      appointments.length === 0 ? setLoading(true) : setRefreshing(true);

      const res = await API.get("/appointments/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to fetch appointments");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function updateAppointment(id, action, nextStatus) {
    try {
      setUpdatingId(`${id}-${action}`);

      const res = await API.patch(
        `/appointments/${id}/${action}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAppointments((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: res.data?.status || nextStatus } : item
        )
      );

      toast.success(res.data?.message || "Appointment updated");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Appointment update failed");
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

    if (value === "CONFIRMED") return "bg-blue-50 text-blue-700 border-blue-200";
    if (value === "COMPLETED") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (value === "CANCELLED") return "bg-rose-50 text-rose-700 border-rose-200";
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  const filteredAppointments = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return appointments;

    return appointments.filter((item) => {
      return (
        String(item.id).includes(q) ||
        String(item.status || "").toLowerCase().includes(q) ||
        String(item.patient_name || item.patient_details?.name || "").toLowerCase().includes(q) ||
        String(item.doctor_name || item.doctor_details?.doctor_name || "").toLowerCase().includes(q) ||
        String(item.symptoms || "").toLowerCase().includes(q)
      );
    });
  }, [appointments, search]);

  const total = appointments.length;
  const pending = appointments.filter((a) => String(a.status).toUpperCase() === "PENDING").length;
  const completed = appointments.filter((a) => String(a.status).toUpperCase() === "COMPLETED").length;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.14),_transparent_35%),linear-gradient(to_bottom,_#f8fafc,_#eef2ff)] px-3 py-4 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[28px] bg-slate-950 p-5 text-white shadow-2xl sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest">
                <CalendarDays size={14} />
                Admin Appointments
              </div>
              <h1 className="mt-4 text-3xl font-bold sm:text-5xl">Manage Appointments</h1>
              <p className="mt-2 text-sm text-slate-300">Confirm, complete, or cancel appointments.</p>
            </div>

            <button
              onClick={fetchAppointments}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-900 disabled:opacity-60"
            >
              {refreshing ? <Loader2 size={18} className="animate-spin" /> : <RefreshCcw size={18} />}
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <StatCard title="Total" value={total} icon={<CalendarDays size={22} />} />
          <StatCard title="Pending" value={pending} icon={<Clock3 size={22} />} />
          <StatCard title="Completed" value={completed} icon={<CheckCircle2 size={22} />} />
        </section>

        <section className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative w-full lg:max-w-md">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search appointment, patient, doctor, status..."
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </div>
        </section>

        {loading ? (
          <LoadingBox text="Loading appointments..." />
        ) : filteredAppointments.length === 0 ? (
          <EmptyBox text="No appointments found" />
        ) : (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredAppointments.map((item) => {
              const status = String(item.status || "").toUpperCase();
              const busy = updatingId?.startsWith(`${item.id}-`);

              return (
                <article
                  key={item.id}
                  className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
                        Appointment
                        <span className="rounded-md bg-sky-100 px-2 py-0.5 text-xs font-bold text-sky-700">
                          {item.id}
                        </span>
                      </h2>
                      <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                        <Clock3 size={14} />
                        {formatDate(item.appointment_date)}
                      </p>
                    </div>

                    <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(item.status)}`}>
                      <BadgeCheck size={12} />
                      {formatStatus(item.status)}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 rounded-2xl bg-slate-50 p-3">
                    <InfoRow icon={<UserRound size={14} />} label="Patient" value={item.patient_name || item.patient_details?.name || "N/A"} />
                    <InfoRow icon={<Stethoscope size={14} />} label="Doctor" value={item.doctor_name || item.doctor_details?.doctor_name || "N/A"} />
                    <InfoRow label="Symptoms" value={item.symptoms || "N/A"} />
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <ActionButton
                      disabled={busy || status === "CONFIRMED" || status === "COMPLETED" || status === "CANCELLED"}
                      onClick={() => updateAppointment(item.id, "confirm", "CONFIRMED")}
                      label="Confirm"
                      icon={<CheckCircle2 size={15} />}
                      className="bg-blue-600"
                    />
                    <ActionButton
                      disabled={busy || status === "COMPLETED" || status === "CANCELLED"}
                      onClick={() => updateAppointment(item.id, "complete", "COMPLETED")}
                      label="Complete"
                      icon={<ClipboardCheck size={15} />}
                      className="bg-emerald-600"
                    />
                    <ActionButton
                      disabled={busy || status === "COMPLETED" || status === "CANCELLED"}
                      onClick={() => updateAppointment(item.id, "cancel", "CANCELLED")}
                      label="Cancel"
                      icon={<XCircle size={15} />}
                      className="bg-rose-600"
                    />
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">{value}</h2>
        </div>
        <div className="rounded-2xl bg-slate-900 p-3 text-white">{icon}</div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 text-sm">
      <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
        {icon}
        {label}
      </span>
      <span className="max-w-[150px] truncate text-right font-bold text-slate-900">{value}</span>
    </div>
  );
}

function ActionButton({ label, icon, onClick, disabled, className }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {icon}
      {label}
    </button>
  );
}

function LoadingBox({ text }) {
  return (
    <div className="flex min-h-[280px] items-center justify-center rounded-[28px] bg-white shadow-sm">
      <Loader2 className="animate-spin text-slate-600" size={28} />
      <span className="ml-3 text-sm font-semibold text-slate-600">{text}</span>
    </div>
  );
}

function EmptyBox({ text }) {
  return (
    <div className="rounded-[28px] bg-white p-10 text-center shadow-sm">
      <h3 className="text-xl font-bold text-slate-900">{text}</h3>
    </div>
  );
}

export default AdminAppointments;