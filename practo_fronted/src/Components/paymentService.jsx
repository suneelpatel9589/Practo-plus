import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";
import { toast } from "react-toastify";

async function startRazorpayPayment({
  paymentId,
  token,
  title = "Practo Service",
  description = "Online Payment",
  onSuccess,
}) {
  if (!window.Razorpay) {
    toast.error("Razorpay  not loaded");
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
          toast.success(verifyRes.data?.message || "Payment successful");

          if (onSuccess) {
            onSuccess(verifyRes.data);
          }
        } catch (error) {
          console.error("Verify error:", error.response?.data || error.message);
          toast.error(error.response?.data?.error || "Payment verification failed");
        }
      },
      modal: {
        ondismiss: function () {
          toast.error("Payment cancelled by user");
        },
      },
      theme: {
        color: "#0284c7",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error("Create Razorpay order error:", error.response?.data || error.message);
    toast.error(
      error.response?.data?.error ||
      error.response?.data?.detail ||
      "Failed to initiate payment"
    );
  }
}

export default startRazorpayPayment;