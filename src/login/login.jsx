

import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./Login.css";
import Secret from "./Secret";


const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuth0();

  if (!isAuthenticated) return null;

  return (
    <div className="logout-wrapper">
      <button
        className="logout-btn"
        onClick={() =>
          logout({
            returnTo: "http://localhost:5173"
          })
        }
      >
        Logout
      </button>

      <Secret />
    </div>
  );
};

export default LogoutButton;