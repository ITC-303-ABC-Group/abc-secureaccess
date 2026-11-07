import { useState } from "react";
import AuthShell from "./AuthShell";
import PasswordField from "./PasswordField";
import { AlertIcon, CheckIcon } from "./Icons";
import { passwordStrength } from "../lib/auth";
import { api } from "../lib/api";

function Register({ goLogin }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const strength = passwordStrength(password);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const uname = username.trim().toLowerCase();
    const mail = email.trim().toLowerCase();

    if (name.trim().length < 2) return setError("Enter your full name.");
    if (!/^[a-z0-9_.]{3,20}$/.test(uname))
      return setError("Username must be 3–20 characters: letters, numbers, dots or underscores.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail))
      return setError("Enter a valid email address.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");

    setBusy(true);
    try {
      await api("/register", {
        method: "POST",
        body: {
          name: name.trim(),
          username: uname,
          email: mail,
          password,
          password_confirmation: confirm,
        },
      });
      setDone(true);
      setTimeout(goLogin, 1200);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="New accounts get user access. Administrators are set up separately."
      footer={
        <>
          Already registered?{" "}
          <button type="button" className="btn-text" onClick={goLogin}>
            Log in
          </button>
        </>
      }
    >
      <form onSubmit={handleRegister} noValidate>
        <div className="field">
          <label htmlFor="reg-name">Full name</label>
          <input
            id="reg-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            placeholder="Your full name"
          />
        </div>

        <div className="field">
          <label htmlFor="reg-username">Username</label>
          <input
            id="reg-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            placeholder="Choose a username"
          />
        </div>

        <div className="field">
          <label htmlFor="reg-email">Email</label>
          <input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <PasswordField
            id="reg-password"
            label="Password"
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
          id="reg-confirm"
          label="Confirm password"
          value={confirm}
          onChange={setConfirm}
          autoComplete="new-password"
          placeholder="Re-enter your password"
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
            Account created. Taking you to log in…
          </p>
        )}

        <button className="btn btn-primary btn-block" disabled={busy || done}>
          {busy ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}

export default Register;