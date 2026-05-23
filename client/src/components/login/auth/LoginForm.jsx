import { memo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import InlineError from "./InlineError";
import LoadingSpinner from "./LoadingSpinner";

const LoginForm = memo(function LoginForm({
  formData,
  updateField,
  onSubmit,
  isLoading,
  error,
  onSwitchToForgot,
  onSwitchToRegister,
  passwordRef,
  toggleRef
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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

      <div className="relative">
        <Input
          ref={passwordRef}
          type={showPassword ? "text" : "password"}
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => updateField("password", e.target.value)}
          autoComplete="current-password"
          required
        />
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-[38px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors duration-200"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {error && <InlineError message={error} />}

      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 text-[var(--text-muted)] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={Boolean(formData.remember)}
            onChange={(e) => updateField("remember", e.target.checked)}
            className="w-3.5 h-3.5 rounded border-[var(--accent-pink)]/20 bg-[var(--surface)] accent-[var(--accent-pink)]"
          />
          Remember me
        </label>
        <button
          type="button"
          onClick={onSwitchToForgot}
          className="text-[var(--accent-pink)] hover:text-[var(--accent-purple)] transition-colors duration-200"
        >
          Forgot password?
        </button>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full py-3.5 text-sm mt-2">
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <LoadingSpinner size="sm" />
            Signing in...
          </span>
        ) : (
          "Sign In"
        )}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-xs text-[var(--accent-pink)] hover:text-[var(--accent-purple)] transition-colors duration-200 font-medium"
        >
          Don't have an account? Sign up
        </button>
      </div>
    </form>
  );
});

export default LoginForm;
