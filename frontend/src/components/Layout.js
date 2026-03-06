import { NavLink, useNavigate } from "react-router-dom";

function Layout({ children }) {
  const navigate = useNavigate();
  const admin = localStorage.getItem("gym_admin") || "Admin";

  const logout = () => {
    localStorage.removeItem("gym_admin");
    navigate("/");
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>LOYD'S<br />FITNESS</h1>
          <span>Loyd's Fitness Gym</span>
        </div>
        <nav>
          <NavLink to="/dashboard" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
            <span className="icon">⚡</span>
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/members" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
            <span className="icon">👥</span>
            <span>Members</span>
          </NavLink>
          <NavLink to="/attendance" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
            <span className="icon">⏱</span>
            <span>Attendance</span>
          </NavLink>
          <NavLink to="/walkins" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
            <span className="icon">🚶</span>
            <span>Walk-ins</span>
          </NavLink>
          <NavLink to="/alerts" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
            <span className="icon">🔔</span>
            <span>Alerts</span>
          </NavLink>
          <NavLink to="/reports" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
            <span className="icon">📊</span>
            <span>Reports</span>
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>
            {admin}
          </div>
          <button className="logout-btn" onClick={logout}>↩ Logout</button>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}

export default Layout;
