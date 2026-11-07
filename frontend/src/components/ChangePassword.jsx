import { useState } from "react";
import PasswordField from "./PasswordField";
import { AlertIcon, CheckIcon } from "./Icons";
import { api } from "../lib/api";

function ChangePassword() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setDone(false);

    if (!current || !next || !confirm) return setError("Fill in all three fields.");
    if (next.length < 8) return setError("New password must be at least 8 characters.");
    if (next !== confirm) return setError("New passwords do not match.");

    setBusy(true);
    try {
      await api("/password", {
        method: "PUT",
        body: { current_password: current, password: next, password_confirmation: confirm },
      });
      setCurrent("");
      setNext("");
      setConfirm("");
      setDone(true);
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  };

  return (
    <section className="panel">
      <h2>Change password</h2>
      <p className="panel-note">Use at least 8 characters.</p>
      <form className="stack" onSubmit={handleSubmit} noValidate>
        <PasswordField id="cp-current" label="Current password" value={current} onChange={setCurrent} autoComplete="current-password" />
        <PasswordField id="cp-new" label="New password" value={next} onChange={setNext} autoComplete="new-password" />
        <PasswordField id="cp-confirm" label="Confirm new password" value={confirm} onChange={setConfirm} autoComplete="new-password" />

        {error && (
          <p className="notice error" role="alert">
            <AlertIcon width={18} height={18} />
            {error}
          </p>
        )}
        {done && (
          <p className="notice success" role="status">
            <CheckIcon width={18} height={18} />
            Password updated.
          </p>
        )}

        <button className="btn btn-primary" disabled={busy}>
          {busy ? "Saving…" : "Update password"}
        </button>
      </form>
    </section>
  );
}

export default ChangePassword;
