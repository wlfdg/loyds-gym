import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const API = "https://loyds-gym.onrender.com";

function Walkins() {
  const [data, setData] = useState({ walkins: [], total: 0, date: "" });
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const fetchWalkins = async () => {
    setLoading(true);
    const res = await axios.get(`${API}/walkins?date=${selectedDate}`);
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchWalkins(); }, [selectedDate]);

  const addWalkin = async () => {
    if (!name || !amount) { alert("Name and amount are required."); return; }
    setAdding(true);
    await axios.post(`${API}/walkins`, { name, amount, note });
    setName(""); setAmount(""); setNote("");
    fetchWalkins();
    setAdding(false);
  };

  const deleteWalkin = async (id) => {
    if (!window.confirm("Remove this walk-in entry?")) return;
    await axios.delete(`${API}/walkins/${id}`);
    fetchWalkins();
  };

  const isToday = selectedDate === new Date().toISOString().split("T")[0];

  return (
    <Layout>
      <div className="page-header">
        <h2>Walk-ins</h2>
        <p>Track daily walk-in revenue</p>
      </div>

      {/* Revenue summary */}
      <div className="card" style={{ marginBottom: 20, borderColor: "rgba(232,255,0,0.2)", background: "linear-gradient(135deg, #1a1a1a 0%, #1f1f0a 100%)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 6 }}>
              {isToday ? "🚶 Today's Walk-in Revenue" : `📅 Walk-in Revenue — ${selectedDate}`}
            </div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 64, color: "var(--accent)", lineHeight: 1 }}>
              ₱{data.total.toLocaleString()}
            </div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>
              {data.walkins.length} walk-in{data.walkins.length !== 1 ? "s" : ""}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{ display: "block", fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
              View by date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>

      {/* Add walk-in form */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 22, marginBottom: 18 }}>+ Record Walk-in</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Name *</label>
            <input placeholder="e.g. John Doe / Guest" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Amount (₱) *</label>
            <input type="number" min="0" placeholder="100" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div className="form-group full">
            <label>Note (optional)</label>
            <input placeholder="e.g. Day pass, Locker fee..." value={note} onChange={e => setNote(e.target.value)} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="btn btn-primary" onClick={addWalkin} disabled={adding}>
            {adding ? "Recording..." : "Record Walk-in"}
          </button>
        </div>
      </div>

      {/* Walk-ins table */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 22 }}>Entries</h3>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>{selectedDate}</span>
        </div>
        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : data.walkins.length === 0 ? (
          <div className="empty-state">No walk-ins recorded for this date.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Amount</th>
                <th>Note</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.walkins.map((w, i) => (
                <tr key={w.id}>
                  <td style={{ color: "var(--muted)", fontSize: 12 }}>{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{w.name}</td>
                  <td style={{ color: "var(--accent)", fontWeight: 600 }}>₱{w.amount.toLocaleString()}</td>
                  <td style={{ color: "var(--muted)", fontSize: 12 }}>{w.note || "—"}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteWalkin(w.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2" style={{ fontWeight: 700, fontSize: 13, paddingTop: 14, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>Total</td>
                <td style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 24, color: "var(--accent)", paddingTop: 14 }}>₱{data.total.toLocaleString()}</td>
                <td colSpan="2" />
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </Layout>
  );
}

export default Walkins;
