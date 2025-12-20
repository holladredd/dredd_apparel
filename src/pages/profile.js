import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import {
  FiUser,
  FiShoppingBag,
  FiSettings,
  FiHeart,
  FiCamera,
} from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("orders");
  const { isAuthenticated, loading: authLoading, updateProfile } = useAuth();
  const { orders, fetchOrders } = useCart();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const {
    data: user,
    isLoading: userIsLoading,
    isError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const { data } = await api.get("auth/me/");
        return data.user;
      } catch (error) {
        console.error("Failed to fetch user profile", error);
        return null;
      }
    },
    enabled: isAuthenticated,
  });

  const loading = authLoading || (isAuthenticated && userIsLoading);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, fetchOrders]);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);
      await updateProfile(formData);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Could not load user profile.</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "orders":
        return <OrderHistory orders={orders || []} />;
      case "wishlist":
        return <Wishlist wishlist={user?.wishlist || []} />;
      case "details":
        return <AccountDetails user={user} />;
      case "settings":
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-10 sm:mb-12">
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-200">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-600">
                    {user.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                className="hidden"
                accept="image/*"
              />
              <button
                onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
                aria-label="Change avatar"
              >
                <FiCamera className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-widest">
                {user?.firstName || user?.username}
              </h1>
              <p className="text-sm sm:text-md tracking-wider text-gray-600">
                {user?.email}
              </p>
              <p className="text-sm sm:text-md tracking-wider text-gray-600">
                Balance: ${user?.balance?.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap border-b border-gray-200 mb-8">
            <Tab
              label="Order History"
              icon={<FiShoppingBag />}
              isActive={activeTab === "orders"}
              onClick={() => setActiveTab("orders")}
            />
            <Tab
              label="Wishlist"
              icon={<FiHeart />}
              isActive={activeTab === "wishlist"}
              onClick={() => setActiveTab("wishlist")}
            />
            <Tab
              label="Account Details"
              icon={<FiUser />}
              isActive={activeTab === "details"}
              onClick={() => setActiveTab("details")}
            />
            <Tab
              label="Settings"
              icon={<FiSettings />}
              isActive={activeTab === "settings"}
              onClick={() => setActiveTab("settings")}
            />
          </div>

          {/* Tab Content */}
          <div className="mt-8">{renderContent()}</div>
        </motion.div>
      </section>
    </div>
  );
}

const Tab = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm tracking-widest transition ${
      isActive
        ? "border-b-2 border-black font-semibold"
        : "text-gray-500 hover:text-black"
    }`}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

const OrderHistory = ({ orders }) => (
  <div className="space-y-6">
    {orders.length > 0 ? (
      orders.map((order) => (
        <div key={order._id} className="p-4 sm:p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
            <div>
              <h3 className="font-bold tracking-widest text-sm">
                ORDER #{order.orderId}
              </h3>
              <p className="text-xs tracking-widest text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p
                className={`text-xs font-semibold tracking-widest p-1 px-2 ${
                  order.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {order.status}
              </p>
              <p className="text-sm font-bold tracking-widest mt-1">
                ${order.total.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover"
                  />
                  <div>
                    <h4 className="font-semibold tracking-widest text-xs">
                      {item.product.name}
                    </h4>
                    <p className="text-xs tracking-widest text-gray-500">
                      {item.product.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs tracking-widest">
                    Qty: {item.quantity}
                  </p>
                  <p className="text-xs tracking-widest">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))
    ) : (
      <p className="text-center tracking-widest text-gray-500">
        You have no orders.
      </p>
    )}
  </div>
);

const Wishlist = ({ wishlist }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {wishlist.length > 0 ? (
      wishlist.map((item) => (
        <div key={item._id} className="border border-gray-100 p-4">
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-48 object-cover mb-4"
          />
          <h3 className="font-semibold tracking-widest text-sm">{item.name}</h3>
          <p className="text-xs tracking-widest text-gray-500">
            {item.category}
          </p>
          <p className="text-sm font-bold tracking-widest mt-2">
            ${item.price.toFixed(2)}
          </p>
        </div>
      ))
    ) : (
      <p className="text-center tracking-widest text-gray-500 col-span-full">
        Your wishlist is empty.
      </p>
    )}
  </div>
);

const AccountDetails = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });
  const { updateProfile } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold tracking-widest">Account Details</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs tracking-widest font-semibold"
        >
          {isEditing ? "CANCEL" : "EDIT"}
        </button>
      </div>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-xs tracking-widest mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-xs tracking-widest mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-xs tracking-widest mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 bg-gray-100"
              disabled
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 tracking-widest"
          >
            SAVE CHANGES
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs tracking-widest text-gray-500">
                First Name
              </p>
              <p className="font-semibold tracking-wider">{user?.firstName}</p>
            </div>
            <div>
              <p className="text-xs tracking-widest text-gray-500">Last Name</p>
              <p className="font-semibold tracking-wider">{user?.lastName}</p>
            </div>
          </div>
          <div>
            <p className="text-xs tracking-widest text-gray-500">Email</p>
            <p className="font-semibold tracking-wider">{user?.email}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const Settings = () => (
  <div className="max-w-lg mx-auto">
    <h2 className="text-lg font-bold tracking-widest mb-6">Settings</h2>
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold tracking-widest">Notifications</h3>
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm tracking-wider">Email Notifications</p>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm tracking-wider">SMS Notifications</p>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
      <div>
        <h3 className="font-semibold tracking-widest">Password</h3>
        <button className="text-xs tracking-widest font-semibold mt-2">
          CHANGE PASSWORD
        </button>
      </div>
      <div>
        <h3 className="font-semibold tracking-widest">Language</h3>
        <select className="w-full p-2 border border-gray-300 mt-2">
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
        </select>
      </div>
    </div>
  </div>
);
