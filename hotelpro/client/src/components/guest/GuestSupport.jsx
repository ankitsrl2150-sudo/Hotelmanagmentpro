import { useState } from "react";
import { Headphones, MessageSquarePlus, Clock, Sparkles, Send } from "lucide-react";
import Navbar from "../common/Navbar";
import Pagination from "../common/Pagination";
import TicketThread from "../common/TicketThread";
import StatusBadge from "../common/StatusBadge";
import { Loading, ErrorNote, Empty } from "../common/Misc";
import api, { errMsg } from "../../api";
import { useFetch } from "../../hooks";
import { fmtDateTime } from "../../format";
import { useToast } from "../../toast";

export default function GuestSupport() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [active, setActive] = useState(null);
  const [form, setForm] = useState({ subject: "", text: "" });
  const [err, setErr] = useState("");
  const { data, loading, error, reload } = useFetch("/support", { page, limit: 8 });

  const create = async (e) => {
    e.preventDefault();
    setErr("");
    if (!form.subject.trim() || !form.text.trim()) return setErr("Subject and message are required");
    try {
      const { data: t } = await api.post("/support", form);
      toast.success("Support ticket registered. Our front desk will respond promptly.");
      setForm({ subject: "", text: "" });
      setActive(t._id);
      reload(true);
    } catch (e2) {
      setErr(errMsg(e2));
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="mb-4">
          <div className="d-inline-flex align-items-center gap-1 text-warning small fw-bold tracking-wider mb-1">
            <Sparkles size={14} />
            <span>24/7 DEDICATED ASSISTANCE</span>
          </div>
          <h2 className="fw-bold mb-0">Customer Support & Concierge</h2>
          <p className="text-muted small">Reach our front desk team for reservation inquiries, special requests, and stay assistance.</p>
        </div>

        <div className="row g-4">
          <div className="col-lg-5">
            <form className="card shadow-sm p-4 border mb-4" onSubmit={create}>
              <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                <MessageSquarePlus size={18} className="text-warning" />
                <h5 className="fw-bold mb-0">Open Support Ticket</h5>
              </div>

              <ErrorNote error={err} />

              <div className="mb-3">
                <label className="form-label small fw-semibold">Subject / Inquiry</label>
                <input
                  className="form-control"
                  placeholder="e.g. Airport transfer coordination, Invoice query"
                  maxLength={150}
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Your Message</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="How can our front desk team assist you today?"
                  maxLength={2000}
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                />
              </div>

              <button className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2">
                <Send size={15} />
                <span>Transmit Ticket</span>
              </button>
            </form>

            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <Clock size={18} className="text-warning" />
              <span>Ticket Archive</span>
            </h5>

            <ErrorNote error={error} />
            {loading && !data ? (
              <Loading text="Loading support conversations..." />
            ) : data?.items.length === 0 ? (
              <Empty title="No open inquiries">You have not submitted any support tickets yet.</Empty>
            ) : (
              <div className="list-group shadow-xs">
                {data?.items.map((t) => (
                  <button
                    key={t._id}
                    className={`list-group-item list-group-item-action p-3 ${active === t._id ? "border-warning border-start border-3" : ""}`}
                    onClick={() => setActive(t._id)}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <strong className="small">{t.subject}</strong>
                      <StatusBadge value={t.status} />
                    </div>
                    <small className="text-muted d-block" style={{ fontSize: "0.74rem" }}>
                      Updated {fmtDateTime(t.updatedAt)}
                    </small>
                  </button>
                ))}
              </div>
            )}
            <Pagination page={data?.page || 1} pages={data?.pages} onChange={setPage} />
          </div>

          <div className="col-lg-7">
            {active ? (
              <TicketThread key={active} id={active} onChanged={() => reload(true)} />
            ) : (
              <div className="card shadow-sm p-5 border text-center h-100 d-flex flex-column align-items-center justify-content-center">
                <Headphones size={42} className="text-warning mb-3 opacity-60" />
                <h5 className="fw-bold">Select a Support Conversation</h5>
                <p className="text-muted small max-w-sm mb-0">
                  Click any ticket on the left to review messages, post updates, and communicate directly with the front desk.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
