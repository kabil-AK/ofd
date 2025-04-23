import React, { useEffect, useState } from 'react';
import { useAuth } from '../../utils/idb';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, User } from 'lucide-react';
import FavouriteRestaurants from './FavouriteRestaurants';
import FavouriteMenus from './FavouriteMenus';

const MyProfile = () => {
    const { user, login } = useAuth();
    const userId = user?._id; // Assuming you have the user ID from the auth context or state
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        password: '',
        address: '',
        phone: '',
    });
    useEffect(()=>{
        if(!user){
            toast.error('Please login to view your profile!')
            navigate('/')
        }
    },[])
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`https://ofd-backend.onrender.com/api/users/profile/${userId}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch profile');
                }
                const data = await res.json();
                setProfile({
                    ...data.user,
                    password: '', // Do not populate password
                });
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, [userId]);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const res = await fetch(`https://ofd-backend.onrender.com/api/users/profile/${userId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(profile),
                }
            );
            if (!res.ok) {
                throw new Error('Failed to update profile');
            }
            const data = await res.json();
            if (data.status) {
                login(data.user); // Update the user context with the new profile data
                setMessage('Profile updated successfully!');
                toast.success('Profile updated successfully!');
            }

        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage('Error updating profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="bg-white shadow-md rounded-2xl p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">My Account</h2>
          <ul className="space-y-2 text-sm">
            <li
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition ${
                activeTab === 'profile' ? 'bg-teal-600 text-white' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <User size={16} /> Profile
            </li>
            <li
              onClick={() => setActiveTab('favMenus')}
              className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition ${
                activeTab === 'favMenus' ? 'bg-teal-600 text-white' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Star size={16} /> Favourite Menus
            </li>
            <li
              onClick={() => setActiveTab('favRestaurants')}
              className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition ${
                activeTab === 'favRestaurants' ? 'bg-teal-600 text-white' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Heart size={16} /> Favourite Restaurants
            </li>
          </ul>
        </div>
  
        {/* Main Content */}
        <div className="md:col-span-3">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="w-full border p-2 rounded"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full border p-2 rounded bg-gray-100"
                  readOnly
                  disabled
                />
                <input
                  type="password"
                  name="password"
                  value={profile.password}
                  onChange={handleChange}
                  placeholder="New Password (optional)"
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  name="address"
                  value={profile.address || ''}
                  onChange={handleChange}
                  placeholder="Address"
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  name="phone"
                  value={profile.phone || ''}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full border p-2 rounded"
                />
                <button
                  type="submit"
                  className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
                {message && <p className="text-center text-sm mt-2">{message}</p>}
              </form>
            </div>
          )}
  
          {activeTab === 'favMenus' && (
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Favourite Menus</h2>
              <FavouriteMenus />
            </div>
          )}
  
          {activeTab === 'favRestaurants' && (
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Favourite Restaurants</h2>
              <FavouriteRestaurants />
            </div>
          )}
        </div>
      </div>
    );
};

export default MyProfile;
