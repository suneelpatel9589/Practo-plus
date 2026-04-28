import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  CalendarDays,
  IndianRupee,
  Stethoscope,
  FileText,
  BadgeCheck,
  CreditCard,
  XCircle,
  UserRound,
} from "lucide-react";
import API from "../api";

function MyAppointments() {
  const token = localStorage.getItem("access") || localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(null);

  const isDoctor = String(user.role || "").toUpperCase() === "DOCTOR";

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    if (!token) {
      toast.error("Login required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await API.get("/appointments/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppointments(res.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Failed to fetch appointments. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function cancelAppointment(id) {
    const ok = window.confirm("Kya aap appointment cancel karna chahte ho?");
    if (!ok) return;

    try {
      setCancelLoading(id);

      const res = await API.patch(
        `/appointments/${id}/cancel/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAppointments((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "CANCELLED" } : item
        )
      );

      toast.success(res.data?.message || "Appointment cancelled successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          "Failed to cancel appointment. Please try again."
      );
    } finally {
      setCancelLoading(null);
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

  function getStatusColor(status) {
    const value = String(status || "").toUpperCase();

    if (value === "COMPLETED" || value === "CONFIRMED") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (value === "CANCELLED") {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  function getPaymentLabel(method) {
    const value = String(method || "").toUpperCase();
    if (value === "ONLINE") return "Online Payment";
    if (value === "COD") return "Cash Payment";
    return method || "N/A";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-cyan-50 px-4 py-6 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[32px] bg-white shadow-2xl">
          <div className="rounded-tl-[32px] rounded-tr-[32px] bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500 px-6 py-7 text-white">
            <h1 className="text-3xl font-bold">
              {isDoctor ? "Patient Appointments" : "My Appointments"}
            </h1>
          </div>

          <div className="p-5 md:p-6">
            {loading ? (
              <div className="rounded-[28px] bg-slate-50 p-10 text-center text-slate-600">
                Loading appointments...
              </div>
            ) : appointments.length === 0 ? (
              <div className="rounded-[28px] bg-slate-50 p-10 text-center">
                <h3 className="text-xl font-semibold text-slate-800">
                  No appointments found
                </h3>
              </div>
            ) : (
              <div className="grid gap-5">
                {appointments.map((item) => {
                  const status = String(item.status || "").toUpperCase();
                  const canCancel =
                    status !== "CANCELLED" && status !== "COMPLETED";

                  return (
                    <div
                      key={item.id}
                      className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-md ring-1 ring-slate-100"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex-1">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-xl font-bold text-slate-800">
                              Appointment {item.id}
                            </h3>

                            <div
                              className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-xs font-semibold ${getStatusColor(
                                item.status
                              )}`}
                            >
                              <BadgeCheck size={14} />
                              {item.status || "PENDING"}
                            </div>
                          </div>

                          {isDoctor && (
                            <div className="mt-3 rounded-2xl bg-cyan-50 px-4 py-3">
                              <p className="text-xs text-slate-400">
                                Patient
                              </p>
                              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                                <UserRound size={15} />
                                {item.patient_name ||
                                  item.patient_details?.name ||
                                  "Unknown Patient"}
                              </p>
                            </div>
                          )}

                          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-2xl bg-slate-50 px-4 py-3">
                              <p className="text-xs text-slate-400">Doctor</p>
                              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                                <Stethoscope size={15} />
                                {item.doctor_details?.doctor_name || "Doctor"}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 px-4 py-3">
                              <p className="text-xs text-slate-400">Date</p>
                              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                                <CalendarDays size={15} />
                                {formatDate(item.appointment_date)}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 px-4 py-3">
                              <p className="text-xs text-slate-400">
                                Subtotal
                              </p>
                              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                                <IndianRupee size={15} />
                                {Number(item.subtotal_amount || 0).toFixed(2)}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-slate-900 px-4 py-3">
                              <p className="text-xs text-slate-300">
                                Total Payable
                              </p>
                              <p className="mt-1 flex items-center gap-2 text-sm font-bold text-white">
                                <IndianRupee size={15} />
                                {Number(item.total_amount || 0).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 grid gap-3 md:grid-cols-3">
                            <div className="rounded-2xl bg-orange-50 px-4 py-3">
                              <p className="text-xs text-slate-400">
                                Commission
                              </p>
                              <p className="mt-1 text-sm font-semibold text-orange-600">
                                ₹
                                {Number(item.commission_amount || 0).toFixed(2)}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 px-4 py-3">
                              <p className="text-xs text-slate-400">
                                Payment Method
                              </p>
                              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                                <CreditCard size={14} />
                                {getPaymentLabel(item.payment_method)}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 px-4 py-3">
                              <p className="text-xs text-slate-400">
                                Symptoms
                              </p>
                              <p className="mt-1 flex items-start gap-2 text-sm text-slate-700">
                                <FileText size={14} className="mt-0.5" />
                                {item.symptoms || "No symptoms added"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {canCancel && (
                          <button
                            onClick={() => cancelAppointment(item.id)}
                            disabled={cancelLoading === item.id}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <XCircle size={15} />
                            {cancelLoading === item.id
                              ? "Cancelling..."
                              : "Cancel"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAppointments;