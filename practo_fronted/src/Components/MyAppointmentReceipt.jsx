import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, User, Stethoscope, Calendar } from "lucide-react";
import { toast } from "react-toastify";

function MyAppointmentReceipt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access") || localStorage.getItem("token");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReceipt();
  }, []);

  async function fetchReceipt() {
    if (!token) {
      toast.error("Login required");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/appointments/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data);

      // ✅ SUCCESS TOAST
      toast.success("Receipt loaded successfully 📄");
    } catch (err) {
      console.error(err.response?.data || err.message);

      const msg =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Failed to fetch appointment receipt";

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!data) {
    return <div className="p-6 text-center">No data found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-6">
      <div className="mx-auto max-w-3xl">

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">
            Appointment Receipt
          </h1>

          <button
            onClick={() => navigate("/appointments")}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm shadow hover:bg-slate-100"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        {/* CARD */}
        <div className="rounded-2xl bg-white p-6 shadow-md">

          {/* Patient */}
          <div className="mb-4 flex items-center gap-3">
            <User className="text-blue-500" />
            <div>
              <p className="font-semibold">{data.full_name}</p>
              <p className="text-sm text-gray-500">{data.phone}</p>
            </div>
          </div>

          {/* Doctor */}
          <div className="mb-4 flex items-center gap-3">
            <Stethoscope className="text-green-500" />
            <div>
              <p className="font-semibold">{data.doctor_name}</p>
              <p className="text-sm text-gray-500">
                {data.specialization}
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="mb-4 flex items-center gap-3">
            <Calendar className="text-purple-500" />
            <div>
              <p className="font-semibold">{data.date}</p>
              <p className="text-sm text-gray-500">{data.time}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Status</span>
              <span
                className={`font-semibold ${
                  data.payment_status === "SUCCESS"
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              >
                {data.payment_status}
              </span>
            </div>

            <div className="flex justify-between mt-2">
              <span className="text-gray-600">Amount</span>
              <span className="font-bold text-lg">
                ₹{data.amount || 0}
              </span>
            </div>
          </div>

          {/* SUCCESS BOX */}
          <div className="mt-6 rounded-xl bg-green-50 p-4 text-green-700 text-center font-semibold">
            Appointment booked successfully 🎉
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAppointmentReceipt;