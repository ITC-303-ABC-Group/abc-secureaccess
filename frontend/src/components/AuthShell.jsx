import Brand from "./Brand";
import { ClockIcon, ShieldIcon, UsersIcon } from "./Icons";

const points = [
  [ShieldIcon, "Hashed passwords", "Passwords are hashed on the server and never stored as plain text."],
  [UsersIcon, "Two access levels", "Users and administrators each get their own dashboard."],
  [ClockIcon, "Sign-in history", "Successful and failed attempts are recorded for admins."],
];

function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="auth-page">
      <header className="auth-top">
        <Brand />
      </header>

      <main className="auth-main">
        <section className="auth-intro">
          <h1>Sign in to ABC SecureAccess</h1>
          <p>
            Users go to their account page. Administrators go to the admin dashboard.
          </p>
          <ul className="auth-points">
            {points.map(([Icon, heading, text]) => (
              <li key={heading}>
                <span className="point-icon">
                  <Icon />
                </span>
                <div>
                  <strong>{heading}</strong>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="auth-card">
          <h2>{title}</h2>
          <p className="auth-subtitle">{subtitle}</p>
          {children}
          <p className="auth-footer">{footer}</p>
        </section>
      </main>
    </div>
  );
}

export default AuthShell;
