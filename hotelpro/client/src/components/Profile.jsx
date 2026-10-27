import { useState } from "react";
import { User, Shield, KeyRound, CheckCircle2, Phone, Mail, Sparkles, Save } from "lucide-react";
import Navbar from "./common/Navbar";
import { ErrorNote } from "./common/Misc";
import api, { errMsg } from "../api";
import { getUser, updateStoredUser } from "../auth";
import { useToast } from "../toast";

export default function Profile() {
  const toast = useToast();
  const [user, setUser] = useState(getUser());
  const [form, setForm] = useState({ name: user.name, phone: user.phone });
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [err1, setErr1] = useState("");
  const [err2, setErr2] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPw, setLoadingPw] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setErr1("");
    setLoadingProfile(true);
    try {
      const { data } = await api.put("/auth/profile", form);
      updateStoredUser(data.user);
      setUser(data.user);
      toast.success("Profile updated successfully");
    } catch (e2) {
      setErr1(errMsg(e2));
    } finally {
      setLoadingProfile(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setErr2("");
    if (pw.newPassword.length < 6) return setErr2("New password must be at least 6 characters");
    if (pw.newPassword !== pw.confirm) return setErr2("New passwords do not match");
    setLoadingPw(true);
    try {
      await api.put("/auth/password", { currentPassword: pw.currentPassword, newPassword: pw.newPassword });
      setPw({ currentPassword: "", newPassword: "", confirm: "" });
      toast.success("Password updated successfully");
    } catch (e2) {
      setErr2(errMsg(e2));
    } finally {
      setLoadingPw(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-4" style={{ maxWidth: 760 }}>
        <div className="mb-4">
          <div className="d-inline-flex align-items-center gap-1 text-warning small fw-bold tracking-wider mb-1">
            <Sparkles size={14} />
            <span>ACCOUNT SETTINGS</span>
          </div>
          <h2 className="fw-bold mb-0">Member Profile</h2>
        </div>

        {/* Profile Card Header */}
        <div className="card shadow-sm p-4 border mb-4">
          <div className="d-flex align-items-center gap-3 pb-3 border-bottom mb-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-4"
              style={{
                width: 60,
                height: 60,
                background: "linear-gradient(135deg, #d97706, #b45309)",
                boxShadow: "0 4px 12px rgba(217, 119, 6, 0.3)"
              }}
            >
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h4 className="fw-bold mb-0">{user.name}</h4>
              <div className="text-muted small d-flex align-items-center gap-2 flex-wrap">
                <span>{user.email}</span>
                <span>•</span>
                <span className="badge bg-body-secondary text-body">
                  {user.userType === "Ordinary" ? "Guest Resident" : user.userType}
                </span>
                {user.emailVerified ? (
                  <span className="badge bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-1">
                    <CheckCircle2 size={12} /> Verified
                  </span>
                ) : (
                  <span className="badge bg-warning-subtle text-warning border border-warning-subtle">
                    Unverified
                  </span>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={saveProfile}>
            <ErrorNote error={err1} />
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Full Legal Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-body-tertiary border-end-0">
                    <User size={15} className="text-muted" />
                  </span>
                  <input
                    className="form-control border-start-0 ps-1"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Phone Number</label>
                <div className="input-group">
                  <span className="input-group-text bg-body-tertiary border-end-0">
                    <Phone size={15} className="text-muted" />
                  </span>
                  <input
                    className="form-control border-start-0 ps-1"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="mt-3 text-end">
              <button className="btn btn-primary btn-sm px-3" disabled={loadingProfile}>
                <Save size={14} className="me-1 d-inline" />
                {loadingProfile ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>

        {/* Security & Password Card */}
        <div className="card shadow-sm p-4 border">
          <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
            <KeyRound size={18} className="text-warning" />
            <h5 className="fw-bold mb-0">Update Password</h5>
          </div>

          <form onSubmit={savePassword}>
            <ErrorNote error={err2} />
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label small fw-semibold">Current Password</label>
                <input
                  className="form-control"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={pw.currentPassword}
                  onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-semibold">New Password</label>
                <input
                  className="form-control"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Min 6 chars"
                  value={pw.newPassword}
                  onChange={(e) => setPw({ ...pw, newPassword: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-semibold">Confirm Password</label>
                <input
                  className="form-control"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat new password"
                  value={pw.confirm}
                  onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-3 text-end">
              <button className="btn btn-outline-primary btn-sm px-3" disabled={loadingPw}>
                {loadingPw ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
