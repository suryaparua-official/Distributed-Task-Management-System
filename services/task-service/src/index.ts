import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import { connectDB } from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import taskRoutes from "./routes/task.routes.js";
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

// ================= SWAGGER =================
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Service API",
      version: "1.0.0",
      description: "Tasks CRUD API with Redis caching",
    },
    servers: [{ url: `http://localhost:${process.env.PORT}` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/**/*.ts", "./dist/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ================= ROUTES =================
app.use("/api/v1/tasks", taskRoutes);

// ================= HEALTH =================
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.get("/", (req, res) => {
  res.send("Task service running");
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
    await connectRedis();

    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      logger.info("Task service started", { port: PORT });
      logger.info(`Swagger docs -> http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    logger.error("Server failed to start", { err });
    process.exit(1);
  }
};

startServer();
