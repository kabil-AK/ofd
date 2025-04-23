import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../utils/idb";
import { ArrowRight, Heart, Pen } from "lucide-react";
import RestaurantReviews from "./RestaurantReviews";

const ViewRestaurant = () => {
    const navigate = useNavigate();
    const { hotelId } = useParams();
    const { user, setFavouriteshotels } = useAuth(); // Assuming you have a context or state management for user
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        email: "",
        phone: "",
        address: "",
        shop_image: "",
        shop_banner: ""
    });
    const [imagePreviews, setImagePreviews] = useState({
        shop_image: "",
        shop_banner: ""
    });

    useEffect(() => {
        if (!hotelId) {
            navigate("/");
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch(`https://ofd-backend.onrender.com/api/restaurants/profile/${hotelId}`);
                const data = await res.json();
                setProfile(data);
                setFormData({
                    name: data.name || "",
                    description: data.description || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    address: data.address || "",
                    shop_image: data.shop_image || "",
                    shop_banner: data.shop_banner || ""
                });
                setImagePreviews({
                    shop_image: data.shop_image,
                    shop_banner: data.shop_banner
                });
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };

        fetchProfile();
    }, [hotelId, navigate]);

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



    if (!profile) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">{formData?.name ?? "Restaurant Profile"}</h1>

                </div>


                <div className="space-y-6">

                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        {/* Banner */}
                        <div className="w-full h-48 bg-gray-200 relative">
                            {profile.shop_banner ? (
                                <img
                                    src={`${profile.shop_banner}`}
                                    alt="Shop Banner"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                                    No Banner
                                </div>
                            )}
                            {/* Profile Image */}
                            {profile.shop_image && (
                                <img
                                    src={`${profile.shop_image}`}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full border-4 border-white absolute bottom-[-1.5rem] left-6 shadow-md bg-white"
                                />
                            )}
                        </div>

                        {/* Info Section */}
                        <div className="pt-12 pb-6 px-6 text-gray-800">
                            <h2 className="text-2xl font-bold mb-2">{profile.name}</h2>
                            <p className="text-sm text-gray-600 mb-4">{profile.description || "-"}</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium">Email:</span> {profile.email}
                                </div>
                                <div>
                                    <span className="font-medium">Phone:</span> {profile.phone || "-"}
                                </div>
                                <div>
                                    <span className="font-medium">Address:</span> {profile.address}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 pb-4 space-x-2 flex items-center justify-between">
                        <button
                            onClick={() => navigate(`/menu/${hotelId}`)}
                            className="w-full py-2 flex items-center justify-center bg-teal-600 text-white rounded-lg hover:bg-rose-600 transition"
                        >
                            View Menu <ArrowRight className="h-4 w-4 ml-2" />
                        </button>

                        <button
                            onClick={() => handleAddToFav(hotelId)}
                            className="text-red-500 hover:text-red-600 transition text-xl"
                            title="Add to Favorites"
                        >
                            <Heart
                                size={22}
                                fill={
                                    user?.favHotels?.includes(hotelId)
                                        ? "currentColor"
                                        : "none"
                                }
                                stroke="currentColor"
                            />
                        </button>
                    </div>

                    <div className="px-6 pb-4 space-x-2 flex items-center justify-between">
                        
                        <RestaurantReviews restaurantId={hotelId} />
                    </div>
                </div>


            </div>
        </div>
    );
};

export default ViewRestaurant;
