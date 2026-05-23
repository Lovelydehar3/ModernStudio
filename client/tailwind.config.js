/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base:    "#0a0a0f",
        surface: "#12121a",
        card:    "rgba(194,109,186,0.04)",
        border:  "rgba(194,109,186,0.15)",
        primary: "#c26dba",
        secondary: "#e88bbd",
        "text-primary": "#f0e6f0",
        "text-muted":   "rgba(240,230,240,0.55)",
      },
      fontFamily: {
        display: ['"Bebas Neue"', "sans-serif"],
        heading: ['"Bebas Neue"', "sans-serif"],
        body:    ['"Sora"', "sans-serif"],
      },
      backgroundImage: {
        "accent-grad":  "linear-gradient(135deg, #c26dba, #e88bbd, #f0b8d0)",
        "accent-grad-r":"linear-gradient(to right, #c26dba, #e88bbd, #f0b8d0)",
        "surface-grad": "linear-gradient(160deg, #12121a 0%, #0a0a0f 100%)",
        "card-grad":    "linear-gradient(135deg, rgba(194,109,186,0.06) 0%, rgba(232,139,189,0.03) 100%)",
        "hero-overlay": "linear-gradient(180deg, rgba(10,10,15,0.3) 0%, rgba(10,10,15,0.7) 60%, #0a0a0f 100%)",
        "pink-glow":    "radial-gradient(ellipse at center, rgba(194,109,186,0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        "glow-purple": "0 0 30px rgba(194,109,186,0.25)",
        "glow-pink":   "0 0 30px rgba(232,139,189,0.20)",
        "glow-card":   "0 8px 40px rgba(194,109,186,0.08)",
        "card-hover":  "0 20px 60px rgba(194,109,186,0.12), 0 0 40px rgba(194,109,186,0.08)",
        "btn-glow":    "0 4px 20px rgba(194,109,186,0.35)",
        "btn-glow-lg": "0 8px 32px rgba(194,109,186,0.4)",
      },
      borderRadius: {
        "3xl": "24px",
        "4xl": "32px",
      },
      animation: {
        "float":         "float 8s ease-in-out infinite",
        "float-slow":    "float 12s ease-in-out infinite",
        "float-gentle":  "floatGentle 6s ease-in-out infinite",
        "marquee":       "marquee 36s linear infinite",
        "glow-pulse":    "glowPulse 4s ease-in-out infinite",
        "fade-in":       "fadeIn 0.8s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in-up":    "fadeInUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in-left":  "fadeInLeft 0.8s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in-right": "fadeInRight 0.8s cubic-bezier(0.16,1,0.3,1) forwards",
        "scale-in":      "scaleIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
        "slide-up":      "slideUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards",
        "bounce-slow":   "bounceSlow 3s ease-in-out infinite",
        "shimmer":       "shimmer 3s linear infinite",
        "pulse-glow":    "pulseGlow 3s ease-in-out infinite",
        "gradient-shift":"gradientShift 4s ease infinite",
        "spin-slow":     "spin 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-16px)" },
        },
        floatGentle: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "33%":      { transform: "translateY(-8px) rotate(0.5deg)" },
          "66%":      { transform: "translateY(4px) rotate(-0.3deg)" },
        },
        marquee: {
          "0%":   { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.6" },
          "50%":      { opacity: "1" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(40px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeInLeft: {
          from: { opacity: "0", transform: "translateX(-40px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        fadeInRight: {
          from: { opacity: "0", transform: "translateX(40px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.9)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(32px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        bounceSlow: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(194,109,186,0.3)" },
          "50%":      { boxShadow: "0 0 20px 5px rgba(194,109,186,0.15)" },
        },
        gradientShift: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      transitionDuration: { DEFAULT: "400ms" },
      transitionTimingFunction: { DEFAULT: "cubic-bezier(0.16,1,0.3,1)" },
    },
  },
  plugins: [],
};
