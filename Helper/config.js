const Cloud = require("@google-cloud/storage");
const path = require("path");
const dotenv = require("dotenv");
const { PROJECT_ID } = require("../Config/constant");
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const serviceKey = path.join(__dirname, "../mykey.json");

const { Storage } = Cloud;

const storage = new Storage({
  keyFilename: serviceKey,
  projectId: PROJECT_ID,
});

module.exports = storage;
