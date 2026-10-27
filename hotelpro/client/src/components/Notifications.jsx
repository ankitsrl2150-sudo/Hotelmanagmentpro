import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, Trash2, Sparkles, Inbox } from "lucide-react";
import Navbar from "./common/Navbar";
import Pagination from "./common/Pagination";
import { Loading, ErrorNote, Empty } from "./common/Misc";
import api from "../api";
import { useFetch } from "../hooks";
import { fmtDateTime } from "../format";

export default function Notifications() {
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useFetch("/notifications", { page, limit: 10 });
  const navigate = useNavigate();

  const open = async (n) => {
    if (!n.read) await api.put(`/notifications/${n._id}/read`).catch(() => {});
    if (n.link) navigate(n.link);
    else reload(true);
  };
  const readAll = async () => {
    await api.put("/notifications/read-all");
    reload(true);
  };
  const remove = async (id) => {
    await api.delete(`/notifications/${id}`);
    reload(true);
  };

  return (
    <>
      <Navbar />
      <div className="container py-4" style={{ maxWidth: 820 }}>
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <div className="d-inline-flex align-items-center gap-1 text-warning small fw-bold tracking-wider mb-1">
              <Sparkles size={14} />
              <span>LIVE UPDATES</span>
            </div>
            <h2 className="fw-bold mb-0 d-flex align-items-center gap-2">
              <span>Notification Center</span>
              {data?.unread > 0 && (
                <span className="badge rounded-pill bg-danger fs-6 px-2.5 py-1">
                  {data.unread} new
                </span>
              )}
            </h2>
          </div>
          <button
            className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
            onClick={readAll}
            disabled={!data || data.unread === 0}
          >
            <CheckCheck size={15} />
            <span>Mark All as Read</span>
          </button>
        </div>

        <ErrorNote error={error} />

        {loading && !data ? (
          <Loading text="Loading notifications..." />
        ) : data?.items.length === 0 ? (
          <Empty title="You're all caught up">No recent notifications or announcements.</Empty>
        ) : (
          <div className="d-flex flex-column gap-2 mb-4">
            {data?.items.map((n) => (
              <div
                key={n._id}
                className={`card p-3 shadow-xs border transition-all ${
                  n.read ? "opacity-80" : "border-warning border-start border-3"
                }`}
              >
                <div className="d-flex justify-content-between align-items-start gap-3">
                  <button
                    className="btn btn-link text-start text-decoration-none text-reset p-0 flex-grow-1"
                    onClick={() => open(n)}
                  >
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="fw-bold small">{n.title}</span>
                      {!n.read && <span className="badge bg-warning text-dark px-1.5 py-0.5 text-xs">Unread</span>}
                    </div>
                    <div className="small text-muted mb-2">{n.message}</div>
                    <div className="small text-muted" style={{ fontSize: "0.72rem" }}>
                      {fmtDateTime(n.createdAt)}
                    </div>
                  </button>

                  <button
                    className="btn btn-sm btn-outline-secondary border-0 p-1.5 rounded-circle text-muted"
                    onClick={() => remove(n._id)}
                    title="Delete notification"
                    aria-label="Delete notification"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <Pagination page={data?.page || 1} pages={data?.pages} onChange={setPage} />
      </div>
    </>
  );
}
