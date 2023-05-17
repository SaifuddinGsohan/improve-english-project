const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const AppError = require("./Utils/appError");
const globalErrorHandler = require("./ErrorHandler/errorHandler");
const cookieParser = require("cookie-parser");
const path = require("path");

const AuthRouter = require("./Routes/authRoutes");
const UserRouter = require("./Routes/userRoutes");
const PaymentRouter = require("./Routes/paymentRoutes");
const PackagesRouter = require("./Routes/packagesRoutes");
const PassageRouter = require("./Routes/passageRoutes");
const QuizRouter = require("./Routes/quizRoutes");
const ProgressRouter = require("./Routes/progressRoutes");
const DiscountRouter = require("./Routes/discountRoutes");
const BulkRouter = require("./Routes/bulkRoutes");
const FeedbackRouter = require("./Routes/feedbackRoutes");
const LandingRouter = require("./Routes/landingRoutes");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan(':date[clf] ":method :url"'));
}

app.get("/", (req, res) => {
  res.status(200).json("Improve English API 1.0");
});

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/packages", PackagesRouter);
app.use("/api/v1/payment", PaymentRouter);
app.use("/api/v1/discount", DiscountRouter);
app.use("/api/v1/passages", PassageRouter);
app.use("/api/v1/quizes", QuizRouter);
app.use("/api/v1/progress", ProgressRouter);
app.use("/api/v1/bulk", BulkRouter);
app.use("/api/v1/feedback", FeedbackRouter);
app.use("/api/v1/landing", LandingRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
