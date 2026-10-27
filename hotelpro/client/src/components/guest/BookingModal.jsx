import { useEffect, useState } from "react";
import { ShieldCheck, CreditCard, Sparkles, Lock, Calendar, User } from "lucide-react";
import { Modal, ErrorNote, Loading } from "../common/Misc";
import api, { errMsg } from "../../api";
import { money, fmtDate } from "../../format";

export default function BookingModal({ room, dates, onClose, onBooked }) {
  const [card, setCard] = useState({ cardHolderName: "", cardNumber: "", expMonthYear: "", cvv: "" });
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Format card number with spaces for display
  const formatCardNumber = (val) => {
    const raw = val.replace(/\D/g, "").slice(0, 16);
    return raw.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  };

  // The server prices the stay (seasonal rates + tax), so the guest sees exactly what they will pay.
  useEffect(() => {
    api
      .post("/bookings/quote", { roomId: room._id, fromDate: dates.from, toDate: dates.to })
      .then((r) => setQuote(r.data))
      .catch((e) => setError(errMsg(e)));
  }, [room._id, dates.from, dates.to]);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "cardNumber") {
      setCard({ ...card, cardNumber: formatCardNumber(value) });
    } else if (name === "expMonthYear") {
      let v = value.replace(/\D/g, "").slice(0, 4);
      if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2)}`;
      setCard({ ...card, expMonthYear: v });
    } else {
      setCard({ ...card, [name]: value });
    }
  };

  const pay = async (e) => {
    e.preventDefault();
    setError("");
    const digits = card.cardNumber.replace(/\s+/g, "");
    if (!card.cardHolderName || !digits || !card.expMonthYear || !card.cvv) return setError("All payment fields are required");
    if (!/^\d{12,19}$/.test(digits)) return setError("Enter a valid card number");
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expMonthYear)) return setError("Expiry must look like MM/YY");
    if (!/^\d{3,4}$/.test(card.cvv)) return setError("Enter a valid CVV");

    setLoading(true);
    try {
      const { data } = await api.post("/bookings", { roomId: room._id, fromDate: dates.from, toDate: dates.to, ...card, cardNumber: digits });
      onBooked(data.msg);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  const blocked = quote && !quote.available;

  return (
    <Modal
      title={`Confirm Reservation: Suite ${room.roomNumber}`}
      onClose={onClose}
      size="modal-lg"
      footer={
        <div className="d-flex align-items-center justify-content-between w-100">
          <div className="d-flex align-items-center gap-1 text-muted small">
            <Lock size={14} className="text-success" />
            <span>256-Bit Encrypted Checkout</span>
          </div>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              form="pay-form"
              className="btn btn-primary px-4"
              disabled={loading || !quote || blocked}
            >
              {loading ? "Processing..." : quote ? `Pay ${money(quote.totalAmount)}` : "Complete Stay"}
            </button>
          </div>
        </div>
      }
    >
      {!quote && !error ? <Loading text="Calculating exact stay pricing..." /> : null}

      {quote && (
        <div className="row g-4">
          {/* Left Column: Virtual Credit Card & Payment Form */}
          <div className="col-lg-6">
            <div className="credit-card-preview mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <div className="credit-card-chip" />
                <div className="d-flex align-items-center gap-1 text-warning small fw-bold tracking-wider">
                  <Sparkles size={14} />
                  <span>HOTELPRO PLATINUM</span>
                </div>
              </div>

              <div className="credit-card-number text-center my-3">
                {card.cardNumber || "•••• •••• •••• ••••"}
              </div>

              <div className="d-flex justify-content-between align-items-end">
                <div>
                  <div className="text-white-50 small" style={{ fontSize: "0.68rem" }}>CARDHOLDER</div>
                  <div className="credit-card-holder fw-semibold text-truncate" style={{ maxWidth: 180 }}>
                    {card.cardHolderName || "YOUR NAME"}
                  </div>
                </div>

                <div className="text-end">
                  <div className="text-white-50 small" style={{ fontSize: "0.68rem" }}>EXPIRES</div>
                  <div className="credit-card-exp fw-semibold">
                    {card.expMonthYear || "MM/YY"}
                  </div>
                </div>
              </div>
            </div>

            <ErrorNote error={error} />

            <form id="pay-form" onSubmit={pay} className="space-y-3">
              <div className="mb-2">
                <label className="form-label small fw-semibold">Cardholder Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-body-tertiary border-end-0">
                    <User size={15} className="text-muted" />
                  </span>
                  <input
                    className="form-control border-start-0 ps-1"
                    name="cardHolderName"
                    autoComplete="cc-name"
                    placeholder="e.g. Alexander Vance"
                    value={card.cardHolderName}
                    onChange={onChange}
                  />
                </div>
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold">Card Number</label>
                <div className="input-group">
                  <span className="input-group-text bg-body-tertiary border-end-0">
                    <CreditCard size={15} className="text-muted" />
                  </span>
                  <input
                    className="form-control border-start-0 ps-1"
                    name="cardNumber"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="4111 2222 3333 4444"
                    value={card.cardNumber}
                    onChange={onChange}
                  />
                </div>
              </div>

              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label small fw-semibold">Expiry Date</label>
                  <input
                    className="form-control"
                    name="expMonthYear"
                    placeholder="MM/YY"
                    autoComplete="cc-exp"
                    value={card.expMonthYear}
                    onChange={onChange}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold">CVV</label>
                  <input
                    className="form-control"
                    type="password"
                    name="cvv"
                    maxLength={4}
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="•••"
                    value={card.cvv}
                    onChange={onChange}
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Reservation & Pricing Summary */}
          <div className="col-lg-6">
            <div className="p-3 rounded-4 bg-body-tertiary border h-100 d-flex flex-column justify-content-between">
              <div>
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <Calendar size={16} className="text-warning" />
                  <span>Stay Itinerary</span>
                </h6>

                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted small">Dates</span>
                  <span className="small fw-semibold">{fmtDate(dates.from)} — {fmtDate(dates.to)}</span>
                </div>

                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted small">Duration</span>
                  <span className="small fw-semibold">{quote.totalDays} night{quote.totalDays > 1 ? "s" : ""}</span>
                </div>

                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted small">Suite Class</span>
                  <span className="badge bg-warning text-dark px-2">{room.type}</span>
                </div>

                {quote.nights.some((n) => n.rule) && (
                  <div className="py-2 border-bottom text-warning small">
                    Seasonal Rate Applied: {[...new Set(quote.nights.filter((n) => n.rule).map((n) => n.rule))].join(", ")}
                  </div>
                )}

                <div className="pt-3">
                  <div className="d-flex justify-content-between py-1 small">
                    <span className="text-muted">Nights Subtotal</span>
                    <span>{money(quote.subtotal)}</span>
                  </div>
                  <div className="d-flex justify-content-between py-1 small">
                    <span className="text-muted">Hospitality Tax ({quote.taxRate}%)</span>
                    <span>{money(quote.tax)}</span>
                  </div>
                  <div className="d-flex justify-content-between py-2 border-top mt-2 fs-5 fw-bold text-warning">
                    <span>Total Due</span>
                    <span>{money(quote.totalAmount)}</span>
                  </div>
                </div>

                {blocked && (
                  <div className="alert alert-warning py-2 mt-3 mb-0 small">
                    Notice: This suite is currently reserved for the selected period.
                  </div>
                )}
              </div>

              <div className="p-2 rounded-3 bg-white bg-opacity-50 border mt-3 text-muted small" style={{ fontSize: "0.74rem" }}>
                <ShieldCheck size={14} className="text-success me-1 d-inline" />
                Demo environment: Payment credentials are encrypted and simulated. No actual financial charge will be made.
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
