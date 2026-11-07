import { useState } from "react";
import AuthShell from "./AuthShell";
import { AlertIcon, CheckIcon } from "./Icons";
import { api } from "../lib/api";

function ForgotPassword({ goLogin }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSent("");

    const mail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      setError("Enter a valid email address.");
      return;
    }

    setBusy(true);
    try {
      const data = await api("/forgot-password", {
        method: "POST",
        body: { email: mail },
      });
      setSent(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Forgot password"
      subtitle="Enter your account email and we'll send you a link to reset your password."
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
          <label htmlFor="forgot-email">Email</label>
          <input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>

        {error && (
          <p className="notice error" role="alert">
            <AlertIcon width={18} height={18} />
            {error}
          </p>
        )}
        {sent && (
          <p className="notice success" role="status">
            <CheckIcon width={18} height={18} />
            {sent}
          </p>
        )}

        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? "Sending…" : sent ? "Send again" : "Send reset link"}
        </button>
      </form>
    </AuthShell>
  );
}

export default ForgotPassword;