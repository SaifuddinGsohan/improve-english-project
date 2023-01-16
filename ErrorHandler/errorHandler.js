const { NODE_ENV } = require("../Config/constant");
const AppError = require("../Utils/appError");

const handleJWTError = () =>
  new AppError("Invalid Token. Please login again!", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired. Please login again!", 401);

const handleDuplicateFieldsDB = (err) => {
  const value = [...err];
  console.log(value);
  const message = `Duplicate fields value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      name: err.name,
      stack: err.stack,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith("/api")) {
    // a) Operational, truster error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // b) Programming or other unknown error: don't leak error details
    // 1) Log Error
    console.error("ERROR 🔥", err);

    // 2) Send generic message
    return res.status(500).json({
      status: err.status,
      message: err.message,
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;
    if (err.code === "P2002") error = handleDuplicateFieldsDB(err.meta.target);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();
    sendErrorProd(error, req, res);
  }
};
