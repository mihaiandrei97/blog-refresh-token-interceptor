import React from "react";
import { Link } from "react-router-dom";
import { useAuth, useAuthDispatch } from "../contexts/AuthContext";

export function NavBar() {
  const authState = useAuth();
  const authDispatch = useAuthDispatch();
  console.log(authState);
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
          {!authState.loggedIn ? (
            <Link to="/login" className="contrast">
              <strong>Login</strong>
            </Link>
          ) : (
            <button
              className="contrast"
              onClick={() => authDispatch({ type: "logout" })}
            >
              <strong>Logout</strong>
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
}
