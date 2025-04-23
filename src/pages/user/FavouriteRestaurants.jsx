import React, { useEffect, useState } from 'react';
import { useAuth } from '../../utils/idb';
import { ArrowRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FavouriteRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {user} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch favorite restaurants based on user's favHotels
    const fetchFavouriteRestaurants = async () => {
      try {
        const response = await fetch('https://ofd-backend.onrender.com/api/restaurants/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            restaurantIds: user.favHotels,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch favorite restaurants');
        }

        const data = await response.json();
        setRestaurants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user.favHotels && user.favHotels.length > 0) {
      fetchFavouriteRestaurants();
    }
  }, [user.favHotels]);

  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {restaurants.length > 0 ? (
       
          restaurants.map((restaurant) => (
            <div className="bg-white w-1/2 rounded-xl shadow-md overflow-hidden"
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

                    
                  </div>

                </div>
          ))
        
      ) : (
        <p>No favorite restaurants found.</p>
      )}
    </div>
  );
};

export default FavouriteRestaurants;
