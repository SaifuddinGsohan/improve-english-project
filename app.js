const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const AppError = require("./Utils/appError");
const globalErrorHandler = require("./ErrorHandler/errorHandler");
const cookieParser = require("cookie-parser");
const path = require("path");

const AuthRouter = require("./Routes/authRoutes");
const PaymentRouter = require("./Routes/paymentRoutes");
const PackagesRouter = require("./Routes/packagesRoutes");
const PassageRouter = require("./Routes/passageRoutes");
const QuizRouter = require("./Routes/quizRoutes");
const CategoriesRouter = require("./Routes/categoriesRoutes");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(morgan(':date[clf] ":method :url"'));
app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json("Edvive Readvive API 1.0");
});

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/payment", PaymentRouter);
app.use("/api/v1/packages", PackagesRouter);
app.use("/api/v1/passages", PassageRouter);
app.use("/api/v1/quizes", QuizRouter);
app.use("/api/v1/categories", CategoriesRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
