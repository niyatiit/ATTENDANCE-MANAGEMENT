import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-10">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        <p className="text-gray-400 text-sm">© {new Date().getFullYear()} MyCodeExpress. All Rights Reserved.</p>
        {/* <div className="flex space-x-6 mt-4 md:mt-0">
          <Link to="/" className="text-gray-400 hover:text-white transition duration-300">Home</Link>
          <Link to="/about" className="text-gray-400 hover:text-white transition duration-300">About</Link>
          <Link to="/contact" className="text-gray-400 hover:text-white transition duration-300">Contact</Link>
        </div> */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="text-gray-400 hover:text-white transition duration-300">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition duration-300">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition duration-300">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
