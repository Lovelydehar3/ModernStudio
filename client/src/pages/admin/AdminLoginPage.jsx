import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../../components/common/SEO";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { authApi } from "../../services/authApi";
import { authStore } from "../../store/authStore";
import { extractApiError } from "../../lib/formatters";

function AdminLoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Password is required");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const response = await authApi.login({
        email: import.meta.env.VITE_ADMIN_EMAIL || "modernweddingstudios@gmail.com",
        password: password.trim(),
        remember: true
      });
      const user = response.data.data?.user || response.data.data;
      if (user?.role !== "admin") {
        setError("Admin access required.");
        return;
      }
      authStore.setUser(user);
      navigate("/admin");
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO title="Admin Access" noindex />
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-6">
        <div className="w-full max-w-sm">
          <div className="mb-10 text-center">
            <h1 className="font-heading text-4xl uppercase tracking-wider text-[var(--text-primary)]">
              Modern
            </h1>
            <p className="mt-1 text-xs tracking-[0.2em] uppercase text-[var(--text-muted)]">
              Admin Access
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Input
              type="password"
              label="Access Password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            {error && (
              <p className="text-xs text-red-400">{error}</p>
            )}

            <Button type="submit" disabled={isLoading} className="w-full py-3.5 text-sm">
              {isLoading ? "Verifying..." : "Enter"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AdminLoginPage;
