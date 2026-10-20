import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = ({ setMenuOpen, closeDropdown }) => {
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    isLoading,
  } = useAuth0();

  const closeMenu = () => {
    if (setMenuOpen) setMenuOpen(false);
    if (closeDropdown) closeDropdown();
  };

  const handleLogin = () => {
    closeMenu();
    loginWithRedirect();
  };

 
const handleLogout = () => {
  closeMenu();

  const returnTo = window.location.origin;

  console.log("Logout returnTo:", returnTo);

  logout({
    logoutParams: {
      returnTo,
    },
  });
};


  if (isLoading) return null;

  return (
    <span
      onClick={isAuthenticated ? handleLogout : handleLogin}
      style={{ cursor: "pointer" }}
    >
      {isAuthenticated ? "Logout" : "Login"}
    </span>
  );
};

export default LoginButton;