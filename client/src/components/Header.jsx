import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">Edtech</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
