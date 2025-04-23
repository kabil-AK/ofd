import { useEffect, useState } from "react";
import { Pencil, Trash2, PlusCircle, RefreshCcw } from "lucide-react";
import AddMenu from "./AddMenu";
import { useAuth } from "../../../utils/idb";
import { AnimatePresence } from "framer-motion";
import EditMenu from "./EditMenu";
import toast from "react-hot-toast";

export default function Menu() {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMenuId, setEditMenuId] = useState(null);
    const [editMenu, setEditMenu] = useState(false);
    const { hotel } = useAuth();

    const fetchMenus = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://ofd-backend.onrender.com/api/menus/${hotel._id}`);
            const data = await response.json();
            setMenus(data);
        } catch (error) {
            console.error("Error fetching menus:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hotel?._id) {
            fetchMenus();
        }
    }, [hotel]);

    const handleEditClick = (menuId) => {
        setEditMenuId(menuId);
        setEditMenu(true);
    }

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this menu?");
        if (!confirmDelete) return;
      
        try {
          const res = await fetch(`https://ofd-backend.onrender.com/api/menus/${id}`, {
            method: "DELETE",
          });
      
          if (res.ok) {
            toast.success("Menu deleted successfully!");
            setMenus((prev) => prev.filter((menu) => menu._id !== id));
          } else {
            toast.error("Failed to delete menu");
          }
        } catch (err) {
          toast.error("Error deleting menu: " + err.message);
        }
      };
      

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Menu List</h2>
                <div className="flex gap-4">
                <button onClick={fetchMenus} className="flex items-center gap-2 text-gray-600 border border-gray-600 px-2 py-1 rounded hover:bg-gray-600 hover:text-white">
                    <RefreshCcw size={20} />
                    Refresh
                </button>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 text-teal-600 border border-teal-600 px-2 py-1 rounded hover:bg-teal-600 hover:text-white">
                    <PlusCircle size={20} />
                    Add Menu
                </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <table className="w-full text-left border border-gray-300 shadow-md rounded-md overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3">Image</th>
                            <th className="p-3">Title</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Description</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(menus && menus.length > 0 ) ? menus.map((menu) => (
                            <tr key={menu._id} className="border-t">
                                <td className="p-3">
                                    {menu.image ? (
                                        <img src={"" +menu.image} alt={menu.title} className="w-12 h-12 object-cover rounded-md" />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">No Image</div>
                                    )}
                                </td>
                                <td className="p-3">{menu.title}</td>
                                <td className="p-3">{menu.category}</td>
                                <td className="p-3">
  {menu.description.split(" ").length > 10
    ? menu.description.split(" ").slice(0, 10).join(" ") + "..."
    : menu.description}
</td>

                                <td className="p-3">₹{menu.price}</td>
                                <td className="p-3 flex gap-x-2">
                                    <button 
                                    onClick={() => handleEditClick(menu._id)}
                                    size="sm" className="text-blue-600 hover:underline bg-blue-100 p-1 rounded-full">
                                        <Pencil size={18} />
                                    </button>
                                    <button 
                                    onClick={() => handleDelete(menu._id)}
                                    size="sm" className="text-red-600 hover:underline bg-red-100 p-1 rounded-full">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr className="border-t">
                                <td colSpan="5" className="p-3 text-center text-gray-500">No menus available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
            <AnimatePresence>
                {isModalOpen && <AddMenu closeModal={() => setIsModalOpen(false)} after={fetchMenus} />}
                {editMenu && <EditMenu closeModal={() => setEditMenu(false)} menuId={editMenuId} after={fetchMenus}/>}
            </AnimatePresence>
        </div>
    );
}
