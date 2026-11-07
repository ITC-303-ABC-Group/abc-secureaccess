import { useState } from "react";
import { SearchIcon } from "./Icons";
import { formatDate, initial } from "../lib/format";

function UserTable({ users, onToggleStatus, onDelete }) {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const rows = users.filter(
    (u) => !q || u.name.toLowerCase().includes(q) || u.username.includes(q)
  );

  const remove = (user) => {
    if (!window.confirm(`Delete ${user.username}? This cannot be undone.`)) return;
    onDelete(user);
  };

  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <h2>User management</h2>
          <p className="panel-note">{users.length} registered accounts</p>
        </div>

        <div className="search">
          <SearchIcon width={18} height={18} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or username"
            aria-label="Search users"
          />
        </div>
      </div>

      {!rows.length ? (
        <div className="empty">
          <h3>No matching users</h3>
          <p>Try a different name or username.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => {
                const suspended = u.status === "suspended";
                return (
                  <tr key={u.id}>
                    <td>
                      <div className="table-user">
                        <span className="avatar soft">{initial(u.name)}</span>
                        <strong>{u.name}</strong>
                      </div>
                    </td>
                    <td>{u.username}</td>
                    <td>
                      <span className={`badge role-${u.role}`}>{u.role}</span>
                    </td>
                    <td>
                      <span className={`badge ${suspended ? "warn" : "ok"}`}>
                        {suspended ? "Suspended" : "Active"}
                      </span>
                    </td>
                    <td>{formatDate(u.created_at)}</td>
                    <td>
                      {u.role === "admin" ? (
                        <span className="muted">Protected</span>
                      ) : (
                        <div className="row-actions">
                          <button type="button" className="btn btn-secondary btn-sm" onClick={() => onToggleStatus(u)}>
                            {suspended ? "Reactivate" : "Suspend"}
                          </button>
                          <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(u)}>
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default UserTable;
