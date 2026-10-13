function errorHandler(error, req, res, next) {
  // Let Express handle it if the response has already started.
  if (res.headersSent) {
    return next(error);
  }

  if (error.code === "EMAIL_ALREADY_REGISTERED") {
    return res.status(409).json({
      message: "Email is already registered.",
    });
  }

  // Use an intentional status code if one was set; otherwise treat it as a server error.
  const statusCode =
    Number.isInteger(error.statusCode) &&
    error.statusCode >= 400 &&
    error.statusCode < 600
      ? error.statusCode
      : 500;

  if (statusCode >= 500) {
    console.error("Unhandled request error:", error);
  }

  return res.status(statusCode).json({
    message:
      statusCode >= 500
        ? "Internal server error."
        : error.message,
  });
}

module.exports = errorHandler;