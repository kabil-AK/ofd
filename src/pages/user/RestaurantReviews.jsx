import React, { useEffect, useState } from "react";
import { Star, User } from "lucide-react";

const RestaurantReviews = ({ restaurantId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`https://ofd-backend.onrender.com/api/reviews/restaurant/${restaurantId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch reviews");
        setReviews(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [restaurantId]);

  if (loading) {
    return <p className="text-center text-gray-500 py-6">Loading reviews...</p>;
  }

  if (reviews.length === 0) {
    return <p className="text-center text-gray-500 py-6">No reviews yet.</p>;
  }

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Reviews</h2>
      <div className="space-y-6 h-96 overflow-y-auto">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white shadow-md border border-gray-200 rounded-xl p-5 transition hover:shadow-lg"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-teal-100 text-teal-700 p-2 rounded-full">
                <User size={20} />
              </div>
              <p className="font-medium text-gray-800">{review.userId?.name || "Anonymous"}</p>
            </div>

            <div className="flex items-center gap-1 text-yellow-500 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  fill={i < review.stars ? "#facc15" : "none"}
                  stroke="#facc15"
                />
              ))}
            </div>

            <p className="text-gray-700 text-sm">{review.comment}</p>

            <p className="text-xs text-gray-400 mt-2">
              {new Date(review.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantReviews;
