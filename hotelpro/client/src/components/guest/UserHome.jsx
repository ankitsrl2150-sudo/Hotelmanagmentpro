import { useState } from "react";
import { Filter, Calendar, Sparkles, RotateCcw, BedDouble, SlidersHorizontal } from "lucide-react";
import Navbar from "../common/Navbar";
import RoomCard from "../common/RoomCard";
import Pagination from "../common/Pagination";
import BookingModal from "./BookingModal";
import { Loading, ErrorNote, Empty } from "../common/Misc";
import { useFetch, clean } from "../../hooks";
import { todayStr } from "../../format";
import { useToast } from "../../toast";

const EMPTY = { from: "", to: "", type: "", category: "", hotel: "", capacity: "", minPrice: "", maxPrice: "", sort: "" };

export default function UserHome() {
  const toast = useToast();
  const [f, setF] = useState(EMPTY);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const hasDates = f.from && f.to;
  const { data, loading, error, reload } = useFetch("/rooms", clean({ ...f, page, limit: 9 }));
  const { data: categories } = useFetch("/categories");
  const { data: hotels } = useFetch("/hotels");

  const set = (name, value) => {
    setPage(1);
    setF((prev) => {
      const next = { ...prev, [name]: value };
      // keep check-out after check-in
      if (next.from && next.to && next.to <= next.from) next.to = "";
      return next;
    });
  };
  const input = (name) => ({ value: f[name], onChange: (e) => set(name, e.target.value) });

  return (
    <>
      <Navbar />
      <div className="container py-4">
        {/* Page Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
          <div>
            <div className="d-inline-flex align-items-center gap-1 text-warning small fw-bold tracking-wider mb-1">
              <Sparkles size={14} />
              <span>THE COLLECTION</span>
            </div>
            <h2 className="fw-bold mb-0">Residences & Suites</h2>
          </div>
          <div className="text-muted small">
            {data ? `${data.total} sanctuary options available` : "Discover your retreat"}
          </div>
        </div>

        {/* Floating Filter Card */}
        <div className="card shadow-sm border mb-4">
          <div className="card-body p-4">
            <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
              <SlidersHorizontal size={18} className="text-warning" />
              <h6 className="fw-bold mb-0">Filter & Customize Stay</h6>
            </div>

            <div className="row g-3">
              <div className="col-6 col-md-3">
                <label className="form-label small fw-semibold">Check-in</label>
                <input type="date" className="form-control" min={todayStr()} {...input("from")} />
              </div>

              <div className="col-6 col-md-3">
                <label className="form-label small fw-semibold">Check-out</label>
                <input type="date" className="form-control" min={f.from || todayStr()} {...input("to")} />
              </div>

              <div className="col-6 col-md-3">
                <label className="form-label small fw-semibold">Suite Class</label>
                <select className="form-select" {...input("type")}>
                  <option value="">All Classes</option>
                  <option value="Delux">Deluxe Suite</option>
                  <option value="Non-Delux">Classic Room</option>
                </select>
              </div>

              <div className="col-6 col-md-3">
                <label className="form-label small fw-semibold">Category</label>
                <select className="form-select" {...input("category")}>
                  <option value="">All Categories</option>
                  {(categories || []).map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-6 col-md-3">
                <label className="form-label small fw-semibold">Hotel Property</label>
                <select className="form-select" {...input("hotel")}>
                  <option value="">All Locations</option>
                  {(hotels || []).map((h) => (
                    <option key={h._id} value={h._id}>{h.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-6 col-md-2">
                <label className="form-label small fw-semibold">Guests</label>
                <input type="number" min="1" className="form-control" placeholder="Any" {...input("capacity")} />
              </div>

              <div className="col-6 col-md-2">
                <label className="form-label small fw-semibold">Min Price (₹)</label>
                <input type="number" min="0" className="form-control" placeholder="0" {...input("minPrice")} />
              </div>

              <div className="col-6 col-md-2">
                <label className="form-label small fw-semibold">Max Price (₹)</label>
                <input type="number" min="0" className="form-control" placeholder="No limit" {...input("maxPrice")} />
              </div>

              <div className="col-6 col-md-3">
                <label className="form-label small fw-semibold">Sort By</label>
                <select className="form-select" {...input("sort")}>
                  <option value="">Suite Number</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Guest Rating</option>
                </select>
              </div>
            </div>

            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mt-3 pt-3 border-top gap-2">
              <span className={`small ${hasDates ? "text-success fw-medium" : "text-muted"}`}>
                {hasDates ? "✓ Showing suites strictly verified free on your dates." : "Tip: Select check-in and check-out dates above to unlock instant booking."}
              </span>
              <button
                className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1 align-self-start align-self-sm-auto"
                onClick={() => { setF(EMPTY); setPage(1); }}
              >
                <RotateCcw size={13} />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>
        </div>

        <ErrorNote error={error} />

        {loading && !data ? (
          <Loading text="Curating available residences..." />
        ) : data?.rooms.length === 0 ? (
          <Empty title="No matching suites found">Try adjusting your date range or price filters to discover other available rooms.</Empty>
        ) : (
          <>
            <div className="row g-4">
              {data?.rooms.map((r) => (
                <div className="col-md-6 col-lg-4" key={r._id}>
                  <RoomCard
                    room={r}
                    action={
                      <button
                        className="btn btn-primary btn-sm w-100"
                        disabled={!hasDates || r.status === "maintenance"}
                        title={!hasDates ? "Please select dates above" : ""}
                        onClick={() => setSelected(r)}
                      >
                        {r.status === "maintenance" ? "In Service" : !hasDates ? "Select Dates Above" : "Reserve Stay"}
                      </button>
                    }
                  />
                </div>
              ))}
            </div>
          </>
        )}

        <Pagination page={data?.page || 1} pages={data?.pages} onChange={setPage} />
      </div>

      {selected && (
        <BookingModal
          room={selected}
          dates={{ from: f.from, to: f.to }}
          onClose={() => setSelected(null)}
          onBooked={(msg) => { setSelected(null); toast.success(msg); reload(true); }}
        />
      )}
    </>
  );
}
