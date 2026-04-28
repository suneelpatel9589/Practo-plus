import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  CalendarDays,
  IndianRupee,
  ReceiptText,
  FlaskConical,
  UserRound,
  BadgeCheck,
  Stethoscope,
  CreditCard,
  CheckCircle2,
  Clock3,
  XCircle,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function LabtestOrders() {
  const token = localStorage.getItem("access") || localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(null);

  const navigate = useNavigate();

  const role = String(user.role || "").toUpperCase();
  const isDoctor = role === "DOCTOR";
  const isPatient = role === "PATIENT";

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    if (!token) {
      toast.error("Login required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await API.get("/lab-orders/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data || []);
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Failed to fetch lab test orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateLabStatus(id, status) {
    const ok = window.confirm(`Are you sure you want to set status to ${formatStatus(status)}?`);
    if (!ok) return;

    try {
      setStatusLoading(`${id}-${status}`);

      const res = await API.patch(
        `/lab-orders/${id}/update-status/`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: res.data?.status || status } : item
        )
      );

      toast.success(res.data?.message || "Lab booking status updated");
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          "Status update failed"
      );
    } finally {
      setStatusLoading(null);
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

  function getPaymentLabel(method) {
    const value = String(method || "").toUpperCase();

    if (value === "COD") return "Cash on Collection";
    if (value === "ONLINE") return "Online Payment";

    return method || "N/A";
  }

  function getStatusColor(status) {
    const value = String(status || "").toUpperCase();

    if (value === "COMPLETED") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (value === "CANCELLED") return "bg-rose-50 text-rose-700 border-rose-200";
    if (value === "PROCESSING" || value === "SAMPLE_COLLECTED")
      return "bg-blue-50 text-blue-700 border-blue-200";
    if (value === "BOOKED") return "bg-emerald-50 text-emerald-700 border-emerald-200";

    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  function getPaymentStatusColor(status) {
    const value = String(status || "").toUpperCase();

    if (value === "SUCCESS") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (value === "FAILED") return "bg-rose-50 text-rose-700 border-rose-200";

    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  function getPaymentStatusIcon(status) {
    const value = String(status || "").toUpperCase();

    if (value === "SUCCESS") return <CheckCircle2 size={13} />;
    if (value === "FAILED") return <XCircle size={13} />;

    return <Clock3 size={13} />;
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-6">
        <div className="mx-auto max-w-3xl rounded-[24px] bg-white p-8 text-center shadow-2xl">
          <h2 className="text-2xl font-bold text-red-600">Login Required</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.10),_transparent_32%),linear-gradient(to_bottom,_#f8fafc,_#eef6ff)] px-3 py-4 sm:px-4 md:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-5 text-white sm:px-6">
            <h1 className="text-2xl font-bold">
              {isDoctor ? "Patient Lab Bookings" : "My Lab Test Orders"}
            </h1>
          </div>

          <div className="p-4 sm:p-5">
            {loading ? (
              <div className="rounded-[20px] bg-slate-50 p-8 text-center text-slate-600">
                Loading bookings...
              </div>
            ) : orders.length === 0 ? (
              <div className="rounded-[20px] bg-slate-50 p-8 text-center">
                <h3 className="text-lg font-semibold text-slate-800">
                  No bookings found
                </h3>
              </div>
            ) : (
              <div className="grid gap-4">
                {orders.map((order) => {
                  const subtotal = Number(order.subtotal_amount || 0);
                  const commission = Number(order.commission_amount || 0);
                  const labPayout = Number(order.lab_payout || 0);
                  const totalAmount = Number(order.total_amount || 0);
                  const status = String(order.status || "").toUpperCase();

                  const canPatientCancel =
                    isPatient && !["CANCELLED", "COMPLETED"].includes(status);

                  const canDoctorUpdate =
                    isDoctor && !["CANCELLED", "COMPLETED"].includes(status);

                  return (
                    <div
                      key={order.id}
                      className="rounded-[20px] border border-slate-200 bg-gradient-to-br from-white to-cyan-50/40 p-4 shadow-sm"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-base font-bold text-slate-800 sm:text-lg">
                              Booking {order.id}
                            </h3>

                            <div className="flex flex-wrap gap-2">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                <BadgeCheck size={13} />
                                Status: {formatStatus(order.status)}
                              </span>

                              <span
                                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${getPaymentStatusColor(
                                  order.payment_status
                                )}`}
                              >
                                {getPaymentStatusIcon(order.payment_status)}
                                Payment: {formatStatus(order.payment_status)}
                              </span>
                            </div>
                          </div>

                          {isDoctor && (
                            <div className="rounded-2xl bg-cyan-50 px-4 py-3">
                              <p className="text-[11px] text-slate-400">
                                Patient Name
                              </p>
                              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                                <UserRound size={14} />
                                {order.full_name || "Unknown Patient"}
                              </p>
                            </div>
                          )}

                          {order.doctor_name && (
                            <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-100">
                              <p className="text-[11px] text-slate-400">Doctor</p>
                              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                                <Stethoscope size={14} />
                                {order.doctor_name}
                              </p>
                            </div>
                          )}

                          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-100">
                              <p className="text-[11px] text-slate-400">
                                Booking Date
                              </p>
                              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                                <CalendarDays size={14} />
                                {formatDate(order.booking_date)}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-100">
                              <p className="text-[11px] text-slate-400">
                                Payment Type
                              </p>
                              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                                <CreditCard size={14} />
                                {getPaymentLabel(order.payment_method)}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-100">
                              <p className="text-[11px] text-slate-400">
                                Commission
                              </p>
                              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-orange-600">
                                <IndianRupee size={14} />
                                {commission.toFixed(2)}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-slate-900 p-3">
                              <p className="text-[11px] text-slate-300">
                                Grand Total
                              </p>
                              <p className="mt-1 flex items-center gap-2 text-sm font-bold text-white">
                                <IndianRupee size={14} />
                                {totalAmount.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="grid gap-3 md:grid-cols-3">
                            <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-100">
                              <p className="text-[11px] text-slate-400">
                                Subtotal
                              </p>
                              <p className="mt-1 text-sm font-semibold text-slate-800">
                                ₹{subtotal.toFixed(2)}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-100">
                              <p className="text-[11px] text-slate-400">
                                Lab Payout
                              </p>
                              <p className="mt-1 text-sm font-semibold text-green-700">
                                ₹{labPayout.toFixed(2)}
                              </p>
                            </div>

                            <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-100">
                              <p className="text-[11px] text-slate-400">
                                Transaction ID
                              </p>
                              <p className="mt-1 break-all text-sm font-semibold text-slate-700">
                                {order.transaction_id || "N/A"}
                              </p>
                            </div>
                          </div>

                          <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-100">
                            <p className="text-[11px] text-slate-400">Address</p>
                            <p className="mt-1 text-sm text-slate-700">
                              {order.address || "No address"}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 lg:w-[170px] lg:flex-col lg:items-end">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                            <FlaskConical size={20} />
                          </div>

                          <button
                            onClick={() => navigate(`/labtest-receipt/${order.id}`)}
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white"
                          >
                            <ReceiptText size={15} />
                            Receipt
                          </button>

                          {canPatientCancel && (
                            <button
                              onClick={() => updateLabStatus(order.id, "CANCELLED")}
                              disabled={statusLoading === `${order.id}-CANCELLED`}
                              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-3.5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {statusLoading === `${order.id}-CANCELLED` ? (
                                <Loader2 size={15} className="animate-spin" />
                              ) : (
                                <XCircle size={15} />
                              )}
                              Cancel
                            </button>
                          )}

                          {canDoctorUpdate && (
                            <div className="flex w-full flex-col gap-2">
                              <button
                                onClick={() =>
                                  updateLabStatus(order.id, "SAMPLE_COLLECTED")
                                }
                                disabled={
                                  statusLoading ===
                                  `${order.id}-SAMPLE_COLLECTED`
                                }
                                className="rounded-xl bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white disabled:opacity-60"
                              >
                                Sample Collected
                              </button>

                              <button
                                onClick={() => updateLabStatus(order.id, "PROCESSING")}
                                disabled={
                                  statusLoading === `${order.id}-PROCESSING`
                                }
                                className="rounded-xl bg-amber-500 px-3.5 py-2 text-sm font-semibold text-white disabled:opacity-60"
                              >
                                Processing
                              </button>

                              <button
                                onClick={() => updateLabStatus(order.id, "COMPLETED")}
                                disabled={
                                  statusLoading === `${order.id}-COMPLETED`
                                }
                                className="rounded-xl bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white disabled:opacity-60"
                              >
                                Completed
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {order.items?.length > 0 && (
                        <div className="mt-4 rounded-2xl bg-slate-50 p-3.5">
                          <h4 className="mb-3 text-sm font-bold text-slate-800">
                            Booked Tests
                          </h4>

                          <div className="space-y-2.5">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex flex-col gap-1.5 rounded-xl bg-white px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
                              >
                                <div>
                                  <p className="text-sm font-semibold text-slate-800">
                                    {item.test_name}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    Qty: {item.quantity}
                                  </p>
                                </div>

                                <div className="text-left sm:text-right">
                                  <p className="text-sm font-semibold text-slate-800">
                                    ₹{Number(item.price || 0).toFixed(2)}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    Line Total: ₹
                                    {Number(item.line_total || 0).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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

export default LabtestOrders;