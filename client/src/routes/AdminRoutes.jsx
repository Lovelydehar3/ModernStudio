import { lazy } from "react";

const DashboardPage = lazy(() => import("../pages/admin/DashboardPage"));
const PackagesPage = lazy(() => import("../pages/admin/PackagesPage"));
const MediaPage = lazy(() => import("../pages/admin/MediaPage"));
const FilmsManagePage = lazy(() => import("../pages/admin/FilmsManagePage"));
const HomeContentPage = lazy(() => import("../pages/admin/HomeContentPage"));
const BookingsPage = lazy(() => import("../pages/admin/BookingsPage"));
const InquiriesPage = lazy(() => import("../pages/admin/InquiriesPage"));
const AddonsPage = lazy(() => import("../pages/admin/AddonsPage"));

export const adminRouteItems = [
  { index: true, element: <DashboardPage /> },
  { path: "packages", element: <PackagesPage /> },
  { path: "media", element: <MediaPage /> },
  { path: "films", element: <FilmsManagePage /> },
  { path: "home-content", element: <HomeContentPage /> },
  { path: "bookings", element: <BookingsPage /> },
  { path: "addons", element: <AddonsPage /> },
  { path: "inquiries", element: <InquiriesPage /> }
];
