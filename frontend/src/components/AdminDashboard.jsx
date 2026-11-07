import { useCallback, useEffect, useState } from "react";
import TopNav from "./TopNav";
import UserTable from "./UserTable";
import LoginActivity from "./LoginActivity";
import ChangePassword from "./ChangePassword";
import { AlertIcon, CheckIcon, ClockIcon, GridIcon, LockIcon, UsersIcon } from "./Icons";
import { api } from "../lib/api";
import { formatDate, formatDateTime, initial } from "../lib/format";

const TABS = [
  { id: "dashboard", label: "Dashboard", Icon: GridIcon },
  { id: "users", label: "Users", Icon: UsersIcon },
  { id: "activity", label: "Login activity", Icon: ClockIcon },
  { id: "account", label: "My account", Icon: LockIcon },
];

const HEADERS = {
  dashboard: ["Admin dashboard", "Manage users and monitor sign-in activity."],
  users: ["Users", "Block, unblock, suspend or delete registered accounts."],
  activity: ["Login activity", "Review every sign-in attempt."],
  account: ["My account", "Update your administrator password."],
};

const RESULT = { success: ["Successful", "ok"], failed: ["Failed", "error"], blocked: ["Blocked", "error"] };

function AdminDashboard({ currentUser, onLogout }) {
  const [tab, setTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, description] = HEADERS[tab];

  const load = useCallback(async () => {
    try {
      const [s, u, a] = await Promise.all([
        api("/admin/stats"),
        api("/admin/users"),
        api("/admin/activity"),
      ]);
      setStats(s);
      setUsers(u.users);
      setActivity(a.activity);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const changeTab = (id) => {
    setTab(id);
    load(); // always show fresh data
  };

  const setStatus = async (user, status) => {
    try {
      await api(`/admin/users/${user.id}/status`, {
        method: "PATCH",
        body: { status },
      });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const removeUser = async (user) => {
    try {
      await api(`/admin/users/${user.id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const tiles = [
    [UsersIcon, "Total users", stats?.total_users, ""],
    [CheckIcon, "Active accounts", stats?.active_users, ""],
    [ClockIcon, "Successful sign-ins", stats?.successful_logins, ""],
    [AlertIcon, "Failed or blocked", stats?.failed_logins, "alert"],
  ];

  const newest = users.slice(0, 5);
  const showData = !loading && tab !== "account";

  return (
    <div className="app-shell">
      <TopNav user={currentUser} tabs={TABS} activeTab={tab} onTab={changeTab} onLogout={onLogout} />

      <main className="page">
        <header className="page-head">
          <h1>{title}</h1>
          <p>{description}</p>
        </header>

        {error && (
          <p className="notice error" role="alert">
            <AlertIcon width={18} height={18} />
            {error}
          </p>
        )}

        {loading && tab !== "account" && <p className="muted">Loading…</p>}

        {showData && tab === "dashboard" && (
          <>
            <div className="stats">
              {tiles.map(([Icon, label, value, tone]) => (
                <div className="stat" key={label}>
                  <span className={`point-icon ${tone}`}>
                    <Icon />
                  </span>
                  <div>
                    <span className="stat-label">{label}</span>
                    <strong className="stat-value">{value ?? "–"}</strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="two-col">
              <section className="panel">
                <div className="panel-head">
                  <h2>Recent sign-ins</h2>
                  <button type="button" className="btn-text" onClick={() => changeTab("activity")}>
                    View all
                  </button>
                </div>
                {activity.length ? (
                  <ul className="list">
                    {activity.slice(0, 5).map((a) => (
                      <li key={a.id}>
                        <span className="avatar soft">{initial(a.username)}</span>
                        <div className="list-text">
                          <strong>{a.username}</strong>
                          <small>{formatDateTime(a.created_at)}</small>
                        </div>
                        <span className={`badge ${RESULT[a.result][1]}`}>{RESULT[a.result][0]}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="muted">No sign-ins yet.</p>
                )}
              </section>

              <section className="panel">
                <div className="panel-head">
                  <h2>Newest accounts</h2>
                  <button type="button" className="btn-text" onClick={() => changeTab("users")}>
                    Manage users
                  </button>
                </div>
                <ul className="list">
                  {newest.map((u) => (
                    <li key={u.id}>
                      <span className="avatar soft">{initial(u.name)}</span>
                      <div className="list-text">
                        <strong>{u.name}</strong>
                        <small>@{u.username}</small>
                      </div>
                      <small className="muted">{formatDate(u.created_at)}</small>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </>
        )}

        {showData && tab === "users" && (
          <UserTable users={users} onSetStatus={setStatus} onDelete={removeUser} />
        )}
        {showData && tab === "activity" && <LoginActivity activity={activity} />}
        {tab === "account" && (
          <div className="narrow">
            <ChangePassword />
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;