import { useState } from "react";
import { Sparkles, Shield, BarChart3, Calendar, Building2, Wrench, Users, Settings } from "lucide-react";
import Navbar from "../common/Navbar";
import { Tabs } from "../common/Misc";
import Dashboard from "./Dashboard";
import RoomsAdmin from "./RoomsAdmin";
import UsersAdmin from "./UsersAdmin";
import { SeasonalPricing, HotelsAdmin, CategoriesAdmin } from "./CatalogAdmin";
import { PaymentsAdmin, ReviewsAdmin } from "./FinanceAdmin";
import { LogsAdmin, SecurityAdmin, BroadcastAdmin, SettingsAdmin } from "./SystemAdmin";
import { BookingsPanel, RoomStatusPanel, HousekeepingPanel, ServicesPanel, SupportPanel } from "../staff/panels";

// Top-level sections, each with its own sub-tabs, so the page stays easy to scan.
const SECTIONS = {
  dashboard: ["Dashboard", [["main", "Reports & Analytics", Dashboard]]],
  bookings: ["Bookings", [["all", "All Bookings", BookingsPanel], ["payments", "Payments & Revenue", PaymentsAdmin]]],
  hotel: [
    "Resort Management",
    [
      ["rooms", "Rooms & Pricing", RoomsAdmin],
      ["seasonal", "Seasonal Rules", SeasonalPricing],
      ["hotels", "Hotels Directory", HotelsAdmin],
      ["categories", "Categories", CategoriesAdmin],
      ["status", "Occupancy & Status", RoomStatusPanel],
    ],
  ],
  ops: [
    "Operations",
    [["housekeeping", "Housekeeping", HousekeepingPanel], ["services", "Service Requests", ServicesPanel], ["support", "Customer Support", SupportPanel], ["reviews", "Reviews Moderation", ReviewsAdmin]],
  ],
  people: ["Staff & Users", [["users", "User Management", UsersAdmin], ["broadcast", "Announcements", BroadcastAdmin]]],
  system: ["System & Security", [["security", "Security Monitor", SecurityAdmin], ["logs", "Audit Logs", LogsAdmin], ["settings", "Platform Configuration", SettingsAdmin]]],
};

export default function AdminHome() {
  const [section, setSection] = useState("dashboard");
  const [sub, setSub] = useState({});

  const [, subs] = SECTIONS[section];
  const activeKey = sub[section] || subs[0][0];
  const Active = (subs.find(([k]) => k === activeKey) || subs[0])[2];

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <div className="d-inline-flex align-items-center gap-1 text-warning small fw-bold tracking-wider mb-1">
              <Sparkles size={14} />
              <span>EXECUTIVE CONSOLE</span>
            </div>
            <h2 className="fw-bold mb-0">System Administration</h2>
          </div>
          <span className="badge bg-warning text-dark px-3 py-1.5 fw-bold rounded-pill">
            Admin Privileges Active
          </span>
        </div>

        <Tabs tabs={Object.entries(SECTIONS).map(([k, [text]]) => [k, text])} active={section} onChange={setSection} />

        {subs.length > 1 && (
          <div className="tab-scroll mb-4 pb-1">
            <ul className="nav nav-pills gap-1 flex-nowrap">
              {subs.map(([k, text]) => (
                <li className="nav-item" key={k}>
                  <button
                    className={`btn btn-sm ${activeKey === k ? "btn-light text-dark fw-bold border shadow-xs" : "btn-outline-secondary border-0"}`}
                    onClick={() => setSub({ ...sub, [section]: k })}
                  >
                    {text}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="admin-content-wrap">
          <Active key={`${section}-${activeKey}`} />
        </div>
      </div>
    </>
  );
}
