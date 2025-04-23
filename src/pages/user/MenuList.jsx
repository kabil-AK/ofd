import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../utils/idb";
import toast from "react-hot-toast";
import { Star } from "lucide-react";

const MenuList = () => {
    const { restaurantId } = useParams(); // Get the restaurant ID from the URL params
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, setFavourites } = useAuth()

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await fetch(`https://ofd-backend.onrender.com/api/menus/${restaurantId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch menu items");
                }
                const data = await response.json();
                setMenuItems(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchMenuItems();
    }, [restaurantId]);

    const handleAddToCart = async (item) => {
        if (!user) {
            toast.error("Please login to add items to your cart.");
            return;
        }
        try {
            const response = await fetch(`https://ofd-backend.onrender.com/api/cart/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user._id,
                    menuId: item._id,
                    quantity: 1,

                })

            }

            )
            const data = await response.json();
            if (!response.ok) {
                throw new Error("Failed to add item to cart");
            }
            if (data.status) {
                toast.success("Item added to cart successfully!");
            }

        } catch (err) {
            toast.error("Error adding item to cart.");
        }

    }

    const handleAddToFav = async (menuId) => {
        if (!user) {
            toast.error("Please login to favorite items.");
            return;
        }
        try {
            const response = await fetch("https://ofd-backend.onrender.com/api/users/fav-menu", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user._id,
                    menuId: menuId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to favorite item");
            }
            if (data.status) {
                setFavourites(data.favMenus); // Update the user context with the new favorites
                toast.success( data.message || "Item added to favorites!");
            }

            
        } catch (error) {
            console.error(error);
            toast.error("Error adding to favorites.");
        }
    };


    if (loading) return <div className="text-center py-10">Loading menu...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;
    if (menuItems.length === 0) return <div className="text-center py-10">No menu items available.</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {menuItems.map((item) => (
                <div
                    key={item._id}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
                >
                    <div className="relative h-48">
                        <img
                            src={"" + item.image || "https://grandseasonscoquitlam.com/img/placeholders/comfort_food_placeholder.png?v=1"}
                            alt={item.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-5">
                        <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-lg font-semibold text-teal-600">{`₹${item.price}`}</span>
                            <button
                                onClick={() => handleAddToCart(item)}
                                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">
                                Add to Cart
                            </button>
                            <button
                                onClick={() => handleAddToFav(item._id)}
                                className="text-yellow-500 hover:text-yellow-600 transition text-xl"
                                title="Add to Favorites"
                            >
                                <Star
                                    size={22}
                                    fill={
                                        user?.favMenus?.includes(item._id)
                                            ? "currentColor"
                                            : "none"
                                    }
                                    stroke="currentColor"
                                />
                            </button>

                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MenuList;
