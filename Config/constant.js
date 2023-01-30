const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

exports.BACKEND_BASE_API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.PRODUCTION_API_URL
    : process.env.LOCAL_HOST_API_URL;

exports.NODE_ENV = process.env.NODE_ENV;
exports.PORT = process.env.PORT;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
exports.JWT_COOKIE_EXPIRES_IN = process.env.JWT_COOKIE_EXPIRES_IN;

exports.PROJECT_ID = process.env.PROJECT_ID;

exports.AAMAR_PAY_API_URL = process.env.AAMAR_PAY_SANDBOX_URL;
exports.AAMAR_PAY_STORE_ID = process.env.AAMAR_PAY_SANDBOX_STORE_ID;
exports.AAMAR_PAY_SIGNATURE_KEY = process.env.AAMAR_PAY_SANDBOX_SIGNATURE_KEY;
