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
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("orders");
  const { isAuthenticated, loading: authLoading, updateProfile } = useAuth();
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
        return <OrderHistory orders={user?.orders || []} />;
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
            <div className="mb-2 sm:mb-0">
              <h3 className="font-semibold tracking-widest text-sm sm:text-base">
                {order._id}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`text-xs sm:text-sm font-semibold px-3 py-1 rounded-full ${
                order.status === "Delivered"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {order.status}
            </span>
          </div>
          <div className="space-y-2 mb-4">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-xs sm:text-sm"
              >
                <span>{item.name}</span>
                <span className="text-gray-600">
                  ${item?.price?.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-end font-bold text-sm sm:text-base pt-2 border-t border-gray-100">
            Total: ${order.total.toFixed(2)}
          </div>
        </div>
      ))
    ) : (
      <p>You have no orders.</p>
    )}
  </div>
);

const Wishlist = ({ wishlist }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
    {wishlist.length > 0 ? (
      wishlist.map((item) => (
        <div key={item._id} className="border border-gray-100 p-4">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-48 sm:h-64 object-cover mb-4"
          />
          <h3 className="font-semibold tracking-widest text-sm sm:text-base">
            {item.name}
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm">
            ${item.price.toFixed(2)}
          </p>
        </div>
      ))
    ) : (
      <p>Your wishlist is empty.</p>
    )}
  </div>
);

const AccountDetails = ({ user }) => {
  const { updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    username: user.username || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    avatar: user.avatar || "",
    shippingAddress: {
      address: user.shippingAddress?.address || "",
      city: user.shippingAddress?.city || "",
      postalCode: user.shippingAddress?.postalCode || "",
      country: user.shippingAddress?.country || "",
    },
    billingAddress: {
      address: user.billingAddress?.address || "",
      city: user.billingAddress?.city || "",
      postalCode: user.billingAddress?.postalCode || "",
      country: user.billingAddress?.country || "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    if (result.success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      username: user.username || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      avatar: user.avatar || "",
      shippingAddress: {
        address: user.shippingAddress?.address || "",
        city: user.shippingAddress?.city || "",
        postalCode: user.shippingAddress?.postalCode || "",
        country: user.shippingAddress?.country || "",
      },
      billingAddress: {
        address: user.billingAddress?.address || "",
        city: user.billingAddress?.city || "",
        postalCode: user.billingAddress?.postalCode || "",
        country: user.billingAddress?.country || "",
      },
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            <InputField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            <InputField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <InputField
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            <InputField
              label="Avatar URL"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
            />
          </div>

          <AddressFields
            title="Shipping Address"
            data={formData.shippingAddress}
            onChange={handleChange}
            namePrefix="shippingAddress"
          />

          <AddressFields
            title="Billing Address"
            data={formData.billingAddress}
            onChange={handleChange}
            namePrefix="billingAddress"
          />

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-black text-white px-8 py-3 tracking-widest hover:bg-gray-800 transition text-sm"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-200 text-black px-8 py-3 tracking-widest hover:bg-gray-300 transition text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div className="flex justify-end">
        <button
          onClick={() => setIsEditing(true)}
          className="bg-black text-white px-6 py-2 tracking-widest hover:bg-gray-800 transition text-sm"
        >
          Edit Profile
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailField label="First Name" value={user.firstName} />
        <DetailField label="Last Name" value={user.lastName} />
        <DetailField label="Username" value={user.username} />
        <DetailField label="Email" value={user.email} />
        <DetailField label="Phone Number" value={user.phoneNumber} />
        <DetailField label="Avatar URL" value={user.avatar} />
      </div>
      <AddressDetail title="Shipping Address" address={user.shippingAddress} />
      <AddressDetail title="Billing Address" address={user.billingAddress} />
    </div>
  );
};

const DetailField = ({ label, value }) => (
  <div>
    <p className="text-xs tracking-widest uppercase text-gray-500">{label}</p>
    <p className="text-sm mt-1">{value || "Not set"}</p>
  </div>
);

const AddressDetail = ({ title, address }) => (
  <div className="space-y-4 border-t pt-6">
    <h3 className="text-lg font-semibold tracking-widest">{title}</h3>
    {!address || Object.values(address).every((v) => !v) ? (
      <p className="text-sm text-gray-500">Not set</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DetailField label="Address" value={address.address} />
        <DetailField label="City" value={address.city} />
        <DetailField label="Postal Code" value={address.postalCode} />
        <DetailField label="Country" value={address.country} />
      </div>
    )}
  </div>
);

const InputField = ({ label, name, type = "text", value, onChange }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-xs tracking-widest mb-1 uppercase"
    >
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-black text-sm"
    />
  </div>
);

const AddressFields = ({ title, data, onChange, namePrefix }) => (
  <div className="space-y-4 border-t pt-6">
    <h3 className="text-lg font-semibold tracking-widest">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputField
        label="Address"
        name={`${namePrefix}.address`}
        value={data.address}
        onChange={onChange}
      />
      <InputField
        label="City"
        name={`${namePrefix}.city`}
        value={data.city}
        onChange={onChange}
      />
      <InputField
        label="Postal Code"
        name={`${namePrefix}.postalCode`}
        value={data.postalCode}
        onChange={onChange}
      />
      <InputField
        label="Country"
        name={`${namePrefix}.country`}
        value={data.country}
        onChange={onChange}
      />
    </div>
  </div>
);

const Settings = () => (
  <div className="max-w-lg space-y-6">
    <div>
      <h3 className="text-base sm:text-lg font-semibold tracking-widest mb-2">
        Password
      </h3>
      <button className="border border-black px-4 sm:px-6 py-2 tracking-widest hover:bg-gray-100 transition text-sm sm:text-base">
        Change Password
      </button>
    </div>
    <div>
      <h3 className="text-base sm:text-lg font-semibold tracking-widest mb-2">
        Notifications
      </h3>
      <label className="flex items-center gap-3">
        <input type="checkbox" className="h-4 w-4" defaultChecked />
        <span className="text-sm sm:text-base">
          Receive marketing emails and promotions.
        </span>
      </label>
    </div>
  </div>
);
