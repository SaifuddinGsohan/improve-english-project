const dotenv = require("dotenv");
const path = require("path");
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting Down...");
  console.log(err.name, err.message);

  process.exit(1);
});
dotenv.config({ path: path.resolve(__dirname, ".env") });
const app = require("./app");
const { PORT } = require("./Config/constant");
const port = PORT || 5000;

const server = app.listen(port, () => {
  console.log(`The server Readvive is running at port: ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting Down...");
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
