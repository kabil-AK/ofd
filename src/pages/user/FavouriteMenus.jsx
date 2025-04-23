import React, { useEffect, useState } from "react";
import { useAuth } from "../../utils/idb";
import { ArrowRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FavouriteMenus = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch favorite restaurants based on user's favHotels
    const fetchFavouriteMenus = async () => {
      try {
        const response = await fetch(
          "https://ofd-backend.onrender.com/api/menus/favorites",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              menuIds: user.favMenus,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch favorite menus");
        }

        const data = await response.json();
        setMenus(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user.favMenus && user.favMenus.length > 0) {
      fetchFavouriteMenus();
    }
  }, [user.favMenus]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {menus.length > 0 ? (
        menus.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
          >
            <div className="relative h-48">
              <img
                src={
                  "" + item.image ||
                  "https://grandseasonscoquitlam.com/img/placeholders/comfort_food_placeholder.png?v=1"
                }
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
                  onClick={() => navigate(`/menu-details/${item._id}`)}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                >
                  View Menu
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No favorite Menus found.</p>
      )}
      </div>
    </div>
  );
};

export default FavouriteMenus;
