import { useState } from "react";
import { ConciergeBell, Send, Clock, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import Navbar from "../common/Navbar";
import StatusBadge from "../common/StatusBadge";
import { Loading, ErrorNote, Empty } from "../common/Misc";
import api, { errMsg } from "../../api";
import { useFetch } from "../../hooks";
import { fmtDateTime, label } from "../../format";
import { useToast } from "../../toast";

const TYPES = ["room_service", "laundry", "housekeeping", "maintenance", "other"];

export default function Services() {
  const toast = useToast();
  const { data: bookings } = useFetch("/bookings/mine", { limit: 50 });
  const { data: requests, loading, error, reload } = useFetch("/services/mine");
  const [form, setForm] = useState({ booking: "", type: "room_service", description: "" });
  const [err, setErr] = useState("");

  const active = (bookings?.items || []).filter((b) => ["booked", "checked_in"].includes(b.status));

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!form.booking || !form.description.trim()) return setErr("Choose an active booking and describe what you need");
    try {
      await api.post("/services", form);
      toast.success("Service request dispatched to hotel staff");
      setForm({ ...form, description: "" });
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
            <span>BESPOKE HOSPITALITY</span>
          </div>
          <h2 className="fw-bold mb-0">Guest Concierge Services</h2>
          <p className="text-muted small">Request in-room dining, expedited housekeeping, or private conveniences.</p>
        </div>

        <div className="row g-4">
          <div className="col-lg-5">
            <form className="card shadow-sm p-4 border" onSubmit={submit}>
              <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                <ConciergeBell size={18} className="text-warning" />
                <h5 className="fw-bold mb-0">New Concierge Request</h5>
              </div>

              <ErrorNote error={err} />
              {active.length === 0 && (
                <div className="alert alert-info py-2 px-3 small rounded-3 mb-3">
                  You need an active or checked-in stay to place service requests.
                </div>
              )}

              <div className="mb-3">
                <label className="form-label small fw-semibold">Select Reservation / Suite</label>
                <select
                  className="form-select"
                  value={form.booking}
                  onChange={(e) => setForm({ ...form, booking: e.target.value })}
                >
                  <option value="">Choose an active booking</option>
                  {active.map((b) => (
                    <option key={b._id} value={b._id}>
                      Suite {b.room?.roomNumber} · Arrival {new Date(b.fromDate).toISOString().slice(0, 10)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Service Category</label>
                <select
                  className="form-select"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>{label(t)}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Details / Instructions</label>
                <textarea
                  className="form-control"
                  rows="3"
                  maxLength={1000}
                  placeholder="e.g. Fresh towels requested at 8:00 PM, or continental breakfast for 2..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <button
                className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                disabled={active.length === 0}
              >
                <Send size={15} />
                <span>Submit Service Request</span>
              </button>
            </form>
          </div>

          <div className="col-lg-7">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <Clock size={18} className="text-warning" />
              <span>Request History & Status</span>
            </h5>

            <ErrorNote error={error} />
            {loading && !requests ? (
              <Loading text="Retrieving concierge requests..." />
            ) : requests?.length === 0 ? (
              <Empty title="No active requests">No concierge services have been requested yet.</Empty>
            ) : (
              <div className="d-flex flex-column gap-3">
                {requests?.map((r) => (
                  <div key={r._id} className="card shadow-xs p-3 border">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <span className="badge bg-body-secondary text-body fw-bold me-2">{label(r.type)}</span>
                        <span className="small text-muted">Suite {r.room?.roomNumber}</span>
                      </div>
                      <StatusBadge value={r.status} />
                    </div>
                    <p className="small mb-2">{r.description}</p>
                    <div className="small text-muted d-flex justify-content-between align-items-center">
                      <span>Requested {fmtDateTime(r.createdAt)}</span>
                      {r.assignedTo && <span className="badge bg-light text-dark border">Attended by {r.assignedTo.name}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
