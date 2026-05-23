import { memo } from "react";
import { MailCheck } from "lucide-react";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import InlineError from "./InlineError";
import LoadingSpinner from "./LoadingSpinner";

const ForgotPasswordFlow = memo(function ForgotPasswordFlow({
  formData,
  updateField,
  onSubmit,
  isLoading,
  error,
  onSwitchToLogin,
  step,
  steps
}) {
  const isSuccessStep = step === steps.FORGOT_SUCCESS;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  if (isSuccessStep) {
    return (
      <div className="space-y-5 py-4 text-center">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-pink)]/10 text-[var(--accent-pink)]">
            <MailCheck size={28} />
          </div>
        </div>
        <div>
          <h3 className="font-heading text-3xl uppercase text-[var(--text-primary)]">
            Check your email
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
            If an account exists, a secure reset link has been sent. The link expires in 3 minutes.
          </p>
        </div>
        <Button onClick={onSwitchToLogin} className="w-full py-3.5 text-sm">
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <p className="text-xs leading-relaxed text-[var(--text-muted)]">
        Enter your email address and we will send a one-time reset link.
      </p>
      <Input
        type="email"
        label="Email Address"
        placeholder="you@example.com"
        value={formData.email}
        onChange={(e) => updateField("email", e.target.value)}
        autoComplete="email"
        required
      />

      {error && <InlineError message={error} />}

      <Button type="submit" disabled={isLoading} className="w-full py-3.5 text-sm">
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <LoadingSpinner size="sm" />
            Sending link...
          </span>
        ) : (
          "Send Reset Link"
        )}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-xs text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--accent-pink)]"
        >
          Back to login
        </button>
      </div>
    </form>
  );
});

export default ForgotPasswordFlow;
