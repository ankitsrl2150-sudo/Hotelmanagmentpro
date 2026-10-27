import { useState } from "react";
import { Send, CheckCircle2, MessageSquare, Sparkles } from "lucide-react";
import { Loading, ErrorNote } from "./Misc";
import StatusBadge from "./StatusBadge";
import api, { errMsg } from "../../api";
import { useFetch } from "../../hooks";
import { fmtDateTime } from "../../format";

// One support conversation. Shared by guests and staff.
export default function TicketThread({ id, onChanged }) {
  const { data: t, loading, error, reload } = useFetch(`/support/${id}`);
  const [text, setText] = useState("");
  const [err, setErr] = useState("");

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setErr("");
    try {
      await api.post(`/support/${id}/reply`, { text });
      setText("");
      reload(true);
      onChanged && onChanged();
    } catch (e2) {
      setErr(errMsg(e2));
    }
  };
  const close = async () => {
    try {
      await api.put(`/support/${id}/close`);
      reload(true);
      onChanged && onChanged();
    } catch (e2) {
      setErr(errMsg(e2));
    }
  };

  if (loading && !t) return <Loading text="Loading conversation transcript..." />;
  if (error) return <ErrorNote error={error} />;
  if (!t) return null;

  return (
    <div className="card shadow-sm border overflow-hidden">
      <div className="card-header bg-body-tertiary p-3 border-bottom d-flex justify-content-between align-items-center">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <strong className="fs-6">{t.subject}</strong>
            <StatusBadge value={t.status} />
          </div>
          <div className="small text-muted">{t.user?.name} · {t.user?.email}</div>
        </div>
        {t.status === "open" && (
          <button className="btn btn-outline-secondary btn-sm" onClick={close}>
            Mark Resolved
          </button>
        )}
      </div>

      <div className="card-body p-4" style={{ maxHeight: 420, overflowY: "auto", background: "var(--bg-page)" }}>
        {t.messages.map((m, i) => {
          const isStaff = m.role !== "Ordinary";
          return (
            <div key={i} className={`mb-3 ${isStaff ? "text-end" : "text-start"}`}>
              <div
                className={`d-inline-block rounded-4 p-3 text-start shadow-xs ${
                  isStaff
                    ? "bg-warning text-dark border border-warning"
                    : "bg-body border text-body"
                }`}
                style={{ maxWidth: "80%" }}
              >
                <div className="small fw-bold mb-1 opacity-75">
                  {m.senderName} {isStaff && `(${m.role})`}
                </div>
                <div style={{ whiteSpace: "pre-wrap" }} className="small mb-1">
                  {m.text}
                </div>
                <div className="text-end" style={{ fontSize: "0.68rem", opacity: 0.7 }}>
                  {fmtDateTime(m.at)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {t.status === "open" ? (
        <form className="card-footer bg-body p-3 border-top" onSubmit={send}>
          <ErrorNote error={err} />
          <div className="input-group">
            <input
              className="form-control"
              placeholder="Type your reply to our concierge..."
              value={text}
              maxLength={2000}
              onChange={(e) => setText(e.target.value)}
            />
            <button className="btn btn-primary d-inline-flex align-items-center gap-1">
              <Send size={15} />
              <span>Reply</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="card-footer p-3 text-center text-muted small bg-body-tertiary">
          This support ticket has been closed and marked resolved.
        </div>
      )}
    </div>
  );
}
