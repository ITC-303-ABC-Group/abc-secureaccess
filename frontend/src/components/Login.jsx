import { useState } from "react";
import AuthShell from "./AuthShell";
import PasswordField from "./PasswordField";
import { AlertIcon } from "./Icons";
import { api } from "../lib/api";

function Login({ onLogin, goRegister, goForgot }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!username.trim() || !password) {
      setMessage("Enter your username or email and your password.");
      return;
    }

    setBusy(true);
    try {
      const data = await api("/login", {
        method: "POST",
        body: { username: username.trim(), password },
      });
      onLogin(data.token, data.user);
    } catch (err) {
      setMessage(err.message);
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Log in"
      subtitle="Enter your username or email and your password."
      footer={
        <>
          New here?{" "}
          <button type="button" className="btn-text" onClick={goRegister}>
            Create an account
          </button>
        </>
      }
    >
      <form onSubmit={handleLogin} noValidate>
        <div className="field">
          <label htmlFor="login-username">Username or email</label>
          <input
            id="login-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            placeholder="Enter your username or email"
          />
        </div>

        <PasswordField
          id="login-password"
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          placeholder="Enter your password"
        />

        <p style={{ margin: "-4px 0 14px", textAlign: "right" }}>
          <button type="button" className="btn-text" onClick={goForgot}>
            Forgot password?
          </button>
        </p>

        {message && (
          <p className="notice error" role="alert">
            <AlertIcon width={18} height={18} />
            {message}
          </p>
        )}

        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? "Logging in…" : "Log in"}
        </button>
      </form>
    </AuthShell>
  );
}

export default Login;