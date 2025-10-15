import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="w-full shadow-md bg-white">
      <div className="flex items-center justify-between h-20 px-6 md:px-10">
        <p className="text-xl font-semibold text-green-600 drop-shadow-md">
          Kube Credential
        </p>

        <nav className="hidden md:flex gap-4">
          <NavLink
            to="/issue"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-green-100 text-green-700 font-semibold"
                  : "text-gray-600"
              }`
            }
          >
            Issue
          </NavLink>
          <NavLink
            to="/verify"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-green-100 text-green-700 font-semibold"
                  : "text-gray-600"
              }`
            }
          >
            Verify
          </NavLink>
        </nav>

        <button
          className="md:hidden bg-white shadow-md rounded-md p-2 text-2xl text-gray-300"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden flex flex-col bg-white w-full px-6 pb-4">
          <NavLink
            to="/issue"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md transition-colors mb-2 ${
                isActive
                  ? "bg-green-100 text-green-700 font-semibold"
                  : "text-gray-600"
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Issue
          </NavLink>
          <NavLink
            to="/verify"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-green-100 text-green-700 font-semibold"
                  : "text-gray-600"
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Verify
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Header;
