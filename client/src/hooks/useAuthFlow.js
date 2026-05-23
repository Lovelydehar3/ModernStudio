import { useReducer, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/authApi";
import { userAuthStore } from "../store/userAuthStore";
import { extractApiError } from "../lib/formatters";
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePhone,
  validateOtp,
  validateConfirmPassword
} from "../lib/validators";

const STEPS = {
  LOGIN: "LOGIN",
  REGISTER: "REGISTER",
  VERIFY_EMAIL: "VERIFY_EMAIL",
  FORGOT_EMAIL: "FORGOT_EMAIL",
  FORGOT_SUCCESS: "FORGOT_SUCCESS"
};

const initialState = {
  step: STEPS.LOGIN,
  isLoading: false,
  error: null,
  successMessage: null,
  formData: {
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    otp: "",
    remember: true
  }
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step, error: null, successMessage: null, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.value, error: null };
    case "SET_ERROR":
      return { ...state, error: action.message, isLoading: false };
    case "SET_SUCCESS":
      return { ...state, successMessage: action.message, error: null, isLoading: false };
    case "UPDATE_FIELD":
      return { ...state, formData: { ...state.formData, [action.name]: action.value }, error: null };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const firstError = (...messages) => messages.find(Boolean) || null;

/**
 * Gets the post-login redirect path from sessionStorage, then clears it.
 * Falls back to /booking if no redirect is saved.
 */
const consumeRedirectPath = () => {
  try {
    const saved = sessionStorage.getItem("redirectAfterLogin");
    if (saved) {
      sessionStorage.removeItem("redirectAfterLogin");
      return saved;
    }
  } catch {
    // sessionStorage not available (private browsing, etc.)
  }
  return "/booking";
};

export default function useAuthFlow() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const updateField = useCallback((name, value) => {
    dispatch({ type: "UPDATE_FIELD", name, value });
  }, []);

  const setStep = useCallback((step) => {
    dispatch({ type: "SET_STEP", step });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  const setError = useCallback((message) => {
    dispatch({ type: "SET_ERROR", message });
  }, []);

  const submitRegister = useCallback(async () => {
    const { name, email, phone, password, confirmPassword } = state.formData;
    const error = firstError(
      validateName(name),
      validateEmail(email),
      validatePhone(phone),
      validatePassword(password),
      validateConfirmPassword(password, confirmPassword)
    );

    if (error) {
      dispatch({ type: "SET_ERROR", message: error });
      return;
    }

    dispatch({ type: "SET_LOADING", value: true });
    try {
      await authApi.register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        confirmPassword
      });
      dispatch({ type: "SET_STEP", step: STEPS.VERIFY_EMAIL });
      dispatch({
        type: "SET_SUCCESS",
        message: "Verification code sent. Check your email."
      });
    } catch (err) {
      dispatch({ type: "SET_ERROR", message: extractApiError(err) });
    }
  }, [state.formData]);

  const submitVerifyEmail = useCallback(async () => {
    const { email, otp } = state.formData;
    const error = firstError(validateEmail(email), validateOtp(otp));
    if (error) {
      dispatch({ type: "SET_ERROR", message: error });
      return;
    }

    dispatch({ type: "SET_LOADING", value: true });
    try {
      const response = await authApi.verifyEmailOtp({ email: email.trim(), otp: otp.trim() });
      const user = response.data.data?.user;
      userAuthStore.setUser(user);
      // Redirect to saved page or /booking after successful registration
      navigate(consumeRedirectPath(), { replace: true });
    } catch (err) {
      dispatch({ type: "SET_ERROR", message: extractApiError(err) });
    }
  }, [state.formData, navigate]);

  const submitLogin = useCallback(async () => {
    const { email, password, remember } = state.formData;
    const error = firstError(validateEmail(email), !password ? "Password is required" : null);
    if (error) {
      dispatch({ type: "SET_ERROR", message: error });
      return;
    }

    dispatch({ type: "SET_LOADING", value: true });
    try {
      const response = await authApi.login({ email: email.trim(), password, remember: Boolean(remember) });
      const user = response.data.data?.user;
      userAuthStore.setUser(user);
      // Redirect to saved page or /booking after successful login
      navigate(consumeRedirectPath(), { replace: true });
    } catch (err) {
      dispatch({ type: "SET_ERROR", message: extractApiError(err) });
    }
  }, [state.formData, navigate]);

  const submitForgotEmail = useCallback(async () => {
    const { email } = state.formData;
    const error = validateEmail(email);
    if (error) {
      dispatch({ type: "SET_ERROR", message: error });
      return;
    }

    dispatch({ type: "SET_LOADING", value: true });
    try {
      await authApi.requestPasswordReset({ email: email.trim() });
      dispatch({ type: "SET_STEP", step: STEPS.FORGOT_SUCCESS });
    } catch (err) {
      dispatch({ type: "SET_ERROR", message: extractApiError(err) });
    }
  }, [state.formData]);

  const submitCurrentStep = useCallback(async () => {
    switch (state.step) {
      case STEPS.LOGIN:
        return submitLogin();
      case STEPS.REGISTER:
        return submitRegister();
      case STEPS.VERIFY_EMAIL:
        return submitVerifyEmail();
      case STEPS.FORGOT_EMAIL:
        return submitForgotEmail();
      default:
        return undefined;
    }
  }, [state.step, submitLogin, submitRegister, submitVerifyEmail, submitForgotEmail]);

  return {
    step: state.step,
    steps: STEPS,
    isLoading: state.isLoading,
    error: state.error,
    successMessage: state.successMessage,
    formData: state.formData,
    updateField,
    setStep,
    clearError,
    setError,
    submitCurrentStep,
    dispatch
  };
}
