import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/idb";
import { Pen } from "lucide-react";

const RestaurantProfile = () => {
    const navigate = useNavigate();
    const { hotel, hotellogin } = useAuth();
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
        if (!hotel) {
            navigate("/restaurant/login");
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch(`https://ofd-backend.onrender.com/api/restaurants/profile/${hotel._id}`);
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
    }, [hotel, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                [name]: file
            }));
            setImagePreviews((prev) => ({
                ...prev,
                [name]: URL.createObjectURL(file)
            }));
        }
    };

    const handleSave = async () => {
        const data = new FormData();
        for (let key in formData) {
            data.append(key, formData[key]);
        }

        try {
            const res = await fetch(`https://ofd-backend.onrender.com/api/restaurants/profile/${hotel._id}`, {
                method: "PUT",
                body: data
            });
            const result = await res.json();
            console.log("Updated:", result);
            setIsEditing(false);
            setProfile(result);
            if (result.status) {
                hotellogin(result.restaurant); // Update the hotel login state with the new data
            }


        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    if (!profile) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">Restaurant Profile</h1>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-teal-600 flex items-center hover:bg-teal-700 text-white font-medium px-6 py-2 rounded-xl transition duration-300"
                    >
                        <Pen size={18} className="mr-2" /> Edit
                    </button>
                </div>


                <div className="space-y-6">
                    {isEditing ? (
                        <>
                            {["name", "description", "email", "phone", "address"].map((field) => (
                                <div key={field}>
                                    <label className="block text-sm font-semibold text-gray-700 capitalize mb-1">
                                        {field.replace("_", " ")}
                                    </label>
                                    <input
                                        type="text"
                                        name={field}
                                        required
                                        value={formData[field]}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            ))}

                            {["shop_image", "shop_banner"].map((field) => (
                                <div key={field}>
                                    <label className="block text-sm font-semibold text-gray-700 capitalize mb-1">
                                        {field.replace("_", " ")}
                                    </label>
                                    <input
                                        type="file"
                                        name={field}
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full text-sm text-gray-600"
                                    />
                                    {imagePreviews[field] && (
                                        <img
                                            src={"" +imagePreviews[field]}
                                            alt={field}
                                            className="mt-2 h-32 object-cover rounded-md border"
                                        />
                                    )}
                                </div>
                            ))}
                        </>
                    ) : (
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

                    )}
                </div>

                <div className="mt-8 text-center">
                    {isEditing && (
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-xl transition duration-300"
                            >
                                Cancel
                            </button>
                        <button
                            onClick={handleSave}
                            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-xl transition duration-300"
                        >
                            Save
                        </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RestaurantProfile;
