import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  CalendarDays,
  Clock3,
  Stethoscope,
  FileText,
  IndianRupee,
  CreditCard,
} from "lucide-react";

function Appoiment() {
  const token = localStorage.getItem("access") || localStorage.getItem("token");
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [booking, setBooking] = useState(false);

  const [form, setForm] = useState({
    doctor: "",
    appointment_date: "",
    symptoms: "",
    payment_method: "COD",
  });

  const API_BASE = "http://127.0.0.1:8000";

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (!form.appointment_date) return;

    const selected = new Date(form.appointment_date);
    const now = new Date();

    if (selected < now) {
      setForm((prev) => ({
        ...prev,
        appointment_date: "",
      }));
      toast.error("please select future date and time");
    }
  }, [form.appointment_date]);

  async function fetchDoctors() {
    try {
      setLoadingDoctors(true);
      const res = await axios.get(`${API_BASE}/doctors/`);
      setDoctors(res.data || []);
    } catch (error) {
      console.error("Doctors fetch error:", error.response?.data || error.message);
      toast.error("doctors not found ");
    } finally {
      setLoadingDoctors(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const selectedDoctor = doctors.find(
    (item) => String(item.id) === String(form.doctor)
  );

  const minDateTime = useMemo(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }, []);

  async function startRazorpayPayment({
    paymentId,
    token,
    title = "Practo Service",
    description = "Doctor Appointment Payment",
    onSuccess,
  }) {
    if (!window.Razorpay) {
      toast.error("Razorpay is not available. Please try again later.");
      return;
    }

    try {
      const orderRes = await axios.post(
        `${API_BASE}/payment-gateway/create-order/`,
        { payment_id: paymentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const orderData = orderRes.data;
      console.log("Create order response:", orderData);

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: title,
        description,
        order_id: orderData.razorpay_order_id,

        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${API_BASE}/payment-gateway/verify/`,
              {
                payment_id: paymentId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            console.log("Verify response:", verifyRes.data);

            if (onSuccess) {
              onSuccess(verifyRes.data);
            }
          } catch (error) {
            console.error("Verify error:", error.response?.data || error.message);
            toast.error(
              error.response?.data?.error ||
                error.response?.data?.detail ||
                "Payment verification failed"
            );
          }
        },

        modal: {
          ondismiss: function () {
            toast.error("Payment process cancelled by user");
          },
        },

        theme: {
          color: "#0284c7",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(
        "Create Razorpay order error:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.detail ||
          "Payment initiation failed"
      );
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!token) {
      toast.error("Login required");
      return;
    }

    if (!form.doctor || !form.appointment_date) {
      toast.error("Doctor and appointment date are required");
      return;
    }

    const selectedDate = new Date(form.appointment_date);
    const now = new Date();

    if (selectedDate < now) {
      toast.error("Please select a future date and time");
      return;
    }

    try {
      setBooking(true);

      const payload = {
        doctor: Number(form.doctor),
        appointment_date: form.appointment_date,
        symptoms: form.symptoms,
        payment_method: form.payment_method,
      };

      const res = await axios.post(`${API_BASE}/appointments/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Appointment response:", res.data);

      if (form.payment_method === "ONLINE") {
        const paymentId = res.data?.payment_id;

        if (!paymentId) {
          toast.error("Payment ID not found, cannot proceed to payment");
          return;
        }

        await startRazorpayPayment({
          paymentId,
          token,
          onSuccess: (data) => {
            setForm({
              doctor: "",
              appointment_date: "",
              symptoms: "",
              payment_method: "COD",
            });

            if (data?.appointment_status === "CONFIRMED") {
              toast.success("Payment successful, appointment confirmed");
              navigate("/my-appointments");
            } else {
              toast.success(data?.message || "Payment successful");
              navigate("/my-appointments");
            }
          },
        });

        return;
      }

      toast.success(res.data?.message || "Appointment booked successfully");

      setForm({
        doctor: "",
        appointment_date: "",
        symptoms: "",
        payment_method: "COD",
      });

      navigate("/my-appointments");
    } catch (error) {
      console.error(
        "Appointment create error:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.detail ||
          error.response?.data?.doctor?.[0] ||
          error.response?.data?.appointment_date?.[0] ||
          error.response?.data?.error ||
          "Failed to book appointment"
      );
    } finally {
      setBooking(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-cyan-50 px-4 py-6 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[32px] bg-white shadow-2xl">
          <div className="bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500 px-6 py-7 text-white">
            <h1 className="text-3xl font-bold">Book Doctor Appointment</h1>
           
          </div>

          <div className="grid gap-6 p-5 md:grid-cols-[1fr_360px] md:p-6">
            <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Stethoscope size={16} />
                    Select Doctor
                  </label>

                  <select
                    name="doctor"
                    value={form.doctor}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
                  >
                    <option value="">Choose doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.doctor_name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <CalendarDays size={16} />
                    Appointment Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="appointment_date"
                    value={form.appointment_date}
                    onChange={handleChange}
                    min={minDateTime}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
                  />
                  
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <FileText size={16} />
                    Symptoms
                  </label>
                  <textarea
                    name="symptoms"
                    rows="5"
                    value={form.symptoms}
                    onChange={handleChange}
                    placeholder="Apni problem ya symptoms likhiye..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <CreditCard size={16} />
                    Payment Method
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`cursor-pointer rounded-2xl border px-4 py-3 text-sm font-medium ${
                        form.payment_method === "COD"
                          ? "border-sky-500 bg-sky-50 text-sky-700"
                          : "border-slate-200 bg-white text-slate-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value="COD"
                        checked={form.payment_method === "COD"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Cash on Delivery
                    </label>

                    <label
                      className={`cursor-pointer rounded-2xl border px-4 py-3 text-sm font-medium ${
                        form.payment_method === "ONLINE"
                          ? "border-sky-500 bg-sky-50 text-sky-700"
                          : "border-slate-200 bg-white text-slate-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value="ONLINE"
                        checked={form.payment_method === "ONLINE"}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Online
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={booking || loadingDoctors}
                  className="w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {booking
                    ? "Processing..."
                    : form.payment_method === "ONLINE"
                    ? "Pay & Book Appointment"
                    : "Book Appointment"}
                </button>
              </form>
            </div>

            <div className="rounded-[28px] border border-slate-100 bg-slate-50/70 p-5 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800">Booking Summary</h3>

              {loadingDoctors ? (
                <div className="mt-4 rounded-2xl bg-white p-4 text-sm text-slate-500">
                  Loading doctors...
                </div>
              ) : !selectedDoctor ? (
                <div className="mt-4 rounded-2xl bg-white p-4 text-sm text-slate-500">
                  Please select a doctor to see details
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                    <p className="text-xs text-slate-400">Doctor</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {selectedDoctor.doctor_name}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                    <p className="text-xs text-slate-400">Specialization</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {selectedDoctor.specialization}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                    <p className="text-xs text-slate-400">Consultation Fee</p>
                    <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-slate-800">
                      <IndianRupee size={14} />
                      {Number(selectedDoctor.consultation_fee || 0).toFixed(2)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-orange-50 px-4 py-3 shadow-sm">
                    <p className="text-xs text-slate-400">Platform Commission (7%)</p>
                    <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-orange-600">
                      <IndianRupee size={14} />
                      {Number(selectedDoctor.commission_amount || 0).toFixed(2)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-900 px-4 py-3 shadow-sm">
                    <p className="text-xs text-slate-300">Total Payable</p>
                    <p className="mt-1 flex items-center gap-1 text-sm font-bold text-white">
                      <IndianRupee size={14} />
                      {(
                        Number(selectedDoctor.consultation_fee || 0) +
                        Number(selectedDoctor.commission_amount || 0)
                      ).toFixed(2)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                    <p className="text-xs text-slate-400">Payment Type</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {form.payment_method === "ONLINE"
                        ? "Online Payment"
                        : "Cash Payment"}
                    </p>
                  </div>

                  {form.appointment_date && (
                    <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                      <p className="text-xs text-slate-400">Selected Time</p>
                      <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                        <Clock3 size={14} />
                        {new Date(form.appointment_date).toLocaleString("en-IN")}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Appoiment;