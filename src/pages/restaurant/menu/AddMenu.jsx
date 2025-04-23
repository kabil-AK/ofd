import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../utils/idb";

export default function AddMenu({ closeModal, after }) {
    const {hotel} = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("restaurant", hotel._id); 
    if (image) data.append("image", image);

    try {
      const response = await fetch("https://ofd-backend.onrender.com/api/menus/",{
        method: "POST",
        body: data,
      })
      const res = await response.json();
      console.log(res)
      toast.success("Menu added!");
      closeModal();
      after();
    } catch (err) {
      toast.error("Failed to add menu." + err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6"
      >
        <h2 className="text-xl font-bold mb-6 text-gray-800">Add New Menu Item</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6" encType="multipart/form-data">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Menu Title"
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            >
              <option value="">Select Category</option>
              <option value="Pizza">Pizza</option>
              <option value="Burger">Burger</option>
              <option value="Drinks">Drinks</option>
              <option value="Desserts">Desserts</option>
              <option value="Starter">Starter</option>
              <option value="Combo">Combo</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Menu Description"
              rows="3"
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
              name="price"
              value={formData.price}
              onChange={handleChange}
              type="number"
              step="0.01"
              placeholder="Price"
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
              required
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Menu
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
