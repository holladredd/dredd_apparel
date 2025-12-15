import React from "react";
import { FaStar } from "react-icons/fa"; // Example icon

const LogoButton = ({ onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg mb-4 ${
        isOpen ? " text-gray-600" : "text-gray-400 hover:bg-gray-200"
      }`}
      title="Logos"
    >
      <FaStar size={24} />
    </button>
  );
};

export default LogoButton;
