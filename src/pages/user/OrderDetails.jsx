import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, BadgeCheck, Store } from "lucide-react";
import WriteReviewComponent from "./WriteReviewComponent";
import { useAuth } from "../../utils/idb";

const OrderDetails = () => {
  const { id } = useParams();
  const {user} = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [writeReview, setWriteReview] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`https://ofd-backend.onrender.com/api/orders/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch order");
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-10 text-xl font-semibold">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-10 text-red-500 font-semibold">
        Order not found.
      </div>
    );
  }

  const totalAmount = order.items.reduce(
    (acc, item) => acc + item.menuId.price * item.quantity,
    0
  );

  const steps = [
    "pending",
    "accepted",
    "preparing",
    "out for delivery",
    "delivered",
  ];

  const handleRazorpayPayment = async () => {
    const amount = order.items.reduce((acc, item) => acc + item.menuId.price * item.quantity, 0) * 100;
  
    const options = {
      key: "rzp_test_cZGMGPXHmPtg1H", // Replace with your actual key
      amount,
      currency: "INR",
      name: "MealGo",
      description: `Payment for Order #${order._id.slice(-6)}`,
      handler: async function (response) {
        try {
          const res = await fetch(`https://ofd-backend.onrender.com/api/orders/${order._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              paymentStatus: 'paid',
              paymentId: response.razorpay_payment_id,
            }),
          });
  
          if (!res.ok) throw new Error("Failed to update payment");
  
          toast.success("Payment successful! Order updated.");
          // Optionally: Refresh order details
          window.location.reload();
        } catch (err) {
          toast.error("Payment succeeded but update failed.");
          console.error(err);
        }
      },
      prefill: {
        name: order.name,
        email: order.email,
      },
      theme: {
        color: "#14b8a6",
      },
    };
  
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  
  return (
    <motion.div
      className="max-w-3xl mx-auto px-4 py-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 hover:underline transition mb-6"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <h1 className="text-4xl font-extrabold mb-8 text-gray-800">
        Order Details
      </h1>

      <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200 space-y-8 transition-all duration-300">
        {/* Top Info */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-700">
              Order #{order._id.slice(-6)}
            </h2>
            <p className="text-sm text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>

            {/* Restaurant Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                Restaurant
              </h3>
              <p className="text-gray-700 flex items-center"> <Store size={26} className="mr-2 text-green-600 bg-green-100 p-1 rounded" /> {order.restaurant?.name}</p>
            </div>

            {/* Delivery Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                Delivery Details
              </h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p>
                  <strong>Name:</strong> {order.name}
                </p>
                <p>
                  <strong>Email:</strong> {order.email}
                </p>
                <p>
                  <strong>Phone:</strong> {order.phone}
                </p>
                <p>
                  <strong>Address:</strong> {order.address}
                </p>
                {order.delivery_instructions && (
                  <p>
                    <strong>Instructions:</strong> {order.delivery_instructions}
                  </p>
                )}
                <p>
                  <strong>Delivery Date:</strong> {order.deliveryDate}
                </p>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="md:w-1/2">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Order Progress
            </h3>
            <div className="relative">
              <div className="border-l-4 border-dashed border-gray-300 pl-6 space-y-6">
                {steps.map((step, index) => {
                  const active =
                    order.status === step ||
                    steps.indexOf(step) <= steps.indexOf(order.status);
                  const isCurrent = order.status === step;

                  return (
                    <div key={index} className="relative group">
                      <div
                        className={`absolute -left-[14px] w-4 h-4 rounded-full z-10 border-2 shadow-md
                        ${
                          isCurrent
                            ? "bg-green-600 border-green-800 animate-pulse"
                            : active
                            ? "bg-green-400 border-green-600"
                            : "bg-gray-300 border-gray-400"
                        }
                      `}
                      ></div>
                      <div className="ml-2">
                        <p
                          className={`text-sm font-medium transition-all duration-300 
                          ${
                            isCurrent
                              ? "text-green-800"
                              : active
                              ? "text-gray-800"
                              : "text-gray-400"
                          }`}
                        >
                          {step.charAt(0).toUpperCase() + step.slice(1)}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {order.status === "cancelled" && (
                  <div className="relative group">
                    <div className="absolute -left-[14px] w-4 h-4 rounded-full z-10 border-2 shadow-md bg-red-500 border-red-600 animate-pulse"></div>
                    <div className="ml-2">
                      <p className="text-sm font-medium text-red-700">
                        Cancelled
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            Ordered Items
          </h3>
          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
            {order.items.map((item, index) => (
              <li key={index}>
                {item.menuId.title} × {item.quantity} — ₹
                {item.menuId.price * item.quantity}
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Info */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-4 border-t mt-4">
          <div>
            <p className="text-sm">
              <strong>Payment Status:</strong>{" "}
              <span
                className={
                  order.paymentStatus === "paid"
                    ? "text-green-600 flex items-center space-x-2"
                    : "text-red-500"
                }
              >
                {order.paymentStatus}
                {order.paymentStatus === "paid" && (
                  <BadgeCheck size={16} className="text-green-600 ml-2" />
                )}
              </span>
            </p>
            {order.paymentStatus === "pending" && (
              <button
                onClick={handleRazorpayPayment}
                className="mt-2 px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition"
              >
                Pay Now
              </button>
            )}

            {order.paymentId && (
              <p className="text-sm text-gray-500">
                Payment ID: {order.paymentId}
              </p>
            )}
          </div>
          <div className="text-lg font-bold text-gray-800 mt-3 md:mt-0">
            Total: ₹{totalAmount}
          </div>
        </div>

        {order.status === "delivered" && (
  <div className="mt-10 p-6 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm">
    <div className="text-center space-y-2">
      <p className="text-gray-700 font-medium text-lg">
        🎉 Thank you for your order! We hope you enjoyed your meal.
      </p>
      <p className="text-gray-500 text-sm flex justify-center items-center gap-1">
        Would you like to share your experience? 
        <ArrowDown className="ml-1 animate-bounce" size={16} />
      </p>

      <button
        onClick={() => setWriteReview(!writeReview)}
        className="inline-block mt-4 px-6 py-2 bg-teal-600 text-white text-sm font-semibold rounded-xl shadow hover:bg-teal-700 transition"
      >
        {writeReview ? "Hide Review Form" : "Write a Review"}
      </button>
    </div>

    {writeReview && (
      <div className="mt-6">
        <WriteReviewComponent
          userId={user?._id}
          restaurantId={order.restaurant._id}
        />
      </div>
    )}
  </div>
)}

      </div>
    </motion.div>
  );
};

export default OrderDetails;
