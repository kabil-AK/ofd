import React, { useEffect, useState } from "react";
import { useAuth } from "../../utils/idb";
import toast from "react-hot-toast";
import { CircleMinus, CirclePlus, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [deliveryInstructions, setDeliveryInstructions] = useState("");
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deliveryDate, setDeliveryDate] = useState("today");
    const [customDate, setCustomDate] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("payNow");


    const fetchCartItems = async () => {
        if (!user) {
            toast.error("User not logged in");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`https://ofd-backend.onrender.com/api/cart/${user._id}`);
            if (!response.ok) throw new Error("Failed to fetch cart items");
            const data = await response.json();
            setCartItems(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, [user]);

    useEffect(()=>{
        if(!user){
            toast.error('Please login to view your profile!')
            navigate('/')
        }
    },[])

    const updateQuantity = async (menuId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            const response = await fetch("https://ofd-backend.onrender.com/api/cart/update/", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user._id, menuId, quantity: newQuantity }),
            });

            if (!response.ok) throw new Error("Failed to update quantity");

            setCartItems((prev) =>
                prev.map((item) => (item.menuId._id === menuId ? { ...item, quantity: newQuantity } : item))
            );
            toast.success("Quantity updated");
        } catch (err) {
            toast.error(err.message);
        }
    };

    const deleteItem = async (menuId) => {
        try {
            const response = await fetch(`https://ofd-backend.onrender.com/api/cart/${user._id}/${menuId}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete item");

            toast.success("Item removed");
            fetchCartItems();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const getTotal = () => {
        return cartItems.reduce((total, item) => total + item.menuId.price * item.quantity, 0).toFixed(2);
    };

    const handleCheckout = async () => {
        const selectedDate =
            deliveryDate === "custom" && customDate ? customDate : new Date().toISOString().split("T")[0];

        if (!user) {
            toast.error("User not logged in");
            return;

        }

        if (user && (!user.phone || user.phone.trim() === "")) {
            if (!phone) {
                toast.error("Please enter your phone number.");
                return;
            }
        }

        if (user && (!user.address || user.address.trim() === "")) {
            if (!address) {
                toast.error("Please enter your address.");
                return;
            }
        }

        const groupedItems = cartItems.reduce((acc, item) => {
            const restId = item.menuId.restaurant;
            if (!acc[restId]) acc[restId] = [];
            acc[restId].push(item);
            return acc;
        }, {});

        if (paymentMethod === "payOnDelivery") {
            for (const restaurantId in groupedItems) {
                try {
                    const res = await fetch("https://ofd-backend.onrender.com/api/orders", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            userId: user._id,
                            name: user.name,
                            email: user.email,
                            phone: (user.phone && user.phone.trim() != "") ? user.phone : phone,
                            address: (user.address && user.address.trim() != "") ? user.address : address,
                            restaurant: restaurantId,
                            deliveryDate: selectedDate,
                            paymentStatus: "pending",
                            items: groupedItems[restaurantId].map((item) => ({
                                menuId: item.menuId._id,
                                quantity: item.quantity,
                            })),
                        }),
                    });
                    if (!res.ok) throw new Error("Order failed");
                    toast.success("Order placed (Pay on Delivery)");
                    navigate("/my-orders")
                    fetchCartItems();
                } catch (err) {
                    toast.error(err.message);
                }
            }
        } else {
            // Razorpay
            const amount = parseFloat(getTotal()) * 100;

            const options = {
                key: "rzp_test_cZGMGPXHmPtg1H", // Replace with your Razorpay key
                amount,
                currency: "INR",
                name: "MealGo",
                description: "Order Payment",
                handler: async function (response) {
                    for (const restaurantId in groupedItems) {
                        try {
                            const res = await fetch("https://ofd-backend.onrender.com/api/orders", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    userId: user._id,
                                    name: user.name,
                                    email: user.email,
                                    phone: (user.phone && user.phone.trim() != "") ? user.phone : phone,
                                    address: (user.address && user.address.trim() != "") ? user.address : address,
                                    restaurant: restaurantId,
                                    deliveryDate: selectedDate,
                                    paymentStatus: "paid",
                                    paymentId: response.razorpay_payment_id,
                                    items: groupedItems[restaurantId].map((item) => ({
                                        menuId: item.menuId._id,
                                        quantity: item.quantity,
                                    })),
                                }),
                            });
                            if (!res.ok) throw new Error("Order failed");
                        } catch (err) {
                            toast.error(err.message);
                        }
                    }
                    toast.success("Order placed and paid!");
                    navigate("/my-orders")
                    fetchCartItems();
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: "#14b8a6",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        }
    };

    if (loading) return <div className="text-center py-10">Loading cart...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;
    if (cartItems.length === 0) return <div className="text-center py-10">Your cart is empty.</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-6 text-center">Your Cart</h1>
            <div className="space-y-6">
                {cartItems.map((item) => (
                    <div key={item._id} className="bg-white shadow-md rounded-lg overflow-hidden p-4 flex items-center space-x-6">
                        <img
                            src={"" + item.menuId.image}
                            alt={item.menuId.name}
                            className="w-24 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800">{item.menuId.name}</h3>
                            <p className="text-gray-600">{item.menuId.description}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <button onClick={() => updateQuantity(item.menuId._id, item.quantity - 1)} className="bg-teal-600 p-2 rounded-full">
                                    <CircleMinus size={18} className="text-white" />
                                </button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.menuId._id, item.quantity + 1)} className="bg-teal-600 p-2 rounded-full">
                                    <CirclePlus size={18} className="text-white" />
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between items-end">
                            <span className="text-xl font-semibold text-teal-600">₹{(item.menuId.price * item.quantity).toFixed(2)}</span>
                            <button onClick={() => deleteItem(item.menuId._id)} className="bg-red-600 p-2 rounded-full">
                                <Trash size={18} className="text-white" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 bg-white shadow-md rounded-xl p-6 space-y-6">
                {/* Delivery Date */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Select Delivery Date</h2>
                    <div className="flex items-center gap-4">
                        {["today", "custom"].map((option) => (
                            <label
                                key={option}
                                className={`px-4 py-2 rounded-lg font-medium cursor-pointer transition ${deliveryDate === option
                                    ? "bg-teal-600 text-white"
                                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="delivery"
                                    value={option}
                                    checked={deliveryDate === option}
                                    onChange={() => setDeliveryDate(option)}
                                    className="hidden"
                                />
                                {option === "today" ? "Today" : "Custom"}
                            </label>
                        ))}
                        {deliveryDate === "custom" && (
                            <input
                                type="date"
                                className="ml-2 px-3 py-2 border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-teal-500"
                                value={customDate}
                                onChange={(e) => setCustomDate(e.target.value)}
                            />
                        )}
                    </div>
                </div>

                {/* Payment Method */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Select Payment Method</h2>
                    <div className="flex items-center gap-4">
                        {[
                            
                            { label: "Pay Now", value: "payNow" },
                            { label: "Pay on Delivery", value: "payOnDelivery" },
                        ].map((method) => (
                            <label
                                key={method.value}
                                className={`px-4 py-2 rounded-lg font-medium cursor-pointer transition ${paymentMethod === method.value
                                    ? "bg-teal-600 text-white"
                                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="payment"
                                    value={method.value}
                                    checked={paymentMethod === method.value}
                                    onChange={() => setPaymentMethod(method.value)}
                                    className="hidden"
                                />
                                {method.label}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-4 bg-white p-6 rounded-2xl shadow-md">
                {user && (!user.phone || user.phone.trim() === "") && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                )}

                {user && (!user.address || user.address.trim() === "") && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Delivery Address
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                )}
                {user && user.address && user.address.trim() !== "" && (
                    <div className="bg-gray-100 p-4 rounded-xl shadow-sm mb-4">
                        <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-500 font-medium mb-1 flex items-center justify-between">Delivery to: </p>
                        <button onClick={()=>{navigate("/profile")}} className="text-sm text-white bg-teal-500 p-1 rounded hover:bg-teal-600 font-semibold">
                            Change address
                        </button>
                        </div>
                        <span className="text-base font-semibold text-gray-800">{user.address}</span>
                    </div>
                )}


                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Instructions (optional)
                    </label>
                    <textarea
                        placeholder="Any special delivery instructions?"
                        value={deliveryInstructions}
                        onChange={(e) => setDeliveryInstructions(e.target.value)}
                        rows={3}
                        className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>


            <div className="mt-6 text-right">
                <h2 className="text-2xl font-bold text-gray-800">Total: ₹{getTotal()}</h2>
            </div>
            <div className="mt-6 flex justify-between">
                <button 
                onClick={()=>{navigate('/restaurants')}}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">
                    Continue Shopping
                </button>
                <button
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Checkout
                </button>
            </div>
        </div>
    );
};

export default Cart;
