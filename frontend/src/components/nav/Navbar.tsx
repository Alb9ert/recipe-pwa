import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-full h-16 flex px-4 md:px-10 shadow relative">
      {/* Logo */}
      <div className="flex-1 h-full flex items-center">
        <Link to="/" className="text-xl">
          Logo
        </Link>
      </div>
      {/* Desktop Navigation */}
      <div className="hidden md:flex flex-[2] justify-center items-center h-full">
        <div className="flex gap-14">
          <Link to="/" className="cursor-pointer">
            Home
          </Link>
          <Link to="/about" className="cursor-pointer">
            About
          </Link>
          <Link to="/services" className="cursor-pointer">
            Services
          </Link>
        </div>
      </div>
      {/* Desktop Login Button */}
      <div className="hidden md:flex flex-1 justify-end items-center h-full" />
      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button onClick={toggleMenu} className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-b shadow-lg md:hidden z-50">
          <div className="px-4 py-2 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/services"
              className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
