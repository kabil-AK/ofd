import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../utils/idb';

const ResOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { hotel } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`https://ofd-backend.onrender.com/api/orders/hotel/${hotel._id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch orders');
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (hotel) {
      fetchOrders();
    }
  }, [hotel]);

  if (loading) {
    return <div className="text-center py-10 text-lg font-semibold">Loading orders...</div>;
  }

  if (!orders.length) {
    return <div className="text-center py-10 text-gray-500">No orders found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Restaurant Orders</h1>

      <div className="grid gap-8">
        {orders.map((order) => {
          const total = order.items.reduce((acc, item) => acc + item.menuId.price * item.quantity, 0);

          return (
            <motion.div
              key={order._id}
              className="bg-white border rounded-2xl shadow hover:shadow-xl transition p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                {/* Order Summary */}
                <div className="flex-1 space-y-2">
                  <p className="text-gray-800 font-semibold text-lg">Order #{order._id.slice(-6)}</p>
                  <p className="text-sm text-gray-500">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Customer: {order.name}</p>
                  <p className="text-sm text-gray-600">Phone: {order.phone}</p>
                  <p className="text-sm text-gray-600">Address: {order.address}</p>
                  <p className="text-sm text-gray-600">Delivery: {order.deliveryDate}</p>
                  <p className="text-sm text-gray-600">Payment: <span className={`font-medium ${order.paymentStatus == "paid" ? "bg-green-100 p-1 rounded text-green-700" : "bg-red-100 p-1 rounded text-red-600"}`}>{order.paymentStatus}</span></p>
                  <p className="text-sm text-gray-600">
                    Status: <span className={`font-semibold ${getStatusColor(order.status).text}`}>{order.status}</span>
                  </p>
                </div>

                {/* Order Items */}
                <div className="flex-1 space-y-2">
                  <p className="text-md font-semibold text-gray-700 mb-2">Items:</p>
                  <ul className="space-y-3">
                    {order.items.map((item) => (
                      <li key={item._id} className="flex items-center gap-3">
                        <img
                          src={`${item.menuId.image}`}
                          alt={item.menuId.title}
                          className="w-14 h-14 rounded object-cover border"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{item.menuId.title}</p>
                          <p className="text-sm text-gray-500">₹{item.menuId.price} x {item.quantity}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right Action */}
                <div className="flex flex-col justify-between items-end">
                  <div className="text-xl font-bold text-indigo-700">₹{total}</div>
                  <button
                    onClick={() => navigate(`/restaurant/orders/${order._id}`)}
                    className="mt-4 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return { text: 'text-yellow-600' };
    case 'accepted': return { text: 'text-blue-600' };
    case 'preparing': return { text: 'text-orange-600' };
    case 'out for delivery': return { text: 'text-indigo-600' };
    case 'delivered': return { text: 'text-green-600' };
    case 'cancelled': return { text: 'text-red-600' };
    default: return { text: 'text-gray-500' };
  }
};

export default ResOrders;
