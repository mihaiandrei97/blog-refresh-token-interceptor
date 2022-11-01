import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export function NavBar() {
  const logout = useAuthStore((state) => state.logout);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
  return (
    <nav className="container-fluid">
      <ul>
        <li>
          <Link to="/" className="contrast">
            <strong>Home</strong>
          </Link>
        </li>
      </ul>
      <ul>
        <li>
          {!isLoggedIn ? (
            <Link to="/login" className="contrast">
              <strong>Login</strong>
            </Link>
          ) : (
            <button
              className="contrast"
              onClick={() => logout()}
            >
              <strong>Logout</strong>
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
}
