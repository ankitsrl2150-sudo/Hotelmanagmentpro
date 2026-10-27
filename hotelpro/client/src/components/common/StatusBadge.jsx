import { label } from "../../format";

const TONES = {
  // Bookings & Stays
  pending: "warning",
  booked: "primary",
  checked_in: "success",
  checked_out: "secondary",
  cancelled: "danger",

  // Room Inventory
  available: "success",
  occupied: "danger",
  cleaning: "warning",
  maintenance: "secondary",

  // Finance & Refunds
  requested: "warning",
  approved: "success",
  rejected: "danger",
  paid: "success",
  refunded: "info",
  failed: "danger",

  // Tasks & Support
  in_progress: "primary",
  done: "success",
  open: "warning",
  resolved: "success",
  closed: "secondary",

  // Priorities
  high: "danger",
  normal: "secondary",
  low: "secondary",
};

export default function StatusBadge({ value }) {
  if (!value || value === "none") return null;
  const tone = TONES[value] || "secondary";

  return (
    <span className={`status-chip ${tone}`}>
      <span className="status-chip-dot" />
      <span>{label(value)}</span>
    </span>
  );
}
