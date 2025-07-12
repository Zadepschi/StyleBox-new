import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = ({ setMenuOpen, closeDropdown }) => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    if (setMenuOpen) setMenuOpen(false);
    if (closeDropdown) closeDropdown();
    loginWithRedirect(); 
  };

  return <span onClick={handleLogin} style={{ cursor: "pointer" }}>Login</span>;
};

export default LoginButton;
