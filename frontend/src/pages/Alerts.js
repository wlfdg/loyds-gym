import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const API = "https://loyds-gym.onrender.com";

function Alerts() {
  const [data, setData] = useState({ expiring_soon: [], expired: [] });
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await axios.get(`${API}/expiring?days=${days}`);
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [days]);

  return (
    <Layout>
      <div className="page-header">
        <h2>Alerts</h2>
        <p>Monitor expiring and expired memberships</p>
      </div>

      <div className="toolbar" style={{ marginBottom: 28 }}>
        <span style={{ color: "var(--muted)", fontSize: 13 }}>Show members expiring within:</span>
        {[3, 7, 14, 30].map(d => (
          <button
            key={d}
            className={`btn ${days === d ? "btn-primary" : "btn-ghost"} btn-sm`}
            onClick={() => setDays(d)}
          >
            {d} days
          </button>
        ))}
      </div>

      <div className="alerts-section">
        <h3>
          ⚠ Expiring Soon
          <span className="badge badge-expiring">{data.expiring_soon.length}</span>
        </h3>
        <div className="card">
          {loading ? (
            <div className="empty-state">Loading...</div>
          ) : data.expiring_soon.length === 0 ? (
            <div className="empty-state">✅ No memberships expiring within {days} days</div>
          ) : (
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Phone</th><th>Plan</th><th>Expires</th><th>Days Left</th></tr>
              </thead>
              <tbody>
                {data.expiring_soon.map(m => {
                  const daysLeft = Math.ceil((new Date(m.expiration_date) - new Date()) / (1000 * 60 * 60 * 24));
                  return (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 600 }}>{m.name}</td>
                      <td style={{ color: "var(--muted)", fontSize: 12 }}>{m.email || "—"}</td>
                      <td style={{ color: "var(--muted)", fontSize: 12 }}>{m.phone || "—"}</td>
                      <td><span className="badge" style={{ background: "rgba(232,255,0,0.1)", color: "var(--accent)" }}>{m.plan}</span></td>
                      <td style={{ fontSize: 12 }}>{m.expiration_date}</td>
                      <td><span className="badge badge-expiring">{daysLeft}d left</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="alerts-section">
        <h3>
          ❌ Expired Memberships
          <span className="badge badge-expired">{data.expired.length}</span>
        </h3>
        <div className="card">
          {loading ? (
            <div className="empty-state">Loading...</div>
          ) : data.expired.length === 0 ? (
            <div className="empty-state">✅ No expired memberships</div>
          ) : (
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Phone</th><th>Plan</th><th>Expired On</th><th>Days Ago</th></tr>
              </thead>
              <tbody>
                {data.expired.map(m => {
                  const daysAgo = Math.abs(Math.ceil((new Date(m.expiration_date) - new Date()) / (1000 * 60 * 60 * 24)));
                  return (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 600 }}>{m.name}</td>
                      <td style={{ color: "var(--muted)", fontSize: 12 }}>{m.email || "—"}</td>
                      <td style={{ color: "var(--muted)", fontSize: 12 }}>{m.phone || "—"}</td>
                      <td><span className="badge" style={{ background: "rgba(232,255,0,0.1)", color: "var(--accent)" }}>{m.plan}</span></td>
                      <td style={{ fontSize: 12 }}>{m.expiration_date}</td>
                      <td><span className="badge badge-expired">{daysAgo}d ago</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Alerts;
