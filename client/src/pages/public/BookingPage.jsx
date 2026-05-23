import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import SectionHeading from "../../components/common/SectionHeading";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import FadeUpReveal from "../../components/motion/FadeUpReveal";
import Loader from "../../components/common/Loader";
import { packageApi } from "../../services/packageApi";
import { bookingApi } from "../../services/bookingApi";
import { packageDefaults } from "../../constants/packageDefaults";
import { addOnDefaults } from "../../constants/addOnDefaults";
import { packageThumbnails } from "../../constants/mediaLibrary";
import { extractApiError } from "../../lib/formatters";
import SEO from "../../components/common/SEO";
import { userAuthStore } from "../../store/userAuthStore";
import { useToast } from "../../components/ui/ToastContext";
import { optimizeCloudinaryImage } from "../../utils/cloudinary";

const EVENT_TYPES = [
  { label: "Wedding", value: "wedding" },
  { label: "Pre-Wedding / Engagement", value: "pre-wedding" },
  { label: "Reception", value: "reception" },
  { label: "Model Portfolio", value: "portfolio" },
  { label: "Other", value: "other" }
];

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  eventType: "wedding",
  eventDate: "",
  eventLocation: "",
  days: "1",
  selectedPackageName: "Essential",
  addOnNames: [],
  message: ""
};

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Enter a valid email";
  if (!form.phone.trim()) errors.phone = "Phone is required";
  else if (!/^[\d\s+\-()]{7,15}$/.test(form.phone)) errors.phone = "Enter a valid phone number";
  if (!form.eventDate) errors.eventDate = "Event date is required";
  if (!form.eventLocation.trim()) errors.eventLocation = "Location is required";
  if (!form.days || Number(form.days) < 1) errors.days = "At least 1 day required";
  return errors;
}

function BookingPage() {
  const { showToast } = useToast();
  const user = userAuthStore.getUser();

  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await packageApi.getPublic();
        const data = response.data.data?.length ? response.data.data : packageDefaults;
        setPackages(data);
        if (data.length) {
          setForm((prev) => ({ ...prev, selectedPackageName: data[0].name }));
        }
      } catch {
        setPackages(packageDefaults);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const packageRows = useMemo(
    () =>
      (packages.length ? packages : packageDefaults).map((item) => ({
        ...item,
        thumbnail: item.thumbnail || packageThumbnails[item.name] || packageDefaults[0].thumbnail
      })),
    [packages]
  );

  const selectedPackage = useMemo(
    () =>
      packageRows.find((item) => item.name === form.selectedPackageName) ||
      packageRows[0] ||
      packageDefaults[0],
    [packageRows, form.selectedPackageName]
  );

  const addOnOptions = selectedPackage?.addOns?.length ? selectedPackage.addOns : addOnDefaults;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const updated = { ...form, [name]: value };
      const newErrors = validate(updated);
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] || undefined }));
    }
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validate(form);
    setErrors((prev) => ({ ...prev, [name]: newErrors[name] || undefined }));
  };

  const toggleAddon = (name) => {
    setForm((prev) => {
      const exists = prev.addOnNames.includes(name);
      return {
        ...prev,
        addOnNames: exists
          ? prev.addOnNames.filter((item) => item !== name)
          : [...prev.addOnNames, name]
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    setTouched({
      name: true, email: true, phone: true,
      eventDate: true, eventLocation: true, days: true
    });
    if (Object.keys(validationErrors).length > 0) return;

    try {
      setIsSubmitting(true);
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        eventType: form.eventType,
        eventDate: form.eventDate,
        eventLocation: form.eventLocation.trim(),
        days: Number(form.days),
        selectedPackage: {
          packageId: selectedPackage?._id || undefined,
          name: selectedPackage?.name,
          priceDisplay: selectedPackage?.priceDisplay,
          startingPrice: selectedPackage?.startingPrice
        },
        addOns: addOnOptions
          .filter((item) => form.addOnNames.includes(item.name))
          .map(({ name, priceDisplay, startingPrice }) => ({ name, priceDisplay, startingPrice })),
        message: form.message.trim()
      };

      await bookingApi.create(payload);
      setSubmitted(true);
      setForm(INITIAL_FORM);
      setTouched({});
      setErrors({});
      showToast("Booking request submitted successfully!", "success");
    } catch (error) {
      const message = extractApiError(error);
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="section-space px-8 flex items-center justify-center min-h-[60vh]">
        <SEO title="Sign In to Book" />
        <FadeUpReveal>
          <Card className="max-w-lg mx-auto text-center p-12">
            <h2 className="font-heading text-4xl uppercase text-[var(--text-primary)] mb-4">Sign In Required</h2>
            <p className="text-[var(--text-secondary)] mb-6">
              Please sign in to your account to book a session with Arun.
            </p>
            <Link to="/login" onClick={() => {
              try {
                sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
              } catch (err) {
                console.warn("sessionStorage failed:", err);
              }
            }}>
              <Button className="px-8">Sign In</Button>
            </Link>
          </Card>
        </FadeUpReveal>
      </div>
    );
  }

  if (isLoading) return <Loader label="Loading booking form..." />;

  if (submitted) {
    return (
      <div className="section-space px-8 flex items-center justify-center min-h-[60vh]">
        <SEO title="Booking Submitted" />
        <FadeUpReveal>
          <Card className="max-w-lg mx-auto text-center p-12 border-[var(--accent-pink)]/20">
            <div className="text-5xl mb-4">✓</div>
            <h2 className="font-heading text-4xl uppercase text-[var(--text-primary)] mb-4">Booking Received</h2>
            <p className="text-[var(--text-secondary)] mb-6">
              Thank you! Your booking request has been submitted. Arun will review your details and get back to you within 24 hours with availability and next steps.
            </p>
            <div className="space-y-3">
              <Link to="/">
                <Button className="w-full px-8 bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-purple)]">
                  Back to Home
                </Button>
              </Link>
              <Button
                onClick={() => setSubmitted(false)}
                className="w-full px-8 border border-[var(--card-border)]"
              >
                Book Another Session
              </Button>
            </div>
          </Card>
        </FadeUpReveal>
      </div>
    );
  }

  const fieldError = (name) =>
    touched[name] && errors[name]
      ? <span className="mt-1 text-xs text-red-400">{errors[name]}</span>
      : null;

  return (
    <div className="section-space px-8">
      <SEO title="Book Your Wedding" description="Book your wedding cinematography and photography session. Choose from Essential, Premium, and Luxury packages." />
      <div className="mx-auto max-w-7xl">
        <FadeUpReveal>
          <SectionHeading
            eyebrow="Book a Story"
            title="Book a Session with Arun"
            description="Fill in your event details, choose your package, and Arun will get back to you with availability and next steps."
          />
        </FadeUpReveal>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <FadeUpReveal>
            <Card className="group overflow-hidden p-0">
              <img
                src={optimizeCloudinaryImage(selectedPackage?.thumbnail, { width: 920, height: 980 })}
                alt={`${selectedPackage?.name} package`}
                loading="lazy"
                decoding="async"
                className="h-[28rem] w-full object-cover object-[center_30%] transition duration-500 group-hover:scale-[1.05]"
              />
              <div className="p-8">
                <h3 className="font-heading text-4xl uppercase text-[var(--text-primary)]">{selectedPackage?.name || "Package"}</h3>
                <p className="mt-3 font-bold text-[var(--accent-pink)]">{selectedPackage?.priceDisplay}</p>
                <ul className="mt-5 space-y-3 text-sm text-[var(--text-secondary)]">
                  {selectedPackage?.features?.map((feature) => (
                    <li key={feature}>- {feature}</li>
                  ))}
                </ul>
              </div>
            </Card>
          </FadeUpReveal>

          <FadeUpReveal>
            <Card className="bg-[var(--surface)] border-[var(--accent-pink)]/10 backdrop-blur-2xl p-10">
              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                {/* Contact Info */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Input
                      name="name"
                      label="Full Name"
                      required
                      placeholder="Your full name"
                      value={form.name}
                      onChange={handleChange}
                      onBlur={() => handleBlur("name")}
                    />
                    {fieldError("name")}
                  </div>
                  <div>
                    <Input
                      type="email"
                      name="email"
                      label="Email Address"
                      required
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur("email")}
                    />
                    {fieldError("email")}
                  </div>
                </div>

                <div>
                  <Input
                    name="phone"
                    label="Phone Number"
                    required
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={() => handleBlur("phone")}
                  />
                  {fieldError("phone")}
                </div>

                {/* Event Details */}
                <div className="border-t border-[var(--accent-pink)]/10 pt-6">
                  <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--accent-pink)]">Event Details</p>
                  <div className="grid gap-6 md:grid-cols-2">
                    <Select
                      name="eventType"
                      label="Event Type"
                      value={form.eventType}
                      onChange={handleChange}
                      options={EVENT_TYPES}
                    />
                    <div>
                      <Input
                        type="date"
                        name="eventDate"
                        label="Event Date"
                        required
                        value={form.eventDate}
                        onChange={handleChange}
                        onBlur={() => handleBlur("eventDate")}
                      />
                      {fieldError("eventDate")}
                    </div>
                  </div>
                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div>
                      <Input
                        name="eventLocation"
                        label="Venue / Location"
                        required
                        placeholder="City, venue name, or address"
                        value={form.eventLocation}
                        onChange={handleChange}
                        onBlur={() => handleBlur("eventLocation")}
                      />
                      {fieldError("eventLocation")}
                    </div>
                    <div>
                      <Input
                        type="number"
                        name="days"
                        label="Number of Days"
                        required
                        min="1"
                        max="30"
                        placeholder="1"
                        value={form.days}
                        onChange={handleChange}
                        onBlur={() => handleBlur("days")}
                      />
                      {fieldError("days")}
                    </div>
                  </div>
                </div>

                {/* Package Selection */}
                <div className="border-t border-[var(--accent-pink)]/10 pt-6">
                  <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--accent-pink)]">Package</p>
                  <Select
                    name="selectedPackageName"
                    label="Selected Package"
                    value={form.selectedPackageName}
                    onChange={handleChange}
                    options={packageRows.map((item) => ({
                      label: `${item.name} — ${item.priceDisplay}`,
                      value: item.name
                    }))}
                  />
                </div>

                {/* Add-ons */}
                <div>
                  <p className="mb-3 text-sm font-medium text-[var(--text-muted)]">Extra Add-ons</p>
                  <div className="grid gap-4">
                    {addOnOptions.map((addOn) => {
                      const isSelected = form.addOnNames.includes(addOn.name);
                      return (
                        <label
                          key={addOn.name}
                          className={clsx(
                            "flex cursor-pointer items-center justify-between rounded-xl border px-5 py-3.5 text-sm transition-all duration-400",
                            isSelected
                              ? "border-[var(--accent-pink)]/40 bg-[var(--accent-pink)]/[0.06] text-[var(--text-primary)] shadow-[0_0_15px_rgba(194,109,186,0.1)]"
                              : "border-[var(--accent-pink)]/[0.1] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--accent-pink)]/[0.03]"
                          )}
                        >
                          <span className="font-medium">
                            {addOn.name} <span className="ml-2 text-xs opacity-60">+{addOn.priceDisplay}</span>
                          </span>
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-[var(--accent-pink)]"
                            checked={isSelected}
                            onChange={() => toggleAddon(addOn.name)}
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="flex w-full flex-col gap-2 text-sm text-[var(--text-secondary)]">
                    <span className="font-medium">Additional Details</span>
                    <textarea
                      name="message"
                      rows="3"
                      placeholder="Any special requests, timeline details, or questions..."
                      value={form.message}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[var(--accent-pink)]/[0.15] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-all duration-400 focus:border-[var(--accent-pink)] focus:shadow-[0_0_0_3px_rgba(194,109,186,0.12)] placeholder:text-[var(--text-muted)] resize-none"
                    />
                  </label>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full py-4 text-sm mt-4">
                  {isSubmitting ? "Submitting Request..." : "Request Booking"}
                </Button>
              </form>
            </Card>
          </FadeUpReveal>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
