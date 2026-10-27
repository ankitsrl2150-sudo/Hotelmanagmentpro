import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Printer, Sparkles, Building, CheckCircle2 } from "lucide-react";
import Navbar from "./common/Navbar";
import StatusBadge from "./common/StatusBadge";
import { Loading, ErrorNote } from "./common/Misc";
import { useFetch } from "../hooks";
import { money, fmtDate, fmtDateTime } from "../format";

export default function Invoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: inv, loading, error } = useFetch(`/bookings/${id}/invoice`);

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center gap-2 mb-4 no-print">
          <button className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1" onClick={() => navigate(-1)}>
            <ArrowLeft size={15} />
            <span>Return</span>
          </button>
          {inv && (
            <button className="btn btn-primary btn-sm d-inline-flex align-items-center gap-1 shadow-sm" onClick={() => window.print()}>
              <Printer size={15} />
              <span>Print Official Invoice / PDF</span>
            </button>
          )}
        </div>

        <ErrorNote error={error} />

        {loading ? (
          <Loading text="Generating official invoice statement..." />
        ) : inv && (
          <div className="card shadow-lg invoice-sheet border overflow-hidden">
            {/* Elegant Header Banner */}
            <div className="invoice-header-banner d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <div className="rounded-2 p-1.5 bg-warning text-dark d-flex align-items-center justify-content-center">
                    <Sparkles size={16} />
                  </div>
                  <h3 className="fw-bold mb-0 text-white">{inv.siteName || "HotelPro Residences"}</h3>
                </div>
                {inv.hotel && (
                  <div className="small text-white-50">
                    {inv.hotel.name} · {inv.hotel.address}, {inv.hotel.city} · {inv.hotel.phone}
                  </div>
                )}
              </div>

              <div className="text-md-end text-white">
                <div className="badge bg-warning text-dark fw-bold px-2.5 py-1 mb-1">OFFICIAL STATEMENT</div>
                <div className="font-monospace fs-6">{inv.invoiceNumber}</div>
                <div className="small text-white-50">Issued {fmtDateTime(inv.issuedAt)}</div>
              </div>
            </div>

            <div className="card-body p-4 p-md-5">
              {/* Billed To / Stay Details */}
              <div className="row g-4 mb-4 pb-4 border-bottom">
                <div className="col-sm-6">
                  <div className="text-muted small text-uppercase fw-bold tracking-wider mb-1">Resident / Guest</div>
                  <div className="fw-bold fs-5 mb-1">{inv.guest.name}</div>
                  <div className="small text-muted">{inv.guest.email}</div>
                  <div className="small text-muted">{inv.guest.phone}</div>
                </div>

                <div className="col-sm-6">
                  <div className="text-muted small text-uppercase fw-bold tracking-wider mb-1">Reservation Details</div>
                  <div className="fw-bold fs-5 mb-1">Suite {inv.room.number} <span className="badge bg-secondary fs-6 fw-normal ms-1">{inv.room.type}</span></div>
                  <div className="small text-muted mb-2">
                    {fmtDate(inv.fromDate)} — {fmtDate(inv.toDate)} ({inv.totalDays} night{inv.totalDays > 1 ? "s" : ""})
                  </div>
                  <div><StatusBadge value={inv.bookingStatus} /></div>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="table-responsive mb-4">
                <table className="table table-sm align-middle">
                  <thead>
                    <tr>
                      <th>Night / Date</th>
                      <th>Rate Schedule / Pricing Rule</th>
                      <th className="text-end">Nightly Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inv.nights.map((n) => (
                      <tr key={n.date}>
                        <td className="fw-medium">{fmtDate(n.date)}</td>
                        <td className="text-muted small">{n.rule || "Standard Luxury Suite Rate"}</td>
                        <td className="text-end fw-semibold">{money(n.rate)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="2" className="text-end text-muted pt-3">Nights Subtotal</td>
                      <td className="text-end pt-3">{money(inv.subtotal)}</td>
                    </tr>
                    <tr>
                      <td colSpan="2" className="text-end text-muted">Hospitality Tax ({inv.taxRate}%)</td>
                      <td className="text-end">{money(inv.tax)}</td>
                    </tr>
                    <tr className="border-top fs-5 fw-bold text-warning">
                      <td colSpan="2" className="text-end">Total Amount</td>
                      <td className="text-end">{money(inv.totalAmount)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Settlement Summary */}
              <div className="p-3 rounded-3 bg-body-tertiary border">
                {inv.payment && (
                  <div className="small mb-1 d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <span>
                      <strong>Payment Status:</strong> Card ending in <strong>{inv.payment.last4}</strong> (Ref: {inv.payment.transactionId})
                    </span>
                    <StatusBadge value={inv.payment.status} />
                  </div>
                )}
                {inv.payment?.refundedAmount > 0 && (
                  <div className="small text-info mb-1">
                    Refund Dispatched: {money(inv.payment.refundedAmount)}
                  </div>
                )}
                {inv.refund?.status && inv.refund.status !== "none" && (
                  <div className="small d-flex align-items-center justify-content-between flex-wrap gap-2 pt-1 border-top mt-1">
                    <span><strong>Refund Claim:</strong> {inv.refund.note || "Processed under cancellation policy"}</span>
                    <StatusBadge value={inv.refund.status} />
                  </div>
                )}
              </div>

              <div className="text-center text-muted small mt-4 pt-3 border-top" style={{ fontSize: "0.74rem" }}>
                Thank you for choosing {inv.siteName || "HotelPro"}. We look forward to welcoming you back.
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
