import { lazy } from "react";

const HomePage = lazy(() => import("../pages/public/HomePage"));
const WeddingsPage = lazy(() => import("../pages/public/WeddingsPage"));
const GalleryPage = lazy(() => import("../pages/public/GalleryPage"));
const FilmsPage = lazy(() => import("../pages/public/FilmsPage"));
const PortfolioPage = lazy(() => import("../pages/public/PortfolioPage"));
const AboutPage = lazy(() => import("../pages/public/AboutPage"));
const BookingPage = lazy(() => import("../pages/public/BookingPage"));
const ProfilePage = lazy(() => import("../pages/public/ProfilePage"));
const PrivacyPolicyPage = lazy(() => import("../pages/public/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("../pages/public/TermsPage"));

export const publicRouteItems = [
  { path: "/", element: <HomePage /> },
  { path: "/weddings", element: <WeddingsPage /> },
  { path: "/gallery", element: <GalleryPage /> },
  { path: "/films", element: <FilmsPage /> },
  { path: "/portfolio", element: <PortfolioPage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/booking", element: <BookingPage /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/privacy-policy", element: <PrivacyPolicyPage /> },
  { path: "/terms", element: <TermsPage /> }
];
