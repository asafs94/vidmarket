const { createLogger, format, transports } = require("winston");
const winston = require("winston");
const config = require("config");
const dateformat = require('dateformat')

require("winston-mongodb");
require("express-async-errors");

//DATABASE

const dbURI = config.get("db");

const consoleFormat = format.printf(({ level, message, timestamp }) => {
  let current_datetime = new Date(timestamp);
  let formatted_date = dateformat(current_datetime, "[dd/mm/yyyy] HH:MM:ss")
  return `${formatted_date} (${level.toUpperCase()}): ${message}`;
});

const consoleTransport = new transports.Console({
  level: "info",
  format: format.combine(
    format.prettyPrint(),
    format.timestamp(),
    consoleFormat
  ),
  handleExceptions: true
});

const mongoTransport = new transports.MongoDB({
  db: dbURI,
  collection: "logger",
  level: "info",
  handleExceptions: true
});

const errorFileTransport = new transports.File({
  level: "error",
  handleExceptions: true,
  filename: "errors.log",
  format: format.combine(
    format.timestamp(),
    format.colorize(),
    format.prettyPrint()
  ),
  options: { flags: "w" }
});

const logger = createLogger({
  level: "error",
  transports: [consoleTransport, mongoTransport, errorFileTransport],
  exitOnError: true
});


module.exports.logger = logger;
