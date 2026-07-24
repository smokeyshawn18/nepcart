import winston from "winston";
import { getEnv } from "../lib/env";
// Uncomment if deploying to a VPS and using file-based logs.
// import "winston-daily-rotate-file";

const env = getEnv();

const { combine, timestamp, json, colorize, simple, errors } = winston.format;

const isProduction = process.env.NODE_ENV === "production";

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: isProduction
      ? combine(timestamp(), errors({ stack: true }), json())
      : combine(colorize(), simple()),
  }),
];

/*
|--------------------------------------------------------------------------
| VPS ONLY (Persistent Storage)
|--------------------------------------------------------------------------
| Enable these transports only if your app runs on a VPS with a mounted
| Docker volume or persistent disk.
|
| Example:
| docker run -v /var/log/nepcart:/app/logs ...
|
| Cloud platforms like Render, Railway, Fly.io, etc. have ephemeral
| filesystems, so these files are lost after restarts/redeploys.
|--------------------------------------------------------------------------
*/

// if (isProduction) {
//   transports.push(
//     new winston.transports.DailyRotateFile({
//       filename: "logs/app-%DATE%.log",
//       datePattern: "YYYY-MM-DD",
//       maxFiles: "30d",
//       maxSize: "50m",
//       zippedArchive: true,
//     }),
//     new winston.transports.DailyRotateFile({
//       filename: "logs/error-%DATE%.log",
//       datePattern: "YYYY-MM-DD",
//       level: "error",
//       maxFiles: "30d",
//       maxSize: "50m",
//       zippedArchive: true,
//     })
//   );
// }

export const logger = winston.createLogger({
  level: env.LOG_LEVEL ?? (isProduction ? "info" : "debug"),
  defaultMeta: {
    service: env.SERVICE_NAME ?? "express-api",
    version: env.npm_package_version,
  },
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports,
});

export default logger;
