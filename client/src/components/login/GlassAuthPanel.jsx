import { memo, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import LoginForm from "./auth/LoginForm";
import RegisterForm from "./auth/RegisterForm";
import VerifyEmailForm from "./auth/VerifyEmailForm";
import ForgotPasswordFlow from "./auth/ForgotPasswordFlow";
import GoogleAuthButton from "./auth/GoogleAuthButton";
import AuthDivider from "./auth/AuthDivider";
import { userAuthStore } from "../../store/userAuthStore";

const STEP_TITLES = {
  LOGIN: "Welcome Back",
  REGISTER: "Create Account",
  VERIFY_EMAIL: "Verify Email",
  FORGOT_EMAIL: "Reset Password",
  FORGOT_SUCCESS: "Check Your Email"
};

const GlassAuthPanel = memo(function GlassAuthPanel({
  authFlow,
  passwordRef,
  toggleRef
}) {
  const navigate = useNavigate();
  const {
    step,
    steps,
    isLoading,
    error,
    successMessage,
    formData,
    updateField,
    setStep,
    clearError,
    submitCurrentStep,
    setError
  } = authFlow;

  const handleGoogleSuccess = useCallback((data) => {
    userAuthStore.setUser(data.user);
    // Use saved redirect path or fall back to /booking
    const savedPath = (() => {
      try {
        const p = sessionStorage.getItem("redirectAfterLogin");
        if (p) { sessionStorage.removeItem("redirectAfterLogin"); return p; }
      } catch { /* ignore */ }
      return "/booking";
    })();
    navigate(savedPath, { replace: true });
  }, [navigate]);

  const handleGoogleError = useCallback((message) => {
    setError(message);
  }, [setError]);


  const contentRef = useRef(null);
  const prevStepRef = useRef(step);

  useEffect(() => {
    if (prevStepRef.current !== step && contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
      prevStepRef.current = step;
    }
  }, [step]);

  const isLogin = step === steps.LOGIN;
  const isRegister = step === steps.REGISTER;
  const isVerifyEmail = step === steps.VERIFY_EMAIL;
  const isForgot = [
    steps.FORGOT_EMAIL,
    steps.FORGOT_SUCCESS
  ].includes(step);

  return (
    <div className="flex w-full items-center justify-center min-h-screen px-6 py-10 md:px-12 lg:px-16">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-10">
          <h1 className="font-heading text-5xl md:text-6xl uppercase tracking-wider text-[var(--text-primary)]">
            MODERN
          </h1>
          <p className="mt-2 text-sm tracking-[0.2em] uppercase text-[var(--accent-pink)]">
            Wedding Studios
          </p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Sign in to your account
          </p>
        </div>

        {/* Step Title */}
        <h2 className="font-heading text-2xl uppercase text-[var(--text-primary)] mb-6">
          {STEP_TITLES[step] || "Sign In"}
        </h2>

        {/* Content */}
        <div ref={contentRef}>
          {isLogin && (
            <>
              <LoginForm
                formData={formData}
                updateField={updateField}
                onSubmit={submitCurrentStep}
                isLoading={isLoading}
                error={error}
                onSwitchToForgot={() => { clearError(); setStep(steps.FORGOT_EMAIL); }}
                onSwitchToRegister={() => { clearError(); setStep(steps.REGISTER); }}
                passwordRef={passwordRef}
                toggleRef={toggleRef}
              />
              <AuthDivider />
              <GoogleAuthButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
            </>
          )}

          {isRegister && (
            <>
              <RegisterForm
                formData={formData}
                updateField={updateField}
                onSubmit={submitCurrentStep}
                isLoading={isLoading}
                error={error}
                successMessage={successMessage}
                onSwitchToLogin={() => { clearError(); setStep(steps.LOGIN); }}
              />
              <AuthDivider />
              <GoogleAuthButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
            </>
          )}


          {isVerifyEmail && (
            <VerifyEmailForm
              formData={formData}
              updateField={updateField}
              onSubmit={submitCurrentStep}
              isLoading={isLoading}
              error={error}
              successMessage={successMessage}
              onSwitchToLogin={() => { clearError(); setStep(steps.LOGIN); }}
              email={formData.email}
            />
          )}

          {isForgot && (
            <ForgotPasswordFlow
              formData={formData}
              updateField={updateField}
              onSubmit={submitCurrentStep}
              isLoading={isLoading}
              error={error}
              onSwitchToLogin={() => { clearError(); setStep(steps.LOGIN); }}
              step={step}
              steps={steps}
            />
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-[var(--accent-pink)]/10">
          <p className="text-[10px] text-[var(--text-muted)] text-center tracking-wider">
            &copy; {new Date().getFullYear()} Modern Wedding Studios
          </p>
        </div>
      </div>
    </div>
  );
});

export default GlassAuthPanel;
