import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import {
  CalendarDays,
  IndianRupee,
  UserRound,
  FileText,
  BadgeCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import API from "../api";

function DoctorAppointments() {
  const token = localStorage.getItem("access") || localStorage.getItem("token");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    try {
      setLoading(true);

      const res = await API.get("/appointments/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAppointments(res.data || []);
    } catch (error) {
      console.error(
        "Doctor appointments fetch error:",
        error.response?.data || error.message
      );

      const msg =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to fetch appointments. Please try again.";

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, actionType) {
    const endpointMap = {
      confirm: "confirm",
      cancel: "cancel",
      complete: "complete",
    };

    const statusMap = {
      confirm: "CONFIRMED",
      cancel: "CANCELLED",
      complete: "COMPLETED",
    };

    const successMessageMap = {
      confirm: "Appointment confirmed successfully",
      cancel: "Appointment cancelled successfully",
      complete: "Appointment completed successfully",
    };

    try {
      setActionLoading((prev) => ({ ...prev, [id]: actionType }));

      const res = await API.patch(
        `/appointments/${id}/${endpointMap[actionType]}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppointments((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: statusMap[actionType] } : item
        )
      );

      toast.success(
        res.data?.message || successMessageMap[actionType] || "Status updated successfully"
      );
    } catch (error) {
      console.error(
        "Appointment status error:",
        error.response?.data || error.message
      );

      const msg =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to update appointment status. Please try again.";

      toast.error(msg);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
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

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-cyan-50 px-4 py-6 md:px-6">
        <div className="mx-auto max-w-3xl rounded-[32px] bg-white p-8 text-center shadow-2xl">
          <h2 className="text-2xl font-bold text-red-600">Login Required</h2>
         
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-cyan-50 px-4 py-6 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[32px] bg-white shadow-2xl">
          <div className="bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500 px-6 py-7 text-white">
            <h1 className="text-3xl font-bold">Doctor Appointments</h1>
        
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
                  const status = String(item.status || "PENDING").toUpperCase();
                  const isBusy = !!actionLoading[item.id];
                  const currentAction = actionLoading[item.id];

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
                                status
                              )}`}
                            >
                              <BadgeCheck size={14} />
                              {status}
                            </div>
                          </div>

                          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-2xl bg-slate-50 px-4 py-3">
                              <p className="text-xs text-slate-400">Patient</p>
                              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                                <UserRound size={15} />
                                {item.patient_name ||
                                  item.patient_details?.name ||
                                  "Patient"}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 px-4 py-3">
                              <p className="text-xs text-slate-400">Date</p>
                              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                                <CalendarDays size={15} />
                                {formatDate(item.appointment_date)}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-orange-50 px-4 py-3">
                              <p className="text-xs text-slate-400">
                                Platform Commission
                              </p>
                              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-orange-600">
                                <IndianRupee size={15} />
                                {Number(item.commission_amount || 0).toFixed(2)}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-green-50 px-4 py-3">
                              <p className="text-xs text-slate-400">
                                Doctor Payout
                              </p>
                              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-green-700">
                                <IndianRupee size={15} />
                                {Number(item.doctor_payout || 0).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 grid gap-3 md:grid-cols-2">
                            <div className="rounded-2xl bg-slate-50 px-4 py-3">
                              <p className="text-xs text-slate-400">
                                Total Paid by Patient
                              </p>
                              <p className="mt-1 text-sm font-semibold text-slate-800">
                                ₹{Number(item.total_amount || 0).toFixed(2)}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 px-4 py-3">
                              <p className="text-xs text-slate-400">Symptoms</p>
                              <p className="mt-1 flex items-start gap-2 text-sm text-slate-700">
                                <FileText size={14} className="mt-0.5" />
                                {item.symptoms || "No symptoms added"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 md:w-[220px] md:flex-col">
                          {status === "PENDING" && (
                            <>
                              <button
                                onClick={() => updateStatus(item.id, "confirm")}
                                disabled={isBusy}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                              >
                                <CheckCircle2 size={16} />
                                {currentAction === "confirm" ? "Confirming..." : "Confirm"}
                              </button>

                              <button
                                onClick={() => updateStatus(item.id, "cancel")}
                                disabled={isBusy}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
                              >
                                <XCircle size={16} />
                                {currentAction === "cancel" ? "Cancelling..." : "Cancel"}
                              </button>
                            </>
                          )}

                          {status === "CONFIRMED" && (
                            <button
                              onClick={() => updateStatus(item.id, "complete")}
                              disabled={isBusy}
                              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
                            >
                              <CheckCircle2 size={16} />
                              {currentAction === "complete" ? "Completing..." : "Complete"}
                            </button>
                          )}
                        </div>
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

export default DoctorAppointments;