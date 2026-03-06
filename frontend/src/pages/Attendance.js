import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const API = "https://loyds-gym.onrender.com";

function Attendance() {
  const [members, setMembers] = useState([]);
  const [data, setData] = useState({ records: [], total: 0, still_in: 0, date: "" });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const searchRef = useRef(null);

  const isToday = selectedDate === new Date().toISOString().split("T")[0];

  const fetchMembers = async () => {
    const res = await axios.get(`${API}/members`);
    setMembers(res.data);
  };

  const fetchAttendance = async () => {
    setLoading(true);
    const res = await axios.get(`${API}/attendance?date=${selectedDate}`);
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, []);
  useEffect(() => { fetchAttendance(); }, [selectedDate]);

  const showMsg = (msg, type = "success") => {
    setActionMsg({ msg, type });
    setTimeout(() => setActionMsg(null), 3000);
  };

  const timeIn = async (member) => {
    try {
      const res = await axios.post(`${API}/attendance/timein`, { member_id: member.id });
      showMsg(res.data.message, "success");
      fetchAttendance();
    } catch (e) {
      showMsg(e.response?.data?.message || "Error timing in.", "error");
    }
    setSearch("");
    setSelectedMember(null);
  };

  const timeOut = async (member) => {
    try {
      const res = await axios.post(`${API}/attendance/timeout`, { member_id: member.id });
      showMsg(res.data.message, "success");
      fetchAttendance();
    } catch (e) {
      showMsg(e.response?.data?.message || "Error timing out.", "error");
    }
  };

  // Check if a member is currently timed in (no time_out)
  const getMemberStatus = (memberId) => {
    return data.records.find(r => r.member_id === memberId && !r.time_out);
  };

  const filteredMembers = members.filter(m =>
    search.length > 0 &&
    (m.name.toLowerCase().includes(search.toLowerCase()) ||
     m.phone?.includes(search))
  ).slice(0, 6);

  const today = new Date().toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <Layout>
      <div className="page-header">
        <h2>Attendance</h2>
        <p>{today}</p>
      </div>

      {/* Stat strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
        <div className="stat-card green">
          <div className="stat-label">Currently Inside</div>
          <div className="stat-value green">{loading ? "—" : data.still_in}</div>
          <div className="stat-sub">Members in gym now</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-label">Visits Today</div>
          <div className="stat-value yellow">{loading ? "—" : data.total}</div>
          <div className="stat-sub">Total check-ins</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-label">Date</div>
          <div className="stat-value" style={{ fontSize: 22, color: "#00b0ff", paddingTop: 8 }}>{selectedDate}</div>
          <div className="stat-sub">Viewing log for this date</div>
        </div>
      </div>

      {/* Action message */}
      {actionMsg && (
        <div style={{
          padding: "12px 18px", borderRadius: 8, marginBottom: 16, fontSize: 14, fontWeight: 600,
          background: actionMsg.type === "success" ? "rgba(0,230,118,0.12)" : "rgba(255,23,68,0.12)",
          border: `1px solid ${actionMsg.type === "success" ? "rgba(0,230,118,0.3)" : "rgba(255,23,68,0.3)"}`,
          color: actionMsg.type === "success" ? "var(--success)" : "var(--danger)"
        }}>
          {actionMsg.type === "success" ? "✅" : "❌"} {actionMsg.msg}
        </div>
      )}

      {/* Time-in panel — only show when viewing today */}
      {isToday && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 22, marginBottom: 16 }}>⏱ Time In / Time Out</h3>
          <div style={{ position: "relative" }}>
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                ref={searchRef}
                placeholder="Search member by name or phone..."
                value={search}
                onChange={e => { setSearch(e.target.value); setSelectedMember(null); }}
                autoComplete="off"
              />
            </div>

            {/* Dropdown results */}
            {filteredMembers.length > 0 && (
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
                background: "var(--dark)", border: "1px solid var(--border)",
                borderRadius: 8, zIndex: 50, overflow: "hidden"
              }}>
                {filteredMembers.map(m => {
                  const activeRecord = getMemberStatus(m.id);
                  const isExpired = new Date(m.expiration_date) < new Date();
                  return (
                    <div key={m.id} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 16px", borderBottom: "1px solid var(--border)",
                      cursor: "pointer", transition: "background 0.1s"
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: "var(--muted)" }}>
                          {m.plan} · Expires {m.expiration_date}
                          {isExpired && <span style={{ color: "var(--danger)", marginLeft: 6 }}>⚠ Expired</span>}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        {activeRecord ? (
                          <button className="btn btn-danger btn-sm" onClick={() => timeOut(m)}>
                            Time Out ↩
                          </button>
                        ) : (
                          <button className="btn btn-success btn-sm" onClick={() => timeIn(m)}>
                            Time In →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Currently inside list */}
          {data.still_in > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                Currently Inside ({data.still_in})
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {data.records.filter(r => !r.time_out).map(r => (
                  <div key={r.id} style={{
                    background: "rgba(0,230,118,0.08)", border: "1px solid rgba(0,230,118,0.2)",
                    borderRadius: 8, padding: "8px 14px", display: "flex", alignItems: "center", gap: 10
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--success)" }}>{r.member_name}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>In at {r.time_in}</div>
                    </div>
                    <button
                      className="btn btn-danger btn-sm"
                      style={{ padding: "4px 10px", fontSize: 10 }}
                      onClick={() => timeOut({ id: r.member_id })}
                    >
                      Out
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Attendance log */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <h3 style={{ fontSize: 22 }}>Attendance Log</h3>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            style={{ width: "auto", padding: "8px 12px" }}
          />
        </div>

        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : data.records.length === 0 ? (
          <div className="empty-state">No attendance records for {selectedDate}.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Member</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.records.map((r, i) => {
                let duration = "—";
                if (r.time_in && r.time_out) {
                  // parse 12hr time to compute duration
                  const parse = t => {
                    const [time, period] = t.split(" ");
                    let [h, m] = time.split(":").map(Number);
                    if (period === "PM" && h !== 12) h += 12;
                    if (period === "AM" && h === 12) h = 0;
                    return h * 60 + m;
                  };
                  const mins = parse(r.time_out) - parse(r.time_in);
                  if (mins >= 0) duration = `${Math.floor(mins / 60)}h ${mins % 60}m`;
                }
                return (
                  <tr key={r.id}>
                    <td style={{ color: "var(--muted)", fontSize: 12 }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{r.member_name}</td>
                    <td style={{ color: "var(--success)" }}>{r.time_in}</td>
                    <td style={{ color: r.time_out ? "var(--danger)" : "var(--muted)" }}>
                      {r.time_out || "—"}
                    </td>
                    <td style={{ fontSize: 12, color: "var(--muted)" }}>{duration}</td>
                    <td>
                      {r.time_out
                        ? <span className="badge badge-expired">Left</span>
                        : <span className="badge badge-active">Inside</span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}

export default Attendance;
