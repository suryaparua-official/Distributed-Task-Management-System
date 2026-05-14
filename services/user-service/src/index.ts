import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import logger from "./utils/logger.js";
import { requestLogger } from "./middleware/requestLogger.middleware.js";

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

dotenv.config();

const app = express();
app.set("trust proxy", 1);

// ================= SECURITY HEADERS =================
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
      },
    },
    frameguard: { action: "deny" },
    noSniff: true,
    xssFilter: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    hidePoweredBy: true,
  }),
);

app.use(express.json({ limit: "10kb" }));

// ================= REQUEST LOGGING =================
app.use(requestLogger);

// ================= RATE LIMITING =================
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/v1/auth/login", authLimiter);
app.use("/api/v1/auth/register", authLimiter);

// ================= ROUTES =================
app.use("/api/v1/auth", authRoutes);

// ================= SWAGGER =================
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Service API",
      version: "1.0.0",
      description: "API documentation for User Service (Auth & Admin)",
    },
    servers: [{ url: `http://localhost:${process.env.PORT}/api/v1` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.ts", "./dist/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true }),
);

// ================= HEALTH =================
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.get("/", (req, res) => {
  res.send("User service running");
});

// ================= 404 =================
app.use((req: any, res: any) => {
  res.status(404).json({ message: "Route not found" });
});

// ================= GLOBAL ERROR HANDLER =================
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    logger.error("Unhandled error", {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
    });
    res.status(500).json({ message: "Internal server error" });
  },
);

// ================= BOOT =================
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info("User service started", { port: PORT });
      logger.info(`Swagger docs -> http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logger.error("Server failed to start", { error });
    process.exit(1);
  }
};

startServer();
