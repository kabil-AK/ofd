import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../utils/idb";
import { Star } from "lucide-react";

const MenuDetails = () => {
  const { menuId } = useParams(); // Get the menu ID from the URL params
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const goBack = () => {
    window.history.back();
  };

  useEffect(() => {
    const fetchMenuDetails = async () => {
      try {
        const res = await fetch(
          `https://ofd-backend.onrender.com/api/menus/single/${menuId}`
        );
        if (!res.ok) throw new Error("Failed to fetch menu details");

        const data = await res.json();
        setMenu(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (menuId) {
      fetchMenuDetails();
    }
  }, [menuId]);

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
        }),
      });
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
  };

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!menu) return <div>No menu found.</div>;

  return (
    <div className="p-4">
      <button
        onClick={goBack}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Back
      </button>

      <div className="bg-white w-64 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
        <div className="relative h-48 w-54">
          <img
            src={
              "" + menu.image ||
              "https://grandseasonscoquitlam.com/img/placeholders/comfort_food_placeholder.png?v=1"
            }
            alt={menu.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-800">{menu.title}</h3>
          <p className="text-gray-600">{menu.description}</p>
          <div className="flex justify-between menus-center mt-4">
            <span className="text-lg font-semibold text-teal-600">{`₹${menu.price}`}</span>
            <button
              onClick={() => handleAddToCart(menu)}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={() => handleAddToFav(menu._id)}
              className="text-yellow-500 hover:text-yellow-600 transition text-xl"
              title="Add to Favorites"
            >
              <Star
                size={22}
                fill={
                  user?.favMenus?.includes(menu._id) ? "currentColor" : "none"
                }
                stroke="currentColor"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDetails;
