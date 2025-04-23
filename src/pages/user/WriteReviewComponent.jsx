import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { toast } from 'react-hot-toast';

const WriteReviewComponent = ({ userId, restaurantId }) => {
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (stars === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    if (comment.trim() === '') {
      toast.error("Comment cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('https://ofd-backend.onrender.com/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, restaurantId, stars, comment }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit review');
      toast.success('Review submitted!');
      setStars(0);
      setHover(0);
      setComment('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 shadow-md rounded-xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Write a Review</h2>

      {/* Stars */}
      <div className="flex items-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={28}
            className={`cursor-pointer transition-colors ${
              (hover || stars) >= star ? 'text-yellow-500' : 'text-gray-300'
            }`}
            onClick={() => setStars(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            fill={(hover || stars) >= star ? 'currentColor' : 'none'}
          />
        ))}
      </div>

      {/* Comment */}
      <textarea
        rows="4"
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
        placeholder="Leave your comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="mt-4 bg-teal-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default WriteReviewComponent;
