import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, FileText, XCircle, Star, Sparkles, AlertCircle, ArrowUpRight } from "lucide-react";
import Navbar from "../common/Navbar";
import Pagination from "../common/Pagination";
import StatusBadge from "../common/StatusBadge";
import { Loading, ErrorNote, Empty, Modal } from "../common/Misc";
import api, { errMsg } from "../../api";
import { useFetch, clean } from "../../hooks";
import { money, fmtDate } from "../../format";
import { useToast } from "../../toast";

export default function BookingHistory() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [cancelFor, setCancelFor] = useState(null);
  const [reason, setReason] = useState("");
  const [reviewFor, setReviewFor] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [modalError, setModalError] = useState("");
  const { data, loading, error, reload } = useFetch("/bookings/mine", clean({ page, limit: 6, status }));

  const doCancel = async () => {
    setModalError("");
    try {
      const { data: res } = await api.post(`/bookings/${cancelFor._id}/cancel`, { reason });
      toast.success(res.msg);
      setCancelFor(null);
      setReason("");
      reload(true);
    } catch (e) {
      setModalError(errMsg(e));
    }
  };

  const doReview = async () => {
    setModalError("");
    try {
      await api.post("/reviews", { booking: reviewFor._id, rating: Number(review.rating), comment: review.comment });
      toast.success("Thanks for your review!");
      setReviewFor(null);
      setReview({ rating: 5, comment: "" });
      reload(true);
    } catch (e) {
      setModalError(errMsg(e));
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <div>
            <div className="d-inline-flex align-items-center gap-1 text-warning small fw-bold tracking-wider mb-1">
              <Sparkles size={14} />
              <span>YOUR ITINERARY</span>
            </div>
            <h2 className="fw-bold mb-0">My Reservations</h2>
          </div>

          <div className="d-flex align-items-center gap-2">
            <select
              className="form-select w-auto shadow-xs"
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            >
              <option value="">All Reservation Statuses</option>
              <option value="pending">Pending Approval</option>
              <option value="booked">Confirmed & Booked</option>
              <option value="checked_in">Checked In</option>
              <option value="checked_out">Completed Stays</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <ErrorNote error={error} />

        {loading && !data ? (
          <Loading text="Loading your reservation history..." />
        ) : data?.items.length === 0 ? (
          <Empty title="No bookings found">
            You do not have any bookings matching this filter. <Link to="/user" className="text-warning fw-semibold">Explore available suites</Link>
          </Empty>
        ) : (
          <div className="row g-4">
            {data?.items.map((b) => (
              <div className="col-md-6" key={b._id}>
                <div className="card shadow-sm h-100 p-4 border d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <span className="badge bg-body-secondary text-muted small fw-normal mb-1">ID: {b._id.slice(-8)}</span>
                        <h5 className="fw-bold mb-0">Suite #{b.room?.roomNumber} <span className="text-muted fw-normal">({b.roomType})</span></h5>
                      </div>
                      <StatusBadge value={b.status} />
                    </div>

                    <div className="p-3 rounded-3 bg-body-tertiary border my-3">
                      <div className="d-flex align-items-center gap-2 mb-2 text-muted small">
                        <Calendar size={15} className="text-warning flex-shrink-0" />
                        <span><strong>Stay:</strong> {fmtDate(b.fromDate)} — {fmtDate(b.toDate)} ({b.totalDays} nights)</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="small text-muted">Total Paid / Due</span>
                        <span className="fw-bold text-warning fs-5">{money(b.totalAmount)}</span>
                      </div>
                    </div>

                    {b.refund?.status !== "none" && (
                      <div className="alert alert-warning py-2 px-3 small d-flex align-items-center justify-content-between mb-3">
                        <span><strong>Refund:</strong> {money(b.refund.amount)} {b.refund.note && `· ${b.refund.note}`}</span>
                        <StatusBadge value={b.refund.status} />
                      </div>
                    )}
                  </div>

                  <div className="d-flex gap-2 flex-wrap pt-3 border-top">
                    {b.status !== "pending" && (
                      <Link to={`/invoice/${b._id}`} className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1">
                        <FileText size={14} />
                        <span>View Invoice</span>
                      </Link>
                    )}
                    {["pending", "booked"].includes(b.status) && (
                      <button
                        className="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-1"
                        onClick={() => { setModalError(""); setCancelFor(b); }}
                      >
                        <XCircle size={14} />
                        <span>Cancel Stay</span>
                      </button>
                    )}
                    {["checked_in", "checked_out"].includes(b.status) && !b.reviewed && (
                      <button
                        className="btn btn-outline-warning btn-sm d-inline-flex align-items-center gap-1"
                        onClick={() => { setModalError(""); setReviewFor(b); }}
                      >
                        <Star size={14} />
                        <span>Leave Review</span>
                      </button>
                    )}
                    {b.reviewed && (
                      <span className="badge bg-success-subtle text-success border border-success-subtle align-self-center px-2.5 py-1.5 rounded-pill small">
                        ✓ Reviewed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination page={data?.page || 1} pages={data?.pages} onChange={setPage} />
        {data && <p className="text-muted small mt-4 text-center">Showing records of {data.total} total reservations</p>}
      </div>

      {cancelFor && (
        <Modal
          title={`Cancel Reservation: Suite ${cancelFor.room?.roomNumber}`}
          onClose={() => setCancelFor(null)}
          footer={
            <div className="d-flex justify-content-end gap-2 w-100">
              <button className="btn btn-outline-secondary" onClick={() => setCancelFor(null)}>Keep Reservation</button>
              <button className="btn btn-danger" onClick={doCancel}>Confirm Cancellation</button>
            </div>
          }
        >
          <ErrorNote error={modalError} />
          <p className="small mb-3">
            Suite {cancelFor.room?.roomNumber}, {fmtDate(cancelFor.fromDate)} to {fmtDate(cancelFor.toDate)}. A refund of <strong>{money(cancelFor.totalAmount)}</strong> will be requested and reviewed by our concierge team.
          </p>
          <label className="form-label small fw-semibold">Cancellation Reason</label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Please let us know how we can improve..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </Modal>
      )}

      {reviewFor && (
        <Modal
          title={`Review Your Stay: Suite ${reviewFor.room?.roomNumber}`}
          onClose={() => setReviewFor(null)}
          footer={
            <div className="d-flex justify-content-end gap-2 w-100">
              <button className="btn btn-outline-secondary" onClick={() => setReviewFor(null)}>Close</button>
              <button className="btn btn-primary" onClick={doReview}>Submit Review</button>
            </div>
          }
        >
          <ErrorNote error={modalError} />
          <div className="mb-3">
            <label className="form-label small fw-semibold">Overall Experience Rating</label>
            <select
              className="form-select"
              value={review.rating}
              onChange={(e) => setReview({ ...review, rating: e.target.value })}
            >
              <option value="5">★★★★★ Exceptional (5 / 5)</option>
              <option value="4">★★★★☆ Great Stay (4 / 5)</option>
              <option value="3">★★★☆☆ Satisfactory (3 / 5)</option>
              <option value="2">★★☆☆☆ Needs Improvement (2 / 5)</option>
              <option value="1">★☆☆☆☆ Unsatisfactory (1 / 5)</option>
            </select>
          </div>
          <div>
            <label className="form-label small fw-semibold">Your Review & Comments</label>
            <textarea
              className="form-control"
              rows="3"
              maxLength={1000}
              placeholder="What did you love most about your suite and our concierge service?"
              value={review.comment}
              onChange={(e) => setReview({ ...review, comment: e.target.value })}
            />
          </div>
        </Modal>
      )}
    </>
  );
}
