import Brand from "./Brand";
import { initial } from "../lib/format";

function TopNav({ user, tabs, activeTab, onTab, onLogout }) {
  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        <Brand />

        {tabs ? (
          <nav className="nav-tabs" aria-label="Sections">
            {tabs.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                className={`nav-tab ${activeTab === id ? "active" : ""}`}
                aria-current={activeTab === id ? "page" : undefined}
                onClick={() => onTab(id)}
              >
                <Icon />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        ) : (
          <div />
        )}

        <div className="nav-account">
          <div className="nav-user">
            <span className="avatar">{initial(user.name)}</span>
            <span className="nav-user-text">
              <strong>{user.name}</strong>
              <small>{user.role === "admin" ? "Administrator" : "User"}</small>
            </span>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onLogout}>
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}

export default TopNav;
