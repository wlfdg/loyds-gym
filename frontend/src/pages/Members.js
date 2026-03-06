import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const API = "https://loyds-gym.onrender.com";

const PLANS = ["Basic", "Standard", "Premium", "Student", "Senior"];

const EMPTY_FORM = { name: "", email: "", phone: "", plan: "Basic", months: "", price: "", discount: "0" };

function MemberModal({ member, onClose, onSave }) {
  const [form, setForm] = useState(member || EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name || !form.months || !form.price) { alert("Name, months, and price are required."); return; }
    setSaving(true);
    try {
      if (member) {
        await axios.put(`${API}/members/${member.id}`, form);
      } else {
        await axios.post(`${API}/members`, form);
      }
      onSave();
      onClose();
    } catch { alert("Error saving member."); }
    setSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3>{member ? "Edit Member" : "Add Member"}</h3>
        <div className="form-grid">
          <div className="form-group full">
            <label>Full Name *</label>
            <input placeholder="John Doe" value={form.name} onChange={e => set("name", e.target.value)} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input placeholder="john@email.com" value={form.email} onChange={e => set("email", e.target.value)} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input placeholder="09xxxxxxxxx" value={form.phone} onChange={e => set("phone", e.target.value)} />
          </div>
          <div className="form-group">
            <label>Plan *</label>
            <select value={form.plan} onChange={e => set("plan", e.target.value)}>
              {PLANS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Duration (Months) *</label>
            <input type="number" min="1" max="24" placeholder="1" value={form.months} onChange={e => set("months", e.target.value)} />
          </div>
          <div className="form-group">
            <label>Price (₱) *</label>
            <input type="number" min="0" placeholder="999" value={form.price} onChange={e => set("price", e.target.value)} />
          </div>
          <div className="form-group">
            <label>Discount (%)</label>
            <input type="number" min="0" max="100" placeholder="0" value={form.discount} onChange={e => set("discount", e.target.value)} />
          </div>
          {member && (
            <div className="form-group">
              <label>Start Date</label>
              <input type="date" value={form.start_date || ""} onChange={e => set("start_date", e.target.value)} />
            </div>
          )}
        </div>
        <div className="form-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>
            {saving ? "Saving..." : member ? "Update Member" : "Add Member"}
          </button>
        </div>
      </div>
    </div>
  );
}

function getStatus(exp) {
  const today = new Date();
  const expDate = new Date(exp);
  const diff = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: "Expired", cls: "badge-expired" };
  if (diff <= 7) return { label: "Expiring Soon", cls: "badge-expiring" };
  return { label: "Active", cls: "badge-active" };
}

function Members() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    setLoading(true);
    const res = await axios.get(`${API}/members`);
    setMembers(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, []);

  const deleteMember = async (id) => {
    if (!window.confirm("Delete this member?")) return;
    await axios.delete(`${API}/members/${id}`);
    fetchMembers();
  };

  const exportCSV = () => {
    window.open(`${API}/export/csv`, "_blank");
  };

  const filtered = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.phone?.includes(search);
    const matchPlan = planFilter === "All" || m.plan === planFilter;
    return matchSearch && matchPlan;
  });

  return (
    <Layout>
      <div className="page-header">
        <h2>Members</h2>
        <p>{members.length} total members registered</p>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select value={planFilter} onChange={e => setPlanFilter(e.target.value)}
          style={{ width: "auto", padding: "10px 14px" }}>
          <option>All</option>
          {PLANS.map(p => <option key={p}>{p}</option>)}
        </select>
        <button className="btn btn-ghost" onClick={exportCSV}>⬇ Export CSV</button>
        <button className="btn btn-primary" onClick={() => { setEditMember(null); setShowModal(true); }}>
          + Add Member
        </button>
      </div>

      <div className="card">
        <div className="table-wrap">
          {loading ? (
            <div className="empty-state">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">No members found.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Plan</th>
                  <th>Months</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Start</th>
                  <th>Expires</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => {
                  const status = getStatus(m.expiration_date);
                  const net = m.price - (m.price * m.discount / 100);
                  return (
                    <tr key={m.id}>
                      <td style={{ color: "var(--muted)", fontSize: 12 }}>{i + 1}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{m.name}</div>
                        {m.email && <div style={{ fontSize: 11, color: "var(--muted)" }}>{m.email}</div>}
                      </td>
                      <td><span className="badge" style={{ background: "rgba(232,255,0,0.1)", color: "var(--accent)" }}>{m.plan}</span></td>
                      <td>{m.months}mo</td>
                      <td>₱{net.toLocaleString()}</td>
                      <td>{m.discount > 0 ? <span style={{ color: "var(--success)" }}>-{m.discount}%</span> : "—"}</td>
                      <td style={{ fontSize: 12 }}>{m.start_date}</td>
                      <td style={{ fontSize: 12 }}>{m.expiration_date}</td>
                      <td><span className={`badge ${status.cls}`}>{status.label}</span></td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => { setEditMember(m); setShowModal(true); }}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => deleteMember(m.id)}>Del</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <MemberModal
          member={editMember}
          onClose={() => setShowModal(false)}
          onSave={fetchMembers}
        />
      )}
    </Layout>
  );
}

export default Members;
