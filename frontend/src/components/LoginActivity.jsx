import { useState } from "react";
import { formatDate, formatTime } from "../lib/format";
import { ClockIcon } from "./Icons";

const RESULT = {
  success: ["Successful", "ok"],
  failed: ["Failed", "error"],
  blocked: ["Suspended", "warn"],
};

const FILTERS = [
  ["all", "All"],
  ["success", "Successful"],
  ["problem", "Failed or blocked"],
];

function LoginActivity({ activity }) {
  const [filter, setFilter] = useState("all");

  const rows = activity.filter((a) =>
    filter === "all" ? true : filter === "success" ? a.result === "success" : a.result !== "success"
  );

  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <h2>Login activity</h2>
          <p className="panel-note">Latest 200 sign-in attempts, newest first.</p>
        </div>
        <div className="chips" role="group" aria-label="Filter activity">
          {FILTERS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`chip ${filter === id ? "active" : ""}`}
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {!rows.length ? (
        <div className="empty">
          <ClockIcon width={28} height={28} />
          <h3>No activity to show</h3>
          <p>Sign-in attempts will appear here as people log in.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Date</th>
                <th>Time</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id}>
                  <td>{a.username}</td>
                  <td>
                    <span className={`badge role-${a.role}`}>{a.role}</span>
                  </td>
                  <td>{formatDate(a.created_at)}</td>
                  <td>{formatTime(a.created_at)}</td>
                  <td>
                    <span className={`badge ${RESULT[a.result][1]}`}>{RESULT[a.result][0]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default LoginActivity;
