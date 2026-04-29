import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  MapPin,
  Phone,
  User,
  CreditCard,
  ArrowLeft,
  FlaskConical,
  Stethoscope,
} from "lucide-react";

function LabtestCheckout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access") || localStorage.getItem("token");
  const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const cart = JSON.parse(localStorage.getItem("labtest_cart") || "[]");

  const COMMISSION_RATE = 0.08;
  const API_BASE = "http://127.0.0.1:8000";

  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  const [form, setForm] = useState({
    doctor: "",
    full_name:
      `${savedUser.first_name || ""} ${savedUser.last_name || ""}`.trim() ||
      savedUser.username ||
      "",
    phone: savedUser.phone || "",
    address: "",
    city: "",
    pincode: "",
    payment_method: "COD",
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  async function fetchDoctors() {
    try {
      setLoadingDoctors(true);
      const res = await axios.get(`${API_BASE}/doctors/`);
      setDoctors(res.data || []);
    } catch (error) {
      console.error("Doctors fetch error:", error.response?.data || error.message);
      toast.error("Failed to fetch doctors. Please try again.");
    } finally {
      setLoadingDoctors(false);
    }
  }

  const selectedDoctorData = doctors.find(
    (item) => String(item.id) === String(form.doctor)
  );

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0),
    [cart]
  );

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum + Number(item.price || 0) * Number(item.quantity || 1),
        0
      ),
    [cart]
  );

  const commission = useMemo(() => subtotal * COMMISSION_RATE, [subtotal]);
  const total = useMemo(() => subtotal + commission, [subtotal, commission]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function startRazorpayPayment({
    paymentId,
    token,
    title = "Lab Test Service",
    description = "Lab Test Payment",
    onSuccess,
  }) {
    if (!window.Razorpay) {
      alert("Razorpay script load nahi hui");
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

            if (onSuccess) {
              onSuccess(verifyRes.data);
            }
          } catch (error) {
            console.error("Verify error:", error.response?.data || error.message);
            alert(
              error.response?.data?.error ||
                error.response?.data?.detail ||
                "Payment verify nahi hua"
            );
          }
        },

        modal: {
          ondismiss: function () {
            alert("Payment popup band ho gaya");
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
      alert(
        error.response?.data?.error ||
          error.response?.data?.detail ||
          "Online payment start nahi hua"
      );
    }
  }

  async function placeOrder() {
    if (!token) {
      alert("Login required");
      navigate("/login");
      return;
    }

    if (!form.doctor) {
      alert("Doctor select karo");
      return;
    }

    if (!form.full_name || !form.phone || !form.address || !form.city || !form.pincode) {
      alert("Please fill all fields");
      return;
    }

    if (cart.length === 0) {
      alert("No lab tests selected");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        doctor: Number(form.doctor),
        full_name: form.full_name,
        phone: form.phone,
        address: `${form.address}, ${form.city}, ${form.pincode}`,
        payment_method: form.payment_method,
        items: cart.map((item) => ({
          test_name: item.name,
          quantity: Number(item.quantity || 1),
          price: Number(item.price || 0),
        })),
      };

      const res = await axios.post(`${API_BASE}/lab-orders/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (form.payment_method === "ONLINE") {
        const paymentId = res.data?.payment_id;

        if (!paymentId) {
          alert("Payment id nahi mila");
          return;
        }

        await startRazorpayPayment({
          paymentId,
          token,
          onSuccess: (data) => {
            localStorage.removeItem("labtest_cart");

            alert(
              `${data?.message || "Payment successful and order successfully booked"}`
            );

            const orderId = res.data?.id;
            if (orderId) {
              navigate(`/labtest-receipt/${orderId}`);
            } else {
              navigate("/labtest-orders");
            }
          },
        });

        return;
      }

      localStorage.removeItem("labtest_cart");
      alert(res.data?.message || "Order successfully booked");

      const orderId = res.data?.id;
      if (orderId) {
        navigate(`/labtest-receipt/${orderId}`);
      } else {
        navigate("/labtest-orders");
      }
    } catch (error) {
      console.error("Lab order create error:", error.response?.data || error.message);

      alert(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          error.response?.data?.items?.[0] ||
          error.response?.data?.doctor?.[0] ||
          "Booking nahi hui"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Lab Test Checkout</h1>
          </div>

          <button
            onClick={() => navigate("/labtest")}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Back to Lab Tests
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-[30px] bg-white p-6 shadow-md ring-1 ring-slate-100">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                <FlaskConical size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Sample Collection Details</h2>
              </div>
            </div>

            <div className="mb-4">
              <label className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-600">
                <Stethoscope size={16} />
                Select Doctor
              </label>
              <select
                name="doctor"
                value={form.doctor}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
              >
                <option value="">Choose doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.doctor_name} - {doctor.specialization}
                  </option>
                ))}
              </select>
              {loadingDoctors && (
                <p className="mt-2 text-xs text-slate-500">Loading doctors...</p>
              )}
            </div>

            {selectedDoctorData && (
              <div className="mb-4 rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Selected Doctor</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {selectedDoctorData.doctor_name}
                </p>
                <p className="text-xs text-slate-500">
                  {selectedDoctorData.specialization}
                </p>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">
                  Full Name
                </label>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <User size={18} className="text-slate-400" />
                  <input
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">
                  Phone
                </label>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <Phone size={18} className="text-slate-400" />
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-slate-600">
                Address
              </label>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <MapPin size={18} className="text-slate-400" />
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="House no, street, area"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-slate-600">
                Payment Method
              </label>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <CreditCard size={18} className="text-slate-400" />
                <select
                  name="payment_method"
                  value={form.payment_method}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm outline-none"
                >
                  <option value="COD">Cash on Collection</option>
                  <option value="ONLINE">Online Payment</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] bg-white p-6 shadow-md ring-1 ring-slate-100">
            <h2 className="text-xl font-bold text-slate-800">Booking Summary</h2>

            {selectedDoctorData && (
              <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Doctor</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {selectedDoctorData.doctor_name}
                </p>
              </div>
            )}

            <div className="mt-4 space-y-3">
              {cart.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                  No lab tests selected.
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-semibold">{item.name}</h4>
                      <p className="truncate text-xs text-slate-500">{item.report}</p>
                      <p className="mt-1 text-sm font-bold">
                        ₹{item.price} x {item.quantity || 1}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Tests</span>
                <span className="font-semibold">{totalItems}</span>
              </div>

              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-slate-500">Commission (8%)</span>
                <span className="font-semibold text-orange-600">
                  ₹{commission.toFixed(2)}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold">₹{total.toFixed(2)}</span>
              </div>

              <button
                onClick={placeOrder}
                disabled={loading || cart.length === 0}
                className="mt-4 w-full rounded-2xl bg-sky-600 py-3 font-semibold text-white shadow-lg transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : form.payment_method === "ONLINE"
                  ? "Pay & Confirm Booking"
                  : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LabtestCheckout;