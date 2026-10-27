import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Sparkles, ArrowRight, ShieldCheck, KeyRound } from "lucide-react";
import Navbar from "./common/Navbar";
import { ErrorNote } from "./common/Misc";
import api, { errMsg } from "../api";
import { saveSession, homeFor } from "../auth";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) return setError("Email and password are required");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      saveSession(data.token, data.user);
      navigate(homeFor(data.user));
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (email, password) => {
    setForm({ email, password });
  };

  return (
    <>
      <Navbar />
      <div className="container py-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
        <div className="card shadow-lg border-0 w-100" style={{ maxWidth: 460, borderRadius: 24 }}>
          <div className="card-body p-4 p-md-5">
            {/* Brand Header */}
            <div className="text-center mb-4">
              <div
                className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-4 shadow-sm"
                style={{
                  width: 52,
                  height: 52,
                  background: "linear-gradient(135deg, #f59e0b, #b45309)",
                  color: "#fff"
                }}
              >
                <Sparkles size={24} />
              </div>
              <h3 className="fw-bold mb-1">Welcome Back</h3>
              <p className="text-muted small mb-0">Sign in to manage your luxury reservations & services</p>
            </div>

            <ErrorNote error={error} />

            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-body-tertiary border-end-0">
                    <Mail size={16} className="text-muted" />
                  </span>
                  <input
                    className="form-control border-start-0 ps-1"
                    type="email"
                    name="email"
                    autoComplete="username"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={onChange}
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-semibold mb-0">Password</label>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-body-tertiary border-end-0">
                    <Lock size={16} className="text-muted" />
                  </span>
                  <input
                    className="form-control border-start-0 ps-1"
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={onChange}
                  />
                </div>
              </div>

              <button
                className="btn btn-primary w-100 py-2.5 mb-3 d-flex align-items-center justify-content-center gap-2"
                disabled={loading}
              >
                <span>{loading ? "Authenticating..." : "Sign In"}</span>
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Quick Demo Access Bar */}
            <div className="p-3 rounded-3 bg-body-tertiary border mt-2">
              <div className="d-flex align-items-center gap-1 text-muted small fw-semibold mb-2">
                <KeyRound size={13} className="text-warning" />
                <span>Quick Demo Accounts:</span>
              </div>
              <div className="d-flex flex-wrap gap-1.5">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary py-0.5 px-2 text-xs"
                  onClick={() => fillDemo("guest@hotelpro.com", "guest123")}
                >
                  Guest
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary py-0.5 px-2 text-xs"
                  onClick={() => fillDemo("staff@hotelpro.com", "staff123")}
                >
                  Front Desk
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary py-0.5 px-2 text-xs"
                  onClick={() => fillDemo("admin@hotelpro.com", "admin123")}
                >
                  Admin
                </button>
              </div>
            </div>

            <div className="text-center mt-4 pt-2 border-top">
              <span className="small text-muted">Don't have a luxury account? </span>
              <Link to="/signup" className="small fw-semibold text-warning text-decoration-none">
                Register Here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
