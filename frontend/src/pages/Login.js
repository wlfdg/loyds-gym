import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regMsg, setRegMsg] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    if (!username || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API}/login`, { username, password });
      if (res.data.success) {
        localStorage.setItem("gym_admin", res.data.username);
        navigate("/dashboard");
      }
    } catch {
      setError("Invalid username or password.");
    }
    setLoading(false);
  };

  const handleKey = (e) => { if (e.key === "Enter") login(); };

  const register = async () => {
    if (!regUsername || !regPassword) { setRegMsg("Please fill in all fields."); return; }
    setRegLoading(true);
    setRegMsg("");
    try {
      await axios.post(`${API}/register`, { username: regUsername, password: regPassword });
      setRegMsg("✅ Account created! You can now log in.");
      setRegUsername("");
      setRegPassword("");
    } catch {
      setRegMsg("❌ Username already exists.");
    }
    setRegLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-card">
        <h1>
          <span style={{ display: "block", textAlign: "center" }}>LOYD'S FITNESS</span>
          <span style={{ display: "block", textAlign: "center" }}>GYM</span>
        </h1>
        <p className="subtitle">
          <span style={{ display: "block", textAlign: "center" }}>Admin Portal</span>
        </p>

        {!showRegister ? (
          <>
            {error && <div className="error-msg">{error}</div>}
            <div className="login-form">
              <input
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={handleKey}
                autoFocus
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={handleKey}
              />
              <button className="btn btn-primary" onClick={login} disabled={loading}>
                {loading ? "Signing in..." : "Sign In →"}
              </button>
            </div>
            <p
              style={{ marginTop: 24, fontSize: 12, color: "var(--muted)", textAlign: "center", cursor: "pointer", textDecoration: "underline" }}
              onClick={() => { setShowRegister(true); setError(""); }}
            >
              Create an Account
            </p>
          </>
        ) : (
          <>
            <div className="login-form">
              <input
                placeholder="New Username"
                value={regUsername}
                onChange={e => setRegUsername(e.target.value)}
                autoFocus
              />
              <input
                type="password"
                placeholder="New Password"
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
              />
              <button className="btn btn-primary" onClick={register} disabled={regLoading}>
                {regLoading ? "Creating..." : "Create Account"}
              </button>
            </div>
            {regMsg && (
              <p style={{ marginTop: 14, fontSize: 12, textAlign: "center", color: regMsg.startsWith("✅") ? "var(--success)" : "var(--danger)" }}>
                {regMsg}
              </p>
            )}
            <p
              style={{ marginTop: 16, fontSize: 12, color: "var(--muted)", textAlign: "center", cursor: "pointer", textDecoration: "underline" }}
              onClick={() => { setShowRegister(false); setRegMsg(""); }}
            >
              ← Back to Login
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
