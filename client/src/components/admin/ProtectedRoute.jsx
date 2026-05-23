import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authStore } from "../../store/authStore";
import { authApi } from "../../services/authApi";
import Loader from "../common/Loader";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const [state, setState] = useState({ status: "checking", user: authStore.getUser() });

  useEffect(() => {
    let active = true;

    const verify = async () => {
      try {
        const response = await authApi.me();
        const user = response.data.data?.user || response.data.data;
        if (user?.role === "admin") {
          authStore.setUser(user);
          if (active) setState({ status: "ready", user });
          return;
        }
        authStore.clearUser();
        if (active) setState({ status: "denied", user: null });
      } catch {
        authStore.clearUser();
        if (active) setState({ status: "denied", user: null });
      }
    };

    verify();
    return () => {
      active = false;
    };
  }, []);

  if (state.status === "checking") {
    return <Loader label="Verifying admin session..." />;
  }

  if (!state.user || state.user.role !== "admin") {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export default ProtectedRoute;
