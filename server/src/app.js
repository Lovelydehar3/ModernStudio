const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const apiRouter = require("./routes");
const env = require("./config/env");
const sanitize = require("./middleware/sanitize.middleware");
const csrfMiddleware = require("./middleware/csrf.middleware");
const notFoundMiddleware = require("./middleware/notFound.middleware");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" }
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (env.clientUrls.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(sanitize);
app.use(cookieParser());
app.use(csrfMiddleware);
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.use("/api/v1", apiRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
