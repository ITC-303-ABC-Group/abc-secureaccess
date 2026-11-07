import TopNav from "./TopNav";
import ChangePassword from "./ChangePassword";
import { CheckIcon, ClockIcon, UserIcon, UsersIcon } from "./Icons";
import { formatDate, formatDateTime, initial } from "../lib/format";

function UserDashboard({ currentUser, onLogout }) {
  const isAdmin = currentUser.role === "admin";
  const roleName = isAdmin ? "Administrator" : "User";

  const previous = currentUser.previous_login_at
    ? formatDateTime(currentUser.previous_login_at)
    : "This is your first sign-in";

  const profile = [
    ["Username", currentUser.username],
    ["Full name", currentUser.name],
    ["Role", roleName],
    ["Account status", currentUser.status === "suspended" ? "Suspended" : "Active"],
  ];

  const overview = [
    [CheckIcon, "Account status", "Your account is active and can sign in."],
    [UserIcon, "Member since", formatDate(currentUser.created_at)],
    [ClockIcon, "Previous sign-in", previous],
    [UsersIcon, "Access level", `${roleName} access`],
  ];

  return (
    <div className="app-shell">
      <TopNav user={currentUser} onLogout={onLogout} />

      <main className="page">
        <section className="welcome">
          <div>
            <h1>Welcome, {currentUser.name}</h1>
            <p>You are signed in to ABC SecureAccess.</p>
          </div>
          <span className="avatar avatar-xl">{initial(currentUser.name)}</span>
        </section>

        <div className="user-grid">
          <section className="panel profile-card">
            <h2>Profile</h2>
            <span className="avatar avatar-lg">{initial(currentUser.name)}</span>
            <h3>{currentUser.name}</h3>
            <span className={`badge role-${currentUser.role}`}>{roleName}</span>

            <dl className="profile-rows">
              {profile.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd className={label === "Account status" && value === "Active" ? "ok-text" : ""}>
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="stack-lg">
            <section className="panel">
              <h2>Account overview</h2>
              <ul className="overview">
                {overview.map(([Icon, title, text]) => (
                  <li key={title}>
                    <span className="point-icon">
                      <Icon />
                    </span>
                    <div>
                      <strong>{title}</strong>
                      <p>{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <ChangePassword />
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;
