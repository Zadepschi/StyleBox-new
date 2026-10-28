
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function AccountNav({ setMenuOpen, closeDropdown }) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  const closeMenu = () => {
    setMenuOpen?.(false);
    closeDropdown?.();
  };

  if (isLoading) return null;

 


const handleLogin = async () => {
  closeMenu();

  try {
    await loginWithRedirect({
      appState: {
        returnTo: "/account",
      },
    });
  } catch (error) {
    console.error("Login redirect failed:", error);
  }
};




  if (!isAuthenticated) {
    return (
      <button
        type="button"
        className="account-login"
        onClick={handleLogin}
      >
        Login
      </button>
    );
  }

  return (
    <Link
      to="/account"
      className="account-icon"
      aria-label="My account"
      title="My account"
      onClick={closeMenu}
    >
      <svg
        viewBox="0 0 24 24"
        width="25"
        height="25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    </Link>
  );
}
