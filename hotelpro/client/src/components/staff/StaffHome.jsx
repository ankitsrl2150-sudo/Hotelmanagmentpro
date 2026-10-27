import { useState } from "react";
import { Sparkles, CalendarCheck, DoorOpen, Bed, Bell, Headphones, TrendingUp } from "lucide-react";
import Navbar from "../common/Navbar";
import BarChart from "../common/BarChart";
import { Tabs, StatCard, Loading, ErrorNote } from "../common/Misc";
import { BookingsPanel, RoomStatusPanel, HousekeepingPanel, ServicesPanel, SupportPanel } from "./panels";
import { useFetch } from "../../hooks";

const TABS = [
  ["overview", "Operations Overview"],
  ["bookings", "Reservations & Check-In/Out"],
  ["rooms", "Suite Status"],
  ["housekeeping", "Housekeeping"],
  ["services", "Service Requests"],
  ["support", "Guest Inquiries"],
];

export function Overview() {
  const { data: s, loading, error } = useFetch("/reports/summary");
  const { data: occ } = useFetch("/reports/occupancy", { days: 14 });

  if (loading) return <Loading text="Aggregating live operational metrics..." />;
  return (
    <>
      <ErrorNote error={error} />
      {s && (
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <StatCard title="Arrivals Today" value={s.arrivalsToday} tone="primary" />
          </div>
          <div className="col-6 col-md-3">
            <StatCard title="Departures Today" value={s.departuresToday} tone="warning" />
          </div>
          <div className="col-6 col-md-3">
            <StatCard
              title="Occupancy Rate"
              value={`${s.occupancyRate}%`}
              sub={`${s.occupiedRooms} of ${s.totalRooms} suites occupied`}
              tone="success"
            />
          </div>
          <div className="col-6 col-md-3">
            <StatCard title="Pending Approvals" value={s.pendingApprovals} tone="danger" />
          </div>
          <div className="col-6 col-md-3">
            <StatCard title="Refund Requests" value={s.pendingRefunds} tone="danger" />
          </div>
          <div className="col-6 col-md-3">
            <StatCard title="Open Service Calls" value={s.openServiceRequests} tone="warning" />
          </div>
          <div className="col-6 col-md-3">
            <StatCard title="Active Inquiries" value={s.openTickets} tone="primary" />
          </div>
          <div className="col-6 col-md-3">
            <StatCard title="Cleaning Tasks Pending" value={s.pendingHousekeeping} tone="secondary" />
          </div>
        </div>
      )}

      {occ && (
        <div className="card shadow-sm border p-4">
          <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
            <div>
              <h6 className="fw-bold mb-0">14-Day Occupancy Forecast</h6>
              <span className="text-muted small">Projected suites occupancy percentage</span>
            </div>
            <span className="badge bg-body-secondary text-body fw-bold">Live Projection</span>
          </div>
          <BarChart
            title="Occupancy forecast"
            data={occ.days.map((d) => ({ label: d.date.slice(5), value: d.rate }))}
            format={(v) => `${v}%`}
          />
        </div>
      )}
    </>
  );
}

export default function StaffHome() {
  const [tab, setTab] = useState("overview");

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="mb-4">
          <div className="d-inline-flex align-items-center gap-1 text-warning small fw-bold tracking-wider mb-1">
            <Sparkles size={14} />
            <span>OPERATIONS COMMAND CENTER</span>
          </div>
          <h2 className="fw-bold mb-0">Staff Dashboard</h2>
          <p className="text-muted small">Manage guest arrivals, suites housekeeping, service requests, and front-desk tickets.</p>
        </div>

        <Tabs tabs={TABS} active={tab} onChange={setTab} />

        <div className="mt-3">
          {tab === "overview" && <Overview />}
          {tab === "bookings" && <BookingsPanel />}
          {tab === "rooms" && <RoomStatusPanel />}
          {tab === "housekeeping" && <HousekeepingPanel />}
          {tab === "services" && <ServicesPanel />}
          {tab === "support" && <SupportPanel />}
        </div>
      </div>
    </>
  );
}
