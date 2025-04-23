import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BellIcon, Trash2 } from 'lucide-react';
import { useAuth } from '../../utils/idb';
import { useNavigate } from 'react-router-dom';

const UserNotifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`https://ofd-backend.onrender.com/api/notifications/User/${user._id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch notifications');
        setNotifications(data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  useEffect(()=>{
    if(!user){
        toast.error('Please login to view your profile!')
        navigate('/')
    }
},[])

  const deleteNotification = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this notification?');
    if (!confirm) return;

    try {
      const res = await fetch(`https://ofd-backend.onrender.com/api/notifications/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete');

      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <BellIcon size={28} /> Notifications
      </h1>

      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No notifications yet.</div>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notif, idx) => (
            <motion.li
              key={notif._id}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow hover:shadow-lg transition relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex justify-between items-start">
                <div className='cursor-pointer'
                onClick={()=>{navigate(`/order-details/${notif.orderId}`)}}
                >
                  <h3 className="text-md font-semibold text-gray-800">{notif.title}</h3>
                  <p className="text-sm text-gray-700">{notif.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notif.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteNotification(notif._id)}
                  className="text-gray-400 hover:text-red-600 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

export default UserNotifications;
