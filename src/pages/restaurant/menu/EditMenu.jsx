import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../../../utils/idb";

export default function EditMenu({ closeModal, menuId, after }) {
  const { hotel } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    current_image: "",
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`https://ofd-backend.onrender.com/api/menus/single/${menuId}`);
        const data = await res.json();
        setFormData({
          title: data.title,
          description: data.description,
          price: data.price,
          category: data.category,
          current_image: data.image,
        });
      } catch (err) {
        toast.error("Failed to fetch menu data");
        closeModal();
      }
    };
    fetchMenu();
  }, [menuId, closeModal]);

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
      const response = await fetch(`https://ofd-backend.onrender.com/api/menus/${menuId}`, {
        method: "PUT",
        body: data,
      });
      const result = await response.json();
      toast.success("Menu updated!");
      closeModal();
      after();
    } catch (err) {
      toast.error("Update failed: " + err.message);
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
        <h2 className="text-xl font-bold mb-6 text-gray-800">Edit Menu Item</h2>
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
            <div>
            {formData.current_image && (
                <img src={""+formData.current_image} width="80px"/>
            )}
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
            </div>
            
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
              Update Menu
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
