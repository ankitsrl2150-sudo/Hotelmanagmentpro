import { BarChart3, TrendingUp, Calendar, ShieldCheck, Activity, Award, Server } from "lucide-react";
import BarChart from "../common/BarChart";
import { Loading, ErrorNote, StatCard } from "../common/Misc";
import { useFetch } from "../../hooks";
import { money } from "../../format";

export default function Dashboard() {
  const { data: s, loading, error } = useFetch("/reports/summary");
  const { data: rev } = useFetch("/reports/revenue", { months: 6 });
  const { data: occ } = useFetch("/reports/occupancy", { days: 14 });
  const { data: top } = useFetch("/reports/top-rooms");
  const { data: sec } = useFetch("/admin/security");

  if (loading) return <Loading text="Aggregating business intelligence reports..." />;
  const by = s?.bookingsByStatus || {};

  return (
    <>
      <ErrorNote error={error} />
      {s && (
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <StatCard
              title="Net Revenue"
              value={money(s.revenue.net)}
              sub={`${money(s.revenue.refunded)} refunded`}
              tone="success"
            />
          </div>
          <div className="col-6 col-md-3">
            <StatCard
              title="Occupancy Now"
              value={`${s.occupancyRate}%`}
              sub={`${s.occupiedRooms} of ${s.totalRooms} suites`}
              tone="primary"
            />
          </div>
          <div className="col-6 col-md-3">
            <StatCard
              title="Active Bookings"
              value={(by.booked || 0) + (by.checked_in || 0) + (by.pending || 0)}
              sub={`${by.cancelled || 0} cancelled`}
              tone="primary"
            />
          </div>
          <div className="col-6 col-md-3">
            <StatCard title="Total Registered Users" value={s.users} tone="secondary" />
          </div>
          <div className="col-6 col-md-3">
            <StatCard title="Pending Approvals" value={s.pendingApprovals} tone="danger" />
          </div>
          <div className="col-6 col-md-3">
            <StatCard title="Refund Claims" value={s.pendingRefunds} tone="danger" />
          </div>
          <div className="col-6 col-md-3">
            <StatCard title="Failed Logins (24h)" value={sec?.failedLogins24h ?? "-"} tone="warning" />
          </div>
          <div className="col-6 col-md-3">
            <StatCard title="Server Errors (24h)" value={sec?.errors24h ?? "-"} tone="warning" />
          </div>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card shadow-sm h-100 border p-4">
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <TrendingUp size={18} className="text-success" />
                <span>Net Revenue Trajectory (Last 6 Months)</span>
              </h6>
              <span className="badge bg-success-subtle text-success border border-success-subtle">Monthly</span>
            </div>
            {rev && (
              <BarChart
                title="Monthly revenue"
                data={rev.map((m) => ({ label: m.month.slice(2), value: m.revenue }))}
                format={(v) => (v >= 1000 ? `${Math.round(v / 100) / 10}k` : v)}
              />
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm h-100 border p-4">
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <Calendar size={18} className="text-warning" />
                <span>14-Day Occupancy Forecast</span>
              </h6>
              <span className="badge bg-warning-subtle text-warning border border-warning-subtle">Projected</span>
            </div>
            {occ && (
              <BarChart
                title="Occupancy forecast"
                data={occ.days.map((d) => ({ label: d.date.slice(5), value: d.rate }))}
                format={(v) => `${v}%`}
              />
            )}
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card shadow-sm border p-4">
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <Award size={18} className="text-warning" />
                <span>Top Revenue-Generating Suites</span>
              </h6>
            </div>
            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Suite</th>
                    <th>Class</th>
                    <th>Stays Booked</th>
                    <th className="text-end">Total Yield</th>
                  </tr>
                </thead>
                <tbody>
                  {(top || []).map((r) => (
                    <tr key={r.roomNumber}>
                      <td className="fw-bold">Suite {r.roomNumber}</td>
                      <td>
                        <span className={`badge ${r.type === "Delux" ? "bg-warning text-dark" : "bg-secondary"}`}>
                          {r.type}
                        </span>
                      </td>
                      <td>{r.bookings} reservations</td>
                      <td className="text-end fw-bold text-warning">{money(r.revenue)}</td>
                    </tr>
                  ))}
                  {top?.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-muted text-center py-3">No bookings recorded yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card shadow-sm border p-4">
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <Server size={18} className="text-primary" />
                <span>Infrastructure & Health</span>
              </h6>
              <span className="badge bg-success-subtle text-success border border-success-subtle">Online</span>
            </div>

            {sec ? (
              <div className="d-flex flex-column gap-2 small">
                <div className="d-flex justify-content-between py-1 border-bottom">
                  <span className="text-muted">Database Engine</span>
                  <strong className="text-success">{sec.system.dbState} (Connected)</strong>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom">
                  <span className="text-muted">Process Uptime</span>
                  <span>{Math.floor(sec.system.uptimeSeconds / 60)} minutes</span>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom">
                  <span className="text-muted">Active RAM Allocated</span>
                  <span>{sec.system.memoryMB} MB</span>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom">
                  <span className="text-muted">Node Runtime</span>
                  <span className="font-monospace">{sec.system.node}</span>
                </div>
                <div className="d-flex justify-content-between py-1">
                  <span className="text-muted">Authentication Events (24h)</span>
                  <span className="fw-bold">{sec.logins24h} attempts</span>
                </div>
              </div>
            ) : (
              <Loading />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
