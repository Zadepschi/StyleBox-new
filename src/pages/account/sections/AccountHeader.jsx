import "./AccountHeader.css";

const AccountHeader = ({ user, onLogout }) => {
  return (
    <header className="account-heading">
      <div className="account-heading-content">
        <p className="account-eyebrow">STYLE BOX</p>
        <h1>My Account</h1>
        <p>Welcome back, {user?.name || "Shopper"}!</p>
      </div>

      <button
        type="button"
        className="account-logout-button account-top-logout"
        onClick={onLogout}
      >
        Log Out
      </button>
    </header>
  );
};

export default AccountHeader;
