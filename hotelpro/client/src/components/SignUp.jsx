import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, Sparkles, UserPlus } from "lucide-react";
import Navbar from "./common/Navbar";
import { ErrorNote } from "./common/Misc";
import api, { errMsg } from "../api";
import { useFetch } from "../hooks";
import { useToast } from "../toast";

export default function SignUp() {
  const [form, setForm] = useState({ name: "", email: "", password: "", cpassword: "", phone: "", userType: "Ordinary" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { data: settings } = useFetch("/settings/public");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const { name, email, password, cpassword, phone, userType } = form;
    if (!name || !email || !password || !cpassword || !phone) return setError("All fields are required");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    if (password !== cpassword) return setError("Passwords do not match");
    if (!/^[+\d][\d\s-]{6,}$/.test(phone)) return setError("Enter a valid phone number");

    setLoading(true);
    try {
      await api.post("/auth/signup", { name, email, password, phone, userType });
      toast.success("Account created. Check your email for the verification link, then log in.");
      navigate("/login");
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "85vh" }}>
        <div className="card shadow-lg border-0 w-100" style={{ maxWidth: 500, borderRadius: 24 }}>
          <div className="card-body p-4 p-md-5">
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
                <UserPlus size={24} />
              </div>
              <h3 className="fw-bold mb-1">Create an Account</h3>
              <p className="text-muted small mb-0">Join HotelPro for exclusive privileges and reservations</p>
            </div>

            <ErrorNote error={error} />

            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-body-tertiary border-end-0">
                    <User size={16} className="text-muted" />
                  </span>
                  <input
                    className="form-control border-start-0 ps-1"
                    name="name"
                    placeholder="e.g. John Doe"
                    value={form.name}
                    onChange={onChange}
                  />
                </div>
              </div>

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
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={onChange}
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Password</label>
                  <input
                    className="form-control"
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    placeholder="Min 6 chars"
                    value={form.password}
                    onChange={onChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Confirm Password</label>
                  <input
                    className="form-control"
                    type="password"
                    name="cpassword"
                    autoComplete="new-password"
                    placeholder="Repeat password"
                    value={form.cpassword}
                    onChange={onChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Phone Number</label>
                <div className="input-group">
                  <span className="input-group-text bg-body-tertiary border-end-0">
                    <Phone size={16} className="text-muted" />
                  </span>
                  <input
                    className="form-control border-start-0 ps-1"
                    name="phone"
                    placeholder="+1 234 567 890"
                    value={form.phone}
                    onChange={onChange}
                  />
                </div>
              </div>

              {settings?.allowPrivilegedSignup && (
                <div className="mb-3 p-3 rounded-3 bg-body-tertiary border">
                  <label className="form-label small fw-semibold">Account Role (Demo Enabled)</label>
                  <select className="form-select form-select-sm" name="userType" value={form.userType} onChange={onChange}>
                    <option value="Ordinary">Guest (Resident)</option>
                    <option value="Staff">Hotel Staff / Concierge</option>
                    <option value="Admin">System Administrator</option>
                  </select>
                </div>
              )}

              <button className="btn btn-primary w-100 py-2.5 mb-3" disabled={loading}>
                {loading ? "Registering Account..." : "Create Account"}
              </button>
            </form>

            <div className="text-center mt-3 pt-2 border-top">
              <span className="small text-muted">Already registered? </span>
              <Link to="/login" className="small fw-semibold text-warning text-decoration-none">
                Sign In Instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
