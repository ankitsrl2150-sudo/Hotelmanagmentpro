import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Users, Sparkles, CheckCircle2, ShieldCheck, CalendarCheck, MessageSquare } from "lucide-react";
import Navbar from "../common/Navbar";
import Pagination from "../common/Pagination";
import StatusBadge from "../common/StatusBadge";
import { Loading, ErrorNote, Empty, Stars } from "../common/Misc";
import { useFetch } from "../../hooks";
import { assetUrl } from "../../api";
import { money, fmtDate } from "../../format";
import { getUser } from "../../auth";

export default function RoomDetails() {
  const { id } = useParams();
  const user = getUser();
  const [page, setPage] = useState(1);
  const [photo, setPhoto] = useState(0);
  const { data: room, loading, error } = useFetch(`/rooms/${id}`);
  const { data: reviews } = useFetch("/reviews", { room: id, page, limit: 5 });

  const fallbackPhoto = "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85";

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <Link
          to={user ? "/user" : "/"}
          className="btn btn-outline-secondary btn-sm mb-4 d-inline-flex align-items-center gap-1"
        >
          <ArrowLeft size={15} />
          <span>Return to Collection</span>
        </Link>

        <ErrorNote error={error} />

        {loading ? (
          <Loading text="Loading suite specifications..." />
        ) : room && (
          <div className="row g-4">
            {/* Gallery Column */}
            <div className="col-lg-7">
              <div className="rounded-4 overflow-hidden shadow-sm position-relative border" style={{ maxHeight: 460 }}>
                <img
                  src={assetUrl(room.photos?.[photo]) || fallbackPhoto}
                  alt={`Room ${room.roomNumber}`}
                  className="w-100 object-fit-cover"
                  style={{ height: 440 }}
                />
                <div className="position-absolute top-0 start-0 m-3">
                  <span className={`badge ${room.type === "Delux" ? "bg-warning text-dark" : "bg-dark"} px-3 py-2 rounded-pill fw-bold`}>
                    {room.type === "Delux" ? "✦ Deluxe Signature Suite" : "Classic Room"}
                  </span>
                </div>
              </div>

              {room.photos?.length > 1 && (
                <div className="d-flex gap-2 mt-3 flex-wrap">
                  {room.photos.map((p, i) => (
                    <img
                      key={p}
                      src={assetUrl(p)}
                      alt=""
                      className={`thumb rounded-3 shadow-xs ${i === photo ? "border border-warning border-2 opacity-100" : "opacity-60"}`}
                      style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                      onClick={() => setPhoto(i)}
                      loading="lazy"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Suite Specifications Sidebar */}
            <div className="col-lg-5">
              <div className="card shadow-sm p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-warning small fw-bold tracking-wider text-uppercase">Exclusive Sanctuary</span>
                    <StatusBadge value={room.status} />
                  </div>

                  <h2 className="fw-bold mb-2">Suite {room.roomNumber}</h2>

                  {(room.hotel?.name || room.category?.name) && (
                    <div className="d-flex align-items-center gap-1 text-muted small mb-2">
                      <MapPin size={14} className="text-warning" />
                      <span>{[room.hotel?.name, room.hotel?.city, room.category?.name].filter(Boolean).join(" · ")}</span>
                    </div>
                  )}

                  <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
                    <Stars value={room.avgRating} count={room.reviewCount} />
                    <span className="small text-muted d-inline-flex align-items-center gap-1">
                      <Users size={14} /> Up to {room.maxCount} guests
                    </span>
                  </div>

                  <div className="mb-4">
                    <span className="display-6 fw-bold text-warning">{money(room.rentPerDay)}</span>
                    <span className="text-muted small ms-1">/ night + taxes</span>
                  </div>

                  <p className="small text-muted lh-base mb-4">
                    {room.description || "Immerse yourself in elevated comforts, bespoke artisan furnishings, and personalized concierge attention tailored to your exact desires."}
                  </p>

                  {room.amenities?.length > 0 && (
                    <div className="mb-4">
                      <h6 className="small fw-bold text-uppercase text-muted mb-2">Suite Amenities</h6>
                      <div className="d-flex flex-wrap gap-1.5">
                        {room.amenities.map((a) => (
                          <span key={a} className="badge bg-body-secondary text-body border px-2.5 py-1.5 rounded-pill small fw-normal">
                            <CheckCircle2 size={12} className="text-success me-1 d-inline" />
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-top">
                  {user?.userType === "Ordinary" ? (
                    <Link to="/user" className="btn btn-primary w-100 py-2.5 d-flex align-items-center justify-content-center gap-2">
                      <CalendarCheck size={18} />
                      <span>Select Dates & Reserve</span>
                    </Link>
                  ) : !user ? (
                    <Link to="/login" className="btn btn-primary w-100 py-2.5 d-flex align-items-center justify-content-center gap-2">
                      <span>Sign In to Reserve</span>
                    </Link>
                  ) : null}
                  <div className="text-center mt-2">
                    <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                      <ShieldCheck size={13} className="text-success me-1 d-inline" />
                      Complimentary cancellation up to 48 hours before arrival.
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Reviews Section */}
            <div className="col-12 mt-5">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <MessageSquare size={20} className="text-warning" />
                  <span>Verified Guest Reviews</span>
                </h4>
                {reviews && <span className="text-muted small">{reviews.total} total reviews</span>}
              </div>

              {!reviews ? (
                <Loading text="Loading guest reflections..." />
              ) : reviews.items.length === 0 ? (
                <Empty title="No reviews yet">Be among the first guests to share your impressions of Suite {room.roomNumber}.</Empty>
              ) : (
                <div className="row g-3">
                  {reviews.items.map((r) => (
                    <div key={r._id} className="col-md-6">
                      <div className="card shadow-xs p-3 h-100 border">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="fw-semibold small">{r.user?.name || "Verified Resident"}</div>
                          <small className="text-muted" style={{ fontSize: "0.72rem" }}>{fmtDate(r.createdAt)}</small>
                        </div>
                        <div className="mb-2">
                          <Stars value={r.rating} />
                        </div>
                        {r.comment && <p className="small text-muted mb-0">{r.comment}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Pagination page={reviews?.page || 1} pages={reviews?.pages} onChange={setPage} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
