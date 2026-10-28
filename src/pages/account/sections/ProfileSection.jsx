import "./ProfileSection.css";

const ProfileSection = ({ user }) => {
  return (
    <section className="account-profile">
      <div className="account-profile-header">
        {user?.picture ? (
          <img
            src={user.picture}
            alt="Profile"
            className="account-avatar"
          />
        ) : (
          <div className="account-avatar account-avatar-placeholder">
            {user?.name?.charAt(0) || "U"}
          </div>
        )}

        <div className="account-user-details">
          <h2>{user?.name || "Style Box customer"}</h2>
          <p>{user?.email || "Email not available"}</p>
        </div>
      </div>

      <div className="account-divider" />

      <div className="account-detail">
        <span>Nickname</span>
        <strong>{user?.nickname || "—"}</strong>
      </div>

      <div className="account-detail">
        <span>Email verified</span>
        <strong>
          {user?.email_verified ? "Yes" : "Not verified"}
        </strong>
      </div>
    </section>
  );
};

export default ProfileSection;
