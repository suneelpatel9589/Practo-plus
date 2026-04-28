import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  MapPin,
  Phone,
  Printer,
  User,
  FlaskConical,
  BadgeCheck,
  ReceiptText,
  Stethoscope,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";

function LabtestReceipt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access") || localStorage.getItem("token");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReceipt();
  }, [id]);

  async function fetchReceipt() {
    try {
      setLoading(true);

      const res = await API.get(`/lab-orders/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrder(res.data);
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Failed to fetch lab test receipt. Please try again."
      );
    } finally {
      setLoading(false);
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

    if (value === "COMPLETED" || value === "BOOKED") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (value === "CANCELLED") {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    if (value === "PROCESSING" || value === "SAMPLE_COLLECTED") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  function getPaymentStatusColor(status) {
    const value = String(status || "").toUpperCase();

    if (value === "SUCCESS") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (value === "FAILED") {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }

    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  function getPaymentStatusIcon(status) {
    const value = String(status || "").toUpperCase();

    if (value === "SUCCESS") return <CheckCircle2 size={13} />;
    if (value === "FAILED") return <XCircle size={13} />;

    return <Clock3 size={13} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="mx-auto max-w-4xl rounded-[22px] bg-white p-8 text-center shadow-md">
          <p className="text-base font-semibold text-slate-700">
            Loading receipt...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="mx-auto max-w-4xl rounded-[22px] bg-white p-8 text-center shadow-md">
          <p className="text-base font-semibold text-slate-700">
            Receipt not found
          </p>
          <button
            onClick={() => navigate("/labtest-orders")}
            className="mt-4 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Go to Orders
          </button>
        </div>
      </div>
    );
  }

  const subtotal = Number(order.subtotal_amount || 0);
  const commission = Number(order.commission_amount || 0);
  const labPayout = Number(order.lab_payout || 0);
  const totalAmount = Number(order.total_amount || 0);
  const totalItems =
    order.items?.reduce((sum, item) => sum + Number(item.quantity || 1), 0) ||
    0;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.10),_transparent_32%),linear-gradient(to_bottom,_#f8fafc,_#eef6ff)] px-3 py-4 print:bg-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
          <button
            onClick={() => navigate("/labtest-orders")}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm"
          >
            <ArrowLeft size={15} />
            Back to Orders
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Printer size={15} />
            Print Receipt
          </button>
        </div>

        <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] print:shadow-none">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-5 text-white sm:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold">
                  <ReceiptText size={13} />
                  Booking Receipt
                </div>

                <h1 className="mt-3 text-2xl font-bold">Lab Test Receipt</h1>
              </div>

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
          </div>

          <div className="p-4 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] text-slate-400">Booking ID</p>
                <p className="mt-1 text-sm font-bold text-slate-800">
                  {order.id}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] text-slate-400">Booking Date</p>
                <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <CalendarDays size={14} />
                  {formatDate(order.booking_date)}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] text-slate-400">Payment Type</p>
                <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <CreditCard size={14} />
                  {getPaymentLabel(order.payment_method)}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] text-slate-400">Transaction ID</p>
                <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                  {order.transaction_id || "N/A"}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[22px] border border-slate-100 p-4">
                <p className="mb-3 text-sm font-bold text-slate-800">
                  Customer Details
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-[11px] text-slate-400">Customer Name</p>
                    <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <User size={14} />
                      {order.full_name || "Customer"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-[11px] text-slate-400">Phone</p>
                    <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <Phone size={14} />
                      {order.phone || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3 sm:col-span-2">
                    <p className="text-[11px] text-slate-400">Address</p>
                    <p className="mt-1 flex items-start gap-2 text-sm font-semibold text-slate-800">
                      <MapPin size={14} className="mt-0.5" />
                      <span>{order.address || "No address"}</span>
                    </p>
                  </div>
                </div>

                {order.doctor_name && (
                  <div className="mt-4 rounded-2xl bg-slate-50 p-3">
                    <p className="text-[11px] text-slate-400">
                      Selected Doctor
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <Stethoscope size={14} />
                      {order.doctor_name}
                    </p>
                  </div>
                )}
              </div>

              <div className="rounded-[22px] border border-slate-100 p-4">
                <p className="mb-3 text-sm font-bold text-slate-800">
                  Payment Summary
                </p>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span className="text-sm text-slate-600">Total Tests</span>
                    <span className="font-bold text-slate-800">
                      {totalItems}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span className="text-sm text-slate-600">Subtotal</span>
                    <span className="font-bold text-slate-800">
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-sky-50 px-4 py-3">
                    <span className="text-sm text-slate-600">Commission</span>
                    <span className="font-bold text-orange-600">
                      ₹{commission.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-green-50 px-4 py-3">
                    <span className="text-sm text-slate-600">Lab Payout</span>
                    <span className="font-bold text-green-700">
                      ₹{labPayout.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-3">
                    <span className="text-sm text-slate-200">Grand Total</span>
                    <span className="font-bold text-white">
                      ₹{totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-[22px] border border-slate-100 p-4">
              <p className="mb-3 text-sm font-bold text-slate-800">
                Booked Tests
              </p>

              {order.items?.length > 0 ? (
                <div className="space-y-2.5">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 rounded-2xl bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                          <FlaskConical size={17} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {item.test_name}
                          </p>
                          <p className="text-xs text-slate-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-sm font-bold text-slate-800">
                          ₹{Number(item.line_total || 0).toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-500">
                          Rate: ₹{Number(item.price || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                  No tests found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LabtestReceipt;