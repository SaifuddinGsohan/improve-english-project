const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

exports.BACKEND_BASE_API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.PRODUCTION_API_URL
    : process.env.LOCAL_HOST_API_URL;

exports.NODE_ENV = process.env.NODE_ENV;
exports.PORT = process.env.PORT;
exports.ACCESS_SECRET = process.env.ACCESS_SECRET;
exports.REFRESH_SECRET = process.env.REFRESH_SECRET;

exports.AAMAR_PAY_API_URL = process.env.AAMAR_PAY_SANDBOX_URL;
exports.AAMAR_PAY_STORE_ID = process.env.AAMAR_PAY_SANDBOX_STORE_ID;
exports.AAMAR_PAY_SIGNATURE_KEY = process.env.AAMAR_PAY_SANDBOX_SIGNATURE_KEY;


