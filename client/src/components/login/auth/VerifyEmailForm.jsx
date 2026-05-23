import { memo, useState, useEffect, useRef } from "react";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import InlineError from "./InlineError";
import LoadingSpinner from "./LoadingSpinner";
import { authApi } from "../../../services/authApi";

const VerifyEmailForm = memo(function VerifyEmailForm({
  formData,
  updateField,
  onSubmit,
  isLoading,
  error,
  successMessage,
  onSwitchToLogin,
  email
}) {
  const [resendTimer, setResendTimer] = useState(60);
  const otpInputRef = useRef(null);

  useEffect(() => {
    otpInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setResendTimer(60);
    try {
      await authApi.resendVerificationOtp({ email });
    } catch {
      // Timer already started; user can try again
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <p className="text-xs text-[var(--text-muted)]">
        Enter the 6-digit code sent to <span className="text-[var(--text-secondary)]">{email}</span>
      </p>
      <div>
        <Input
          ref={otpInputRef}
          type="text"
          label="Verification Code"
          placeholder="000000"
          maxLength={6}
          value={formData.otp}
          onChange={(e) => updateField("otp", e.target.value.replace(/\D/g, "").slice(0, 6))}
          autoComplete="one-time-code"
          inputMode="numeric"
          className="text-center tracking-[0.5em] text-lg"
          required
        />
      </div>
      {successMessage && !error && (
        <p className="rounded-xl border border-green-500/10 bg-green-500/5 px-4 py-3 text-xs text-green-600">
          {successMessage}
        </p>
      )}
      {error && <InlineError message={error} />}
      <Button type="submit" disabled={isLoading} className="w-full py-3.5 text-sm">
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <LoadingSpinner size="sm" />
            Verifying...
          </span>
        ) : (
          "Verify & Create Account"
        )}
      </Button>
      <div className="flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={handleResend}
          disabled={resendTimer > 0}
          className="text-[var(--text-muted)] hover:text-[var(--accent-pink)] transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
        </button>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-[var(--text-muted)] hover:text-[var(--accent-pink)] transition-colors duration-200"
        >
          Back to login
        </button>
      </div>
    </form>
  );
});

export default VerifyEmailForm;
