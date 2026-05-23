import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, ShieldAlert } from "lucide-react";
import SEO from "../../components/common/SEO";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { authApi } from "../../services/authApi";
import { extractApiError } from "../../lib/formatters";
import { validatePassword } from "../../lib/validators";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const [status, setStatus] = useState("checking");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasTokenData = useMemo(() => Boolean(email && token), [email, token]);

  useEffect(() => {
    let active = true;

    const validate = async () => {
      if (!hasTokenData) {
        setStatus("invalid");
        setError("Invalid reset link.");
        return;
      }

      try {
        await authApi.validateResetToken({ email, token });
        if (active) setStatus("ready");
      } catch (err) {
        if (active) {
          setStatus("invalid");
          setError(extractApiError(err));
        }
      }
    };

    validate();
    return () => {
      active = false;
    };
  }, [email, token, hasTokenData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const passwordError = validatePassword(form.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      await authApi.resetPassword({
        email,
        token,
        password: form.password,
        confirmPassword: form.confirmPassword
      });
      setStatus("success");
      window.setTimeout(() => navigate("/login"), 1400);
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Reset Password" noindex />
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-6 py-16">
        <Card className="w-full max-w-md p-8">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--accent-pink)]">
              Modern Wedding Studios
            </p>
            <h1 className="mt-3 font-heading text-4xl uppercase text-[var(--text-primary)]">
              Reset Password
            </h1>
          </div>

          {status === "checking" && (
            <p className="text-center text-sm text-[var(--text-muted)]">Checking reset link...</p>
          )}

          {status === "invalid" && (
            <div className="space-y-5 text-center">
              <div className="flex justify-center text-red-400">
                <ShieldAlert size={44} />
              </div>
              <p className="text-sm text-red-500">{error || "This reset link is invalid or expired."}</p>
              <Link to="/login">
                <Button className="w-full py-3.5 text-sm">Request New Link</Button>
              </Link>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-5 text-center">
              <div className="flex justify-center text-green-500">
                <CheckCircle size={48} />
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                Password updated. Taking you back to login...
              </p>
            </div>
          )}

          {status === "ready" && (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <Input
                type="password"
                label="New Password"
                placeholder="Create strong password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                autoComplete="new-password"
                required
              />
              <Input
                type="password"
                label="Confirm Password"
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                autoComplete="new-password"
                required
              />
              <p className="rounded-xl border border-[var(--accent-pink)]/10 bg-[var(--accent-pink)]/[0.035] px-4 py-3 text-[11px] leading-relaxed text-[var(--text-muted)]">
                Use uppercase, lowercase, number, and special character. This link works once and expires in 15 minutes.
              </p>
              {error && <p className="rounded-xl bg-red-500/5 px-4 py-3 text-xs text-red-500">{error}</p>}
              <Button type="submit" disabled={isSubmitting} className="w-full py-3.5 text-sm">
                {isSubmitting ? "Updating..." : "Update Password"}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </>
  );
}

export default ResetPasswordPage;
