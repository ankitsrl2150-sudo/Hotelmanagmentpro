import { Link } from "react-router-dom";
import { Users, MapPin, Eye, Sparkles } from "lucide-react";
import { assetUrl } from "../../api";
import { money } from "../../format";
import { Stars } from "./Misc";
import StatusBadge from "./StatusBadge";

export default function RoomCard({ room, action, showStatus = false }) {
  const isDelux = room.type === "Delux";

  return (
    <div className="card room-card h-100 shadow-sm d-flex flex-column">
      {/* Image Container with Floating Badges */}
      <div className="room-card-img-wrap">
        <img
          src={assetUrl(room.photos?.[0]) || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"}
          alt={`Room ${room.roomNumber}`}
          loading="lazy"
        />

        <div className={`room-type-tag ${isDelux ? "delux" : ""}`}>
          {isDelux ? "✦ Deluxe Suite" : "Classic Room"}
        </div>

        {showStatus && (
          <div className="position-absolute" style={{ top: 14, right: 14, zIndex: 3 }}>
            <StatusBadge value={room.status} />
          </div>
        )}

        <div className="room-price-pill">
          <span>{money(room.rentPerDay)}</span>
          <small>/ night</small>
        </div>
      </div>

      {/* Card Content */}
      <div className="card-body p-4 d-flex flex-column flex-grow-1">
        {(room.hotel?.name || room.category?.name) && (
          <div className="d-flex align-items-center gap-1 text-muted small mb-1">
            <MapPin size={13} className="text-warning flex-shrink-0" />
            <span className="text-truncate">
              {[room.hotel?.name, room.category?.name].filter(Boolean).join(" · ")}
            </span>
          </div>
        )}

        <h5 className="card-title fw-bold mb-2 d-flex align-items-center justify-content-between">
          <span>Suite {room.roomNumber}</span>
        </h5>

        <div className="d-flex align-items-center justify-content-between mb-2">
          <Stars value={room.avgRating} count={room.reviewCount} />
          <span className="small text-muted d-inline-flex align-items-center gap-1">
            <Users size={14} className="opacity-75" />
            <span>Up to {room.maxCount} guests</span>
          </span>
        </div>

        <p className="small text-muted mb-3 flex-grow-1" style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden"
        }}>
          {room.description || "Thoughtfully designed suite featuring contemporary appointments and premium luxury bedding."}
        </p>

        {/* Action Buttons */}
        <div className="d-flex gap-2 pt-2 border-top" style={{ borderColor: "var(--border-subtle)" }}>
          <Link
            to={`/rooms/${room._id}`}
            className="btn btn-outline-secondary btn-sm flex-grow-1 d-inline-flex align-items-center justify-content-center gap-1"
          >
            <Eye size={14} />
            <span>Details</span>
          </Link>
          {action && <div className="flex-grow-1">{action}</div>}
        </div>
      </div>
    </div>
  );
}
