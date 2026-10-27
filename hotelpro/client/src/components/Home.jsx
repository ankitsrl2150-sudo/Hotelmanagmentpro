import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ShieldCheck,
  Clock,
  Coffee,
  Compass,
  ArrowRight,
  Star,
  MapPin,
  Calendar,
  Users,
  Search,
  Award,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import Navbar from "./common/Navbar";
import RoomCard from "./common/RoomCard";
import { Loading, Empty } from "./common/Misc";
import { useFetch } from "../hooks";
import { getUser, homeFor } from "../auth";
import { todayStr } from "../format";

export default function Home() {
  const user = getUser();
  const navigate = useNavigate();
  const { data, loading } = useFetch("/rooms", { limit: 3, sort: "rating" });
  const { data: settings } = useFetch("/settings/public");
  const rooms = data?.rooms || [];

  const [searchDates, setSearchDates] = useState({
    from: "",
    to: "",
    type: "",
    guests: "2"
  });

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (user) {
      navigate("/user");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="landing-page-wrapper">
      <Navbar />

      {/* Cinematic Hero Section */}
      <header className="hero">
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="text-center max-w-3xl mx-auto">
            <div className="hero-pill-badge">
              <Sparkles size={14} className="text-warning" />
              <span>Sanctuary of Refined Hospitality</span>
            </div>

            <h1 className="hero-title text-white">
              Where Elegance Meets <span className="gold-accent">Timeless Luxury</span>
            </h1>

            <p className="hero-lead">
              Immerse yourself in world-class architecture, Michelin-inspired cuisine, and bespoke concierge service at {settings?.siteName || "HotelPro"}.
            </p>

            {/* Interactive Luxury Search Bar Capsule */}
            <div className="luxury-search-capsule text-start mx-auto" style={{ maxWidth: 940 }}>
              <form onSubmit={handleHeroSearch} className="row g-3 align-items-end">
                <div className="col-12 col-md-3">
                  <label className="form-label d-flex align-items-center gap-1">
                    <Calendar size={13} className="text-warning" />
                    <span>Check-In</span>
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    min={todayStr()}
                    value={searchDates.from}
                    onChange={(e) => setSearchDates({ ...searchDates, from: e.target.value })}
                  />
                </div>

                <div className="col-12 col-md-3">
                  <label className="form-label d-flex align-items-center gap-1">
                    <Calendar size={13} className="text-warning" />
                    <span>Check-Out</span>
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    min={searchDates.from || todayStr()}
                    value={searchDates.to}
                    onChange={(e) => setSearchDates({ ...searchDates, to: e.target.value })}
                  />
                </div>

                <div className="col-6 col-md-3">
                  <label className="form-label d-flex align-items-center gap-1">
                    <Users size={13} className="text-warning" />
                    <span>Guests & Suite</span>
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={searchDates.type}
                    onChange={(e) => setSearchDates({ ...searchDates, type: e.target.value })}
                  >
                    <option value="">All Suites</option>
                    <option value="Delux">Deluxe Suite</option>
                    <option value="Non-Delux">Classic Room</option>
                  </select>
                </div>

                <div className="col-6 col-md-3">
                  <button type="submit" className="btn btn-primary w-100 btn-sm py-2">
                    <Search size={15} />
                    <span>{user ? "Explore Suites" : "Find Room"}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Metrics Ticker */}
            <div className="d-flex flex-wrap justify-content-center align-items-center gap-4 mt-4 pt-3 text-white-50 small">
              <span className="d-inline-flex align-items-center gap-1 text-white">
                <Star size={15} className="text-warning fill-warning" /> 4.95 / 5 Verified Guest Rating
              </span>
              <span>•</span>
              <span className="d-inline-flex align-items-center gap-1 text-white">
                <CheckCircle2 size={15} className="text-success" /> Instant Confirmation
              </span>
              <span>•</span>
              <span className="d-inline-flex align-items-center gap-1 text-white">
                <ShieldCheck size={15} className="text-info" /> Best Rate Guaranteed
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Luxury Value Pillars */}
      <section className="py-5" style={{ background: "var(--bg-page)" }}>
        <div className="container py-3">
          <div className="text-center mb-5">
            <span className="text-uppercase fw-bold text-warning small tracking-wider">Unmatched Excellence</span>
            <h2 className="display-6 fw-bold mt-1">Crafted for the Discerning Traveler</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: 560 }}>
              Every touchpoint of your stay is designed with absolute precision, quiet luxury, and impeccable service.
            </p>
          </div>

          <div className="row g-4">
            {[
              {
                icon: Clock,
                title: "Live Real-Time Inventory",
                desc: "Rooms synchronize instantly across our global booking engine. Never experience double-booking or outdated room status.",
              },
              {
                icon: ShieldCheck,
                title: "Transparent Pricing & Invoice",
                desc: "Zero hidden charges. Itemized taxes, seasonal rates, and instant PDF invoices ready at the click of a button.",
              },
              {
                icon: Coffee,
                title: "Curated In-Room Dining",
                desc: "Request artisanal breakfasts, spa treatments, and late check-outs directly through your personal guest portal.",
              },
            ].map((item, idx) => (
              <div className="col-md-4" key={idx}>
                <div className="feature-card">
                  <div className="feature-icon-wrapper">
                    <item.icon size={26} />
                  </div>
                  <h4 className="h5 fw-bold mb-2">{item.title}</h4>
                  <p className="text-muted small mb-0 lh-base">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Suites Showcase */}
      <section className="container py-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
          <div>
            <span className="text-uppercase fw-bold text-warning small">Featured Residences</span>
            <h2 className="display-6 fw-bold mb-1">Our Top-Rated Suites</h2>
            <p className="text-muted mb-0">Handpicked retreats offering panoramic views and ultra-luxurious amenities.</p>
          </div>
          {user ? (
            <Link to="/user" className="btn btn-outline-primary d-inline-flex align-items-center gap-2">
              <span>View All Suites</span>
              <ArrowRight size={16} />
            </Link>
          ) : (
            <Link to="/signup" className="btn btn-outline-primary d-inline-flex align-items-center gap-2">
              <span>Join Members Club</span>
              <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {loading ? (
          <Loading text="Loading luxury residences..." />
        ) : rooms.length === 0 ? (
          <Empty>No suites currently listed.</Empty>
        ) : (
          <div className="row g-4">
            {rooms.map((r) => (
              <div className="col-md-4" key={r._id}>
                <RoomCard
                  room={r}
                  action={
                    !user ? (
                      <Link to="/login" className="btn btn-primary btn-sm w-100">
                        Book Stay
                      </Link>
                    ) : (
                      <Link to={`/rooms/${r._id}`} className="btn btn-primary btn-sm w-100">
                        Reserve Now
                      </Link>
                    )
                  }
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Experience Highlights Banner */}
      <section className="container py-4 mb-5">
        <div
          className="p-4 p-md-5 rounded-4 position-relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0b1120 0%, #172554 100%)",
            color: "#ffffff"
          }}
        >
          <div className="row align-items-center g-4 position-relative" style={{ zIndex: 2 }}>
            <div className="col-lg-8">
              <span className="badge bg-warning text-dark px-3 py-1 fw-bold rounded-pill mb-3">EXCLUSIVE PERKS</span>
              <h2 className="display-6 fw-bold mb-2">Elevate Your Stay with HotelPro Privileges</h2>
              <p className="text-light opacity-75 mb-0" style={{ maxWidth: 600 }}>
                Enjoy complimentary high-speed Wi-Fi, priority early check-in, flexible cancellation, and 24/7 dedicated support for all reservations.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              {user ? (
                <Link to={homeFor(user)} className="btn btn-light btn-lg px-4 shadow">
                  Access Portal <ChevronRight size={18} />
                </Link>
              ) : (
                <div className="d-flex flex-column flex-sm-row justify-content-lg-end gap-2">
                  <Link to="/signup" className="btn btn-primary btn-lg px-4 shadow">
                    Create Account
                  </Link>
                  <Link to="/login" className="btn btn-outline-light btn-lg px-4">
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Aesthetic Luxury Footer */}
      <footer className="border-top py-5" style={{ background: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
        <div className="container">
          <div className="row g-4 justify-content-between">
            <div className="col-lg-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="brand-logo-icon" style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #f59e0b, #b45309)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                  <Sparkles size={16} />
                </div>
                <h5 className="fw-bold mb-0">Hotel<span style={{ color: "var(--brand-primary)" }}>Pro</span></h5>
              </div>
              <p className="text-muted small mb-3">
                The quintessential standard of luxury hospitality. Seamless booking, refined stays, and impeccable concierge care.
              </p>
              <div className="text-muted small">
                © {new Date().getFullYear()} HotelPro Luxury Resorts. All rights reserved.
              </div>
            </div>

            <div className="col-6 col-md-3 col-lg-2">
              <h6 className="fw-bold mb-3 small text-uppercase">Residences</h6>
              <ul className="list-unstyled text-muted small d-flex flex-column gap-2 mb-0">
                <li><Link to="/user" className="text-reset text-decoration-none hover-primary">Deluxe Suites</Link></li>
                <li><Link to="/user" className="text-reset text-decoration-none hover-primary">Penthouse Villas</Link></li>
                <li><Link to="/user" className="text-reset text-decoration-none hover-primary">Oceanfront Rooms</Link></li>
                <li><Link to="/user" className="text-reset text-decoration-none hover-primary">Executive Lounges</Link></li>
              </ul>
            </div>

            <div className="col-6 col-md-3 col-lg-2">
              <h6 className="fw-bold mb-3 small text-uppercase">Hospitality</h6>
              <ul className="list-unstyled text-muted small d-flex flex-column gap-2 mb-0">
                <li><Link to="/services" className="text-reset text-decoration-none">Private Dining</Link></li>
                <li><Link to="/services" className="text-reset text-decoration-none">Wellness & Spa</Link></li>
                <li><Link to="/support" className="text-reset text-decoration-none">Concierge Support</Link></li>
                <li><Link to="/services" className="text-reset text-decoration-none">Airport Chauffeur</Link></li>
              </ul>
            </div>

            <div className="col-md-6 col-lg-3">
              <h6 className="fw-bold mb-3 small text-uppercase">Assurance & Trust</h6>
              <p className="text-muted small mb-2">
                Verified secure encrypted transactions. Strict confidentiality and 100% privacy compliance.
              </p>
              <div className="d-flex align-items-center gap-2 text-warning small fw-semibold">
                <Award size={16} />
                <span>5-Star World Luxury Hotel Awardee</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
