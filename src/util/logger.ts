import winston from "winston";
import path from "path";
import fs from "fs";

const logsDir = path.join("logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const jsonFormat = winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), winston.format.json());

export const log = winston.createLogger({
  level: "debug",
  format: jsonFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
    new winston.transports.File({
      filename: path.join(logsDir, "error.json.log"),
      level: "error",
      format: jsonFormat,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, "combined.json.log"),
      format: jsonFormat,
    }),
  ],
});
