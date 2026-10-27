import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);

  const push = useCallback((kind, text) => {
    const id = Math.random().toString(36).slice(2);
    setItems((list) => [...list, { id, kind, text }]);
    setTimeout(() => setItems((list) => list.filter((i) => i.id !== id)), 4500);
  }, []);

  const dismiss = (id) => {
    setItems((list) => list.filter((i) => i.id !== id));
  };

  const api = useMemo(
    () => ({
      success: (t) => push("success", t),
      error: (t) => push("danger", t),
      info: (t) => push("primary", t),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="position-fixed top-0 end-0 p-3 no-print"
        style={{ zIndex: 9999, maxWidth: 380, width: "100%", pointerEvents: "none" }}
      >
        {items.map((i) => {
          const isSuccess = i.kind === "success";
          const isDanger = i.kind === "danger";

          return (
            <div
              key={i.id}
              className={`toast-luxury ${i.kind}`}
              style={{ pointerEvents: "auto" }}
              role="alert"
            >
              <div className="flex-shrink-0">
                {isSuccess && <CheckCircle2 size={20} className="text-success" />}
                {isDanger && <AlertTriangle size={20} className="text-danger" />}
                {!isSuccess && !isDanger && <Info size={20} className="text-warning" />}
              </div>
              <div className="flex-grow-1 small fw-medium">{i.text}</div>
              <button
                type="button"
                className="btn btn-link text-muted p-0 border-0 flex-shrink-0"
                onClick={() => dismiss(i.id)}
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
