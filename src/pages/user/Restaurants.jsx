import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, ArrowRight, Heart } from "lucide-react";
import { useAuth } from "../../utils/idb";
import toast from "react-hot-toast";

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, setFavouriteshotels } = useAuth(); // Assuming you have a context or state management for user

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://ofd-backend.onrender.com/api/restaurants/"); // Replace with your API endpoint
      const data = await response.json();
      setRestaurants(data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleAddToFav = async (restaurantId) => {
    if (!user) {
      toast.error("Please login to favorite items.");
      return;
    }
    try {
      const response = await fetch("https://ofd-backend.onrender.com/api/users/fav-hotel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          restaurantId: restaurantId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to favorite item");
      }
      if (data.status) {
        setFavouriteshotels(data.favHotels); // Update the user context with the new favorites
        toast.success(data.message || "Item added to favorites!");
      }


    } catch (error) {
      console.error(error);
      toast.error("Error adding to favorites.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Restaurants</h1>
      {loading ? (
        <div className="text-center text-xl text-gray-600">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants && restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <>


                <div className="bg-white rounded-xl shadow-md overflow-hidden"
                  key={restaurant._id}
                >
                  {/* Banner */}
                  <div className="w-full h-48 bg-gray-200 relative">
                    {restaurant.shop_banner ? (
                      <img
                        src={`${restaurant.shop_banner}`}
                        alt="Shop Banner"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                        No Banner
                      </div>
                    )}
                    {/* restaurant Image */}
                    {restaurant.shop_image && (
                      <img
                        src={`${restaurant.shop_image}`}
                        alt="restaurant"
                        className="w-24 h-24 rounded-full border-4 border-white absolute bottom-[-1.5rem] left-6 shadow-md bg-white"
                      />
                    )}
                  </div>

                  {/* Info Section */}
                  <div className="pt-12 pb-6 px-6 text-gray-800">
                    <h2 className="text-2xl font-bold mb-2">{restaurant.name}</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <span className="font-medium"><MapPin className="h-4 w-4 mr-1" /></span> {restaurant.address}
                      </div>
                    </div>
                  </div>
                  <div className="px-6 pb-4 space-x-2 flex items-center justify-between">
                    <button
                      onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                      className="w-full py-2 flex items-center justify-center bg-teal-600 text-white rounded-lg hover:bg-rose-600 transition"
                    >
                      View Restaurant <ArrowRight className="h-4 w-4 ml-2" />
                    </button>
                    <button
                      onClick={() => navigate(`/menu/${restaurant._id}`)}
                      className="w-full py-2 flex items-center justify-center bg-teal-600 text-white rounded-lg hover:bg-rose-600 transition"
                    >
                      View Menu <ArrowRight className="h-4 w-4 ml-2" />
                    </button>

                    <button
                      onClick={() => handleAddToFav(restaurant._id)}
                      className="text-red-500 hover:text-red-600 transition text-xl"
                      title="Add to Favorites"
                    >
                      <Heart
                        size={22}
                        fill={
                          user?.favHotels?.includes(restaurant._id)
                            ? "currentColor"
                            : "none"
                        }
                        stroke="currentColor"
                      />
                    </button>
                  </div>

                </div>
              </>
            ))
          ) : (
            <div className="col-span-3 text-center text-xl text-gray-600">
              No Restaurants Found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
