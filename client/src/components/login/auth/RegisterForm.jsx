import { memo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import InlineError from "./InlineError";
import LoadingSpinner from "./LoadingSpinner";

const RegisterForm = memo(function RegisterForm({
  formData,
  updateField,
  onSubmit,
  isLoading,
  error,
  onSwitchToLogin
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <Input
          type="text"
          label="Full Name"
          placeholder="Your name"
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          autoComplete="name"
          required
        />
      </div>

      <div>
        <Input
          type="email"
          label="Email Address"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          autoComplete="email"
          required
        />
      </div>

      <div>
        <Input
          type="tel"
          label="Phone Number"
          placeholder="+91 98765 43210"
          value={formData.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          autoComplete="tel"
          required
        />
      </div>

      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          label="Password"
          placeholder="Min. 8 characters"
          value={formData.password}
          onChange={(e) => updateField("password", e.target.value)}
          autoComplete="new-password"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-[38px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors duration-200"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      <div className="rounded-xl border border-[var(--accent-pink)]/10 bg-[var(--accent-pink)]/[0.035] px-4 py-3 text-[11px] leading-relaxed text-[var(--text-muted)]">
        Password needs uppercase, lowercase, number, and special character.
      </div>

      <div>
        <Input
          type="password"
          label="Confirm Password"
          placeholder="Re-enter password"
          value={formData.confirmPassword}
          onChange={(e) => updateField("confirmPassword", e.target.value)}
          autoComplete="new-password"
          required
        />
      </div>

      {error && <InlineError message={error} />}

      <Button type="submit" disabled={isLoading} className="w-full py-3.5 text-sm mt-2">
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <LoadingSpinner size="sm" />
            Sending code...
          </span>
        ) : (
          "Send Verification Code"
        )}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-pink)] transition-colors duration-200"
        >
          Already have an account? Sign in
        </button>
      </div>
    </form>
  );
});

export default RegisterForm;
