import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Bell,
  Sun,
  Moon,
  LogOut,
  User,
  BedDouble,
  CalendarCheck,
  Headphones,
  LayoutDashboard,
  ConciergeBell,
  LogIn,
  UserPlus
} from "lucide-react";
import { getUser, clearSession, homeFor } from "../../auth";
import { applyTheme, getTheme } from "../../theme";
import api from "../../api";

export default function Navbar() {
  const user = getUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [theme, setTheme] = useState(getTheme());

  // Poll for new notifications every 30 seconds.
  useEffect(() => {
    if (!user) return undefined;
    let alive = true;
    const check = () =>
      api
        .get("/notifications/unread-count")
        .then((r) => alive && setUnread(r.data.unread))
        .catch(() => {});
    check();
    const t = setInterval(check, 30000);
    return () => {
      alive = false;
      clearInterval(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user && user._id]);

  const logout = () => {
    clearSession();
    navigate("/");
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  };

  const link = (to, text, Icon) => (
    <li className="nav-item">
      <NavLink className="nav-link d-inline-flex align-items-center gap-2" to={to} end onClick={() => setOpen(false)}>
        {Icon && <Icon size={16} className="opacity-75" />}
        <span>{text}</span>
      </NavLink>
    </li>
  );

  return (
    <nav className="navbar navbar-expand-lg brand-nav no-print">
      <div className="container">
        <Link className="navbar-brand" to={homeFor(user)}>
          <div className="brand-logo-icon">
            <Sparkles size={18} />
          </div>
          <span className="fw-bold">Hotel<span style={{ color: "var(--brand-primary)" }}>Pro</span></span>
        </Link>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse ${open ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1 py-2 py-lg-0">
            {!user && (
              <>
                {link("/", "Home")}
                {link("/login", "Sign In", LogIn)}
                {link("/signup", "Register", UserPlus)}
              </>
            )}

            {user?.userType === "Ordinary" && (
              <>
                {link("/user", "Suites", BedDouble)}
                {link("/user/bookings", "My Stays", CalendarCheck)}
                {link("/services", "Services", ConciergeBell)}
                {link("/support", "Support", Headphones)}
              </>
            )}

            {user && user.userType !== "Ordinary" && link(homeFor(user), "Dashboard", LayoutDashboard)}

            {user && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link d-inline-flex align-items-center gap-1" to="/notifications" onClick={() => setOpen(false)}>
                    <Bell size={16} />
                    <span>Alerts</span>
                    {unread > 0 && (
                      <span className="badge rounded-pill bg-danger ms-1 px-2 py-1" style={{ fontSize: "0.7rem" }}>
                        {unread}
                      </span>
                    )}
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    className="nav-link d-inline-flex align-items-center gap-2"
                    to="/profile"
                    onClick={() => setOpen(false)}
                  >
                    <span className="user-badge-pill">
                      <User size={13} />
                      <span>{user.name?.split(" ")[0] || "Profile"}</span>
                      {user.userType !== "Ordinary" && (
                        <span className="badge bg-secondary ms-1 py-0 px-1" style={{ fontSize: "0.65rem" }}>
                          {user.userType}
                        </span>
                      )}
                    </span>
                  </NavLink>
                </li>
              </>
            )}

            {/* Theme Toggle Button */}
            <li className="nav-item ms-lg-2">
              <button
                className="btn btn-sm btn-outline-secondary rounded-circle p-2 d-inline-flex align-items-center justify-content-center"
                style={{ width: 36, height: 36 }}
                onClick={toggleTheme}
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                aria-label="Toggle dark mode"
              >
                {theme === "dark" ? <Sun size={16} className="text-warning" /> : <Moon size={16} />}
              </button>
            </li>

            {user && (
              <li className="nav-item ms-lg-1">
                <button
                  className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1"
                  onClick={logout}
                  title="Sign out of account"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
