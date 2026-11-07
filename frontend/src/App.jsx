import { useEffect, useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
import { api, getToken, setToken } from "./lib/api";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [ready, setReady] = useState(!getToken());
  const [view, setView] = useState("login");

  // Restore the session from a saved token.
  useEffect(() => {
    if (!getToken()) return;
    let cancelled = false;

    api("/me")
      .then((data) => !cancelled && setCurrentUser(data.user))
      .catch((err) => err.status === 401 && setToken(null))
      .finally(() => !cancelled && setReady(true));

    return () => {
      cancelled = true;
    };
  }, []);

  // Any API call that comes back 401 (expired, revoked, suspended) signs the user out.
  useEffect(() => {
    const onUnauthorized = () => {
      setToken(null);
      setCurrentUser(null);
      setView("login");
    };
    window.addEventListener("abc:unauthorized", onUnauthorized);
    return () => window.removeEventListener("abc:unauthorized", onUnauthorized);
  }, []);

  const handleLogin = (token, user) => {
    setToken(token);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    api("/logout", { method: "POST" }).catch(() => {});
    setToken(null);
    setCurrentUser(null);
    setView("login");
  };

  if (!ready) {
    return (
      <div className="boot" role="status">
        Loading…
      </div>
    );
  }

  if (!currentUser) {
    if (view === "register") return <Register goLogin={() => setView("login")} />;
    if (view === "forgot") return <ForgotPassword goLogin={() => setView("login")} />;

    return (
      <Login
        onLogin={handleLogin}
        goRegister={() => setView("register")}
        goForgot={() => setView("forgot")}
      />
    );
  }

  return currentUser.role === "admin" ? (
    <AdminDashboard currentUser={currentUser} onLogout={handleLogout} />
  ) : (
    <UserDashboard currentUser={currentUser} onLogout={handleLogout} />
  );
}

export default App;