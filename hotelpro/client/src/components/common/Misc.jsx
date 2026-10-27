import { Star, AlertCircle, Inbox, TrendingUp, Sparkles, X } from "lucide-react";

export function Loading({ text = "Loading experience..." }) {
  return (
    <div className="text-center py-5 d-flex flex-column align-items-center justify-content-center">
      <div
        className="spinner-border mb-3"
        role="status"
        style={{ width: "2.4rem", height: "2.4rem", color: "var(--brand-primary)", borderWidth: "0.22em" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="text-muted small fw-medium tracking-wide">{text}</div>
    </div>
  );
}

export function ErrorNote({ error }) {
  if (!error) return null;
  return (
    <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 rounded-3 mb-3" role="alert">
      <AlertCircle size={18} className="flex-shrink-0" />
      <span className="small">{error}</span>
    </div>
  );
}

export function Empty({ children = "No records found.", title = "Nothing here yet" }) {
  return (
    <div className="text-center py-5 px-3">
      <div
        className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
        style={{
          width: 56,
          height: 56,
          background: "rgba(148, 163, 184, 0.12)",
          color: "var(--text-muted)"
        }}
      >
        <Inbox size={26} />
      </div>
      <h6 className="fw-semibold mb-1">{title}</h6>
      <p className="text-muted small mb-0 max-w-sm mx-auto">{children}</p>
    </div>
  );
}

export function StatCard({ title, value, sub, tone = "primary" }) {
  const toneMap = {
    primary: { color: "var(--brand-primary)", bg: "rgba(245, 158, 11, 0.12)" },
    success: { color: "#10b981", bg: "rgba(16, 185, 129, 0.12)" },
    warning: { color: "#f59e0b", bg: "rgba(245, 158, 11, 0.12)" },
    danger: { color: "#ef4444", bg: "rgba(239, 68, 68, 0.12)" },
    secondary: { color: "#64748b", bg: "rgba(148, 163, 184, 0.12)" },
  };

  const currentTone = toneMap[tone] || toneMap.primary;

  return (
    <div className="card stat-card-luxury h-100">
      <div className="d-flex align-items-start justify-content-between mb-2">
        <span className="text-muted small fw-semibold text-uppercase tracking-wide" style={{ fontSize: "0.72rem" }}>
          {title}
        </span>
        <div
          className="rounded-3 d-flex align-items-center justify-content-center"
          style={{
            width: 34,
            height: 34,
            background: currentTone.bg,
            color: currentTone.color
          }}
        >
          <TrendingUp size={16} />
        </div>
      </div>

      <div className="stat-value mb-1" style={{ color: currentTone.color }}>
        {value}
      </div>

      {sub && (
        <div className="small text-muted" style={{ fontSize: "0.78rem" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export function Stars({ value = 0, count }) {
  const numeric = Math.min(5, Math.max(0, Number(value) || 0));
  const full = Math.round(numeric);

  return (
    <div className="d-inline-flex align-items-center gap-1" title={`${numeric.toFixed(1)} out of 5 stars`}>
      <div className="d-flex align-items-center gap-0.5 text-warning">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={14}
            className={i <= full ? "text-warning fill-warning" : "text-muted opacity-25"}
            fill={i <= full ? "currentColor" : "none"}
          />
        ))}
      </div>
      <span className="small fw-bold ms-1" style={{ fontSize: "0.82rem" }}>
        {numeric.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className="small text-muted" style={{ fontSize: "0.78rem" }}>
          ({count})
        </span>
      )}
    </div>
  );
}

// Generic modal shell with frosted backdrop
export function Modal({ title, onClose, children, footer, size = "" }) {
  return (
    <div className="modal-backdrop-custom" role="dialog" aria-modal="true">
      <div
        className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${size}`}
        style={{ width: "100%", maxWidth: size === "modal-lg" ? 800 : size === "modal-xl" ? 1100 : 540 }}
      >
        <div className="modal-content shadow-lg border-0">
          <div className="modal-header d-flex justify-content-between align-items-center">
            <h5 className="modal-title fw-bold mb-0 d-flex align-items-center gap-2">
              <Sparkles size={18} className="text-warning" />
              <span>{title}</span>
            </h5>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary rounded-circle p-1 d-flex align-items-center justify-content-center"
              style={{ width: 32, height: 32 }}
              onClick={onClose}
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
          <div className="modal-body p-4">{children}</div>
          {footer && <div className="modal-footer p-3 bg-body-tertiary">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="luxury-tabs-wrapper">
      <ul className="nav nav-pills gap-2 flex-nowrap">
        {tabs.map(([key, text]) => (
          <li className="nav-item" key={key}>
            <button
              className={`nav-link text-nowrap ${active === key ? "active" : ""}`}
              onClick={() => onChange(key)}
            >
              {text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
