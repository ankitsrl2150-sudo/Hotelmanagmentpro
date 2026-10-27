import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import Navbar from "./common/Navbar";
import { Loading } from "./common/Misc";
import api, { errMsg } from "../api";

export default function VerifyEmail() {
  const { token } = useParams();
  const [state, setState] = useState({ loading: true, ok: false, msg: "" });

  useEffect(() => {
    api
      .get(`/auth/verify/${token}`)
      .then((r) => setState({ loading: false, ok: true, msg: r.data.msg }))
      .catch((e) => setState({ loading: false, ok: false, msg: errMsg(e) }));
  }, [token]);

  return (
    <>
      <Navbar />
      <div className="container py-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "75vh" }}>
        <div className="card shadow-lg border-0 w-100 p-4 p-md-5 text-center" style={{ maxWidth: 480, borderRadius: 24 }}>
          {state.loading ? (
            <Loading text="Verifying your membership email..." />
          ) : (
            <div>
              <div
                className={`mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle ${
                  state.ok ? "text-success bg-success-subtle" : "text-danger bg-danger-subtle"
                }`}
                style={{ width: 64, height: 64 }}
              >
                {state.ok ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
              </div>
              <h4 className="fw-bold mb-2">{state.ok ? "Email Verified" : "Verification Failed"}</h4>
              <p className="text-muted small mb-4">{state.msg}</p>
              <Link to="/login" className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2">
                <span>Proceed to Sign In</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
