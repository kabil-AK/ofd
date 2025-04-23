import { ArrowRight, MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import appImage from "../../assets/banner.png";
import freedelivery from "../../assets/freedelivery.png";
import { use, useEffect, useState , useRef} from "react";

export default function Home() {
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState([]);
  const inputRef = useRef();

  const handleSearch = async (text) => {
    if (!text) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch('https://ofd-backend.onrender.com/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ search: text }),
      });

      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() !== '') {
      handleSearch(value);
    } else {
      setResults([]);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setFocused(false), 100); // delay to allow click
  };


  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://ofd-backend.onrender.com/api/restaurants/"); // Replace with your API endpoint
      const data = await response.json();
      setHotels(data);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  return (
    <div className="text-black">
      {/* Banner Section */}
      {/* Hero Banner */}
      <section className="relative">
        <div className="h-[400px] hero-banner relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Discover Amazing <br /> Local Restaurants
            </h1>
            <p className="text-xl text-white mb-8 max-w-xl">
              Find the best places to eat near you with our curated selection of
              top-rated restaurants
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleChange}
              onFocus={() => setFocused(true)}
              onBlur={handleBlur}
              placeholder="Search for restaurants or menus"
              className="flex-grow px-6 py-3 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button className="px-6 py-3 bg-white text-teal-600 rounded-md hover:bg-gray-100 transition flex items-center justify-center">
              Search Now
            </button>

            {/* Floating Search Result */}
            {focused && results.length > 0 && (
              <div className="absolute top-[100%] left-0 right-0 bg-white shadow-lg rounded-md mt-2 max-h-64 overflow-auto z-20 text-black">
                {results.map((item) => (
                  <p
                    key={item._id}
                    onClick={() => {
                      setQuery('');
                      setFocused(false);
                      inputRef.current.blur();
                      navigate(
                        item.type === 'restaurant'
                          ? `/restaurant/${item._id}`
                          : `/menu-details/${item._id}`
                      );
                    }}
                    
                    className="block px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                  >
                    {item.type === 'restaurant' ? `🏬 ${item.name}` : `🍽️ ${item.title}`}
                  </p>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-teal-500 rounded-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row items-center">
              <div className="p-8 md:p-12 md:w-1/2">
                <span className="inline-block px-4 py-1 bg-white text-teal-700 rounded-full text-sm font-medium mb-4">
                  Limited Time Offer
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Free Delivery on Your First Order!
                </h2>
                <p className="text-white text-opacity-90 mb-6">
                  Use code WELCOME20 at checkout and enjoy your favorite meals
                  without delivery fees.
                </p>
                <button className="px-6 py-3 bg-white text-teal-700 rounded-full font-medium hover:bg-gray-100 transition">
                  Order Now
                </button>
              </div>
              <div className="md:w-1/2">
                <img
                  src={freedelivery}
                  alt="Promotional banner"
                  className="w-full h-64 md:h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Button to View All Restaurants */}
      {/* Featured Restaurants */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Featured Restaurants
            </h2>
            <button
              onClick={() => navigate("/restaurants")}
              className="px-5 py-2 border border-rose-500 text-rose-500 rounded-full hover:bg-rose-50 transition flex items-center"
            >
              View All Restaurants <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels && hotels.length > 0 ? (
              hotels.slice(0, 6).map((restaurant) => (
                <div
                  className="bg-white  rounded-xl shadow-md overflow-hidden"
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
                    <h2 className="text-2xl font-bold mb-2">
                      {restaurant.name}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <span className="font-medium">
                          <MapPin className="h-4 w-4 mr-1" />
                        </span>{" "}
                        {restaurant.address}
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
              <div className="col-span-3 text-center text-xl text-gray-600">
                No Hotels Found
              </div>
            )}
          </div>
        </div>
      </section>

      {/* App Download Banner */}
      <section className="py-12 bg-teal-600">
        <div className="container mx-auto px-4">
          <div className=" rounded-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row items-center">
              <div className="p-8 md:p-12 md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Get Our Mobile App
                </h2>
                <p className="text-white text-opacity-90 mb-6">
                  Download our app for a better experience. Order food, track
                  delivery, and get exclusive offers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="px-6 py-3 bg-black text-white rounded-lg flex items-center justify-center">
                    <span className="mr-2">App Store</span>
                  </button>
                  <button className="px-6 py-3 bg-black text-white rounded-lg flex items-center justify-center">
                    <span className="mr-2">Google Play</span>
                  </button>
                </div>
              </div>
              <div className="md:w-1/2 p-8">
                <img
                  src={appImage}
                  alt="Mobile app"
                  className="w-full max-w-xs mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
