import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../utils/idb';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`https://ofd-backend.onrender.com/api/orders/user/${user._id}`);
                const data = await res.json();
                if (!res.ok) {
                    throw new Error('Failed to fetch orders');
                }
                setOrders(data);
            } catch (err) {
                console.error('Failed to fetch orders:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user._id]);

    useEffect(()=>{
        if(!user){
            toast.error('Please login to view your profile!')
            navigate('/')
        }
    },[])

    if (loading) {
        return <div className="text-center py-10 text-xl font-semibold">Loading orders...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">My Orders</h1>

            {orders.length === 0 ? (
                <p className="text-gray-500 text-center">You have no orders yet.</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {orders.map((order, idx) => {
                        const totalAmount = order.items.reduce((acc, item) => {
                            return acc + item.menuId.price * item.quantity;
                        }, 0);

                        return (
                            <motion.div
                                key={order._id || idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                                className="bg-white shadow-md rounded-2xl p-5 border"
                            >
                                <h2 className="text-xl font-semibold mb-2">Order #{order._id.slice(-6)}</h2>
                                <p className="text-gray-600 mb-1">
                                    <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-gray-600 mb-1">
                                    <strong>Restaurant:</strong> {order.restaurant.name}
                                </p>
                                <p className="text-gray-600 mb-2">
                                    <strong>Payment:</strong>{' '}
                                    <span className={order.paymentStatus === 'paid' ? 'text-green-600 bg-green-100 px-1 py-0.5 rounded' : 'text-red-500 bg-red-100 px-1 py-0.5 rounded'}>
                                        {order.paymentStatus}
                                    </span>
                                </p>
                                <p className="text-gray-600 mb-1">
                                    <strong>Status</strong> {' '}
                                    <span className={`font-semibold ${order.status === 'delivered' ? 'text-green-600 bg-green-100 p-1 rounded' : order.status === 'pending' ? 'text-yellow-600 bg-yellow-100 p-1 rounded' : 'text-red-600 bg-red-100 p-1 rounded'}`}>
                                        {order.status}
                                    </span>
                                </p>
                                <div className="mt-3">
                                    <h3 className="font-semibold mb-1">Items:</h3>
                                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                                        {order.items.map((item, index) => (
                                            <li key={index}>
                                               {item.menuId.image ? (
                                                <img src={`${item.menuId.image}`} alt={item.menuId.title} className="w-10 h-10 inline-block mr-2 rounded-full" />
                                               ): (
                                                <img src="https://grandseasonscoquitlam.com/img/placeholders/comfort_food_placeholder.png?v=1" alt={item.menuId.title} className="w-10 h-10 inline-block mr-2 rounded-full" />
                                               )} {item.menuId.title} × {item.quantity} — ₹{item.menuId.price * item.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mt-4 text-right font-bold text-lg text-gray-800">
                                    Total: ₹{totalAmount}
                                </div>
                                <div className='mt-4 ' >
                                    <button 
                                    onClick={()=>{navigate(`/order-details/${order._id}`)}}
                                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">
                                        View Details
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
