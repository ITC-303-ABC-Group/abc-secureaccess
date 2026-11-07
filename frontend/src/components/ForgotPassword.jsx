import { useState } from "react";
import AuthShell from "./AuthShell";
import PasswordField from "./PasswordField";
import { AlertIcon, CheckIcon } from "./Icons";
import { passwordStrength } from "../lib/auth";
import { api } from "../lib/api";

function ForgotPassword({ goLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const strength = passwordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const uname = username.trim().toLowerCase();
    const mail = email.trim().toLowerCase();

    if (!uname) return setError("Enter your username.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail))
      return setError("Enter the email registered to your account.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");

    setBusy(true);
    try {
      await api("/forgot-password", {
        method: "POST",
        body: {
          username: uname,
          email: mail,
          password,
          password_confirmation: confirm,
        },
      });
      setDone(true);
      setTimeout(goLogin, 1500);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Forgot password"
      subtitle="Enter your username and email, then choose a new password."
      footer={
        <>
          Remembered it?{" "}
          <button type="button" className="btn-text" onClick={goLogin}>
            Back to log in
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="forgot-username">Username</label>
          <input
            id="forgot-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            placeholder="Your username"
          />
        </div>

        <div className="field">
          <label htmlFor="forgot-email">Email</label>
          <input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="The email you registered with"
          />
        </div>

        <div>
          <PasswordField
            id="forgot-password"
            label="New password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            placeholder="At least 8 characters"
          />
          {password && (
            <div className="strength" data-score={strength.score}>
              <div className="meter" aria-hidden="true">
                <span /><span /><span /><span />
              </div>
              <small>{strength.label}</small>
            </div>
          )}
        </div>

        <PasswordField
          id="forgot-confirm"
          label="Confirm new password"
          value={confirm}
          onChange={setConfirm}
          autoComplete="new-password"
          placeholder="Re-enter your new password"
        />

        {error && (
          <p className="notice error" role="alert">
            <AlertIcon width={18} height={18} />
            {error}
          </p>
        )}
        {done && (
          <p className="notice success" role="status">
            <CheckIcon width={18} height={18} />
            Password updated. Taking you to log in…
          </p>
        )}

        <button className="btn btn-primary btn-block" disabled={busy || done}>
          {busy ? "Saving…" : "Change password"}
        </button>
      </form>
    </AuthShell>
  );
}

export default ForgotPassword;