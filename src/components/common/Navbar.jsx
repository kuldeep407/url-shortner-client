import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Menu, X } from "lucide-react"; 

export default function Navbar() {
  const { token, logoutUser } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLoggedIn = !!token;

  const handleLogout = () => {
    logoutUser();
    setIsMenuOpen(false);
  };

  return (
    <nav className="w-full shadow-lg bg-[#f8f8f8] fixed top-0 z-50">
      <div className="w-[90%] mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-lg sm:text-xl font-bold text-[#ff4141]">
          Shortener
        </h1>

        <div className="sm:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } sm:flex flex-col sm:flex-row sm:items-center sm:space-x-8 text-base font-medium absolute sm:static top-full left-0 w-full sm:w-auto bg-[#f8f8f8] sm:bg-transparent px-4 py-4 sm:py-0 z-50`}
        >
          {isLoggedIn && (
            <>
              <NavLink
                to="/short-url"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-2 sm:py-0 cursor-pointer transition-colors ${
                    isActive ? "text-[#ff4141]" : "text-[#252525]"
                  }`
                }
              >
                Short Url
              </NavLink>
              <NavLink
                to="/table"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-2 sm:py-0 cursor-pointer transition-colors ${
                    isActive ? "text-[#ff4141]" : "text-[#252525]"
                  }`
                }
              >
                Table
              </NavLink>
            </>
          )}
          {!isLoggedIn ? (
            <NavLink
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block sm:py-2 border rounded-sm px-4 transition-colors hover:text-[#ff4141] text-[#252525]"
            >
              Login
            </NavLink>
          ) : (
            <button
              onClick={handleLogout}
              className="block sm:py-2 border rounded-sm px-4 transition-colors hover:text-[#ff4141] text-[#252525]"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
