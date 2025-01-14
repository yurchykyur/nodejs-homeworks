const express = require("express");
const logger = require("morgan");
const cors = require("cors");

require("dotenv").config();

const { contactsRouter, authRouter } = require("./routes/api");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/auth", authRouter);
app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, _, res, next) => {
  const { status: statusError = 500, error = { message: "Server error" } } =
    err;
  const {
    status = "error",
    code = statusError,
    message = "Server error",
    data = "",
  } = error;
  res.status(statusError).json({ status, code, message, data });
});

module.exports = app;
