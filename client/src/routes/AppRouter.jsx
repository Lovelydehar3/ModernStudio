import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "../components/admin/ProtectedRoute";
import PageLoader from "../components/common/PageLoader";
import ErrorBoundary from "../components/common/ErrorBoundary";
import { publicRouteItems } from "./PublicRoutes";
import { adminRouteItems } from "./AdminRoutes";

const AdminLoginPage = lazy(() => import("../pages/admin/AdminLoginPage"));
const UserLoginPage = lazy(() => import("../pages/public/UserLoginPage"));
const ResetPasswordPage = lazy(() => import("../pages/public/ResetPasswordPage"));
const NotFoundPage = lazy(() => import("../pages/public/NotFoundPage"));

function AppRouter() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<PublicLayout />}>
            {publicRouteItems.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>

          <Route path="/login" element={<UserLoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {adminRouteItems.map((route) => (
              <Route
                key={route.path || "admin-index"}
                index={route.index}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default AppRouter;
