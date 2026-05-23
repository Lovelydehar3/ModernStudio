import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import useScrollToTop from "../hooks/useScrollToTop";

function PublicLayout() {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navbar />
      <main className="pt-[var(--navbar-height)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
