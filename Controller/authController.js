const prisma = require("../client");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const bcrypt = require("bcrypt");
const {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_COOKIE_EXPIRES_IN,
} = require("../Config/constant");
const catchAsync = require("../Utils/catchAsync");
const AppError = require("../Utils/appError");

const signToken = (data) => {
  return jwt.sign(data, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

const createJwtToken = async (req, res, tokenData) => {
  const token = signToken(tokenData);

  const cookieOptions = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  };

  res.cookie("jwt", token, cookieOptions);

  res.status(200).json({
    status: "success",
    token,
  });
};

exports.signup = catchAsync(async (req, res) => {
  const { first_name, last_name, email, password, phone, role } = req.body;

  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      first_name,
      last_name,
      email,
      password: hash,
      role: role,
      phone,
    },
  });

  const tokenData = {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    level: user.level,
  };

  createJwtToken(req, res, tokenData);
});

exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return next(new AppError("User not exist in the database!", 404));
  }

  const tokenData = {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    level: user.level,
  };

  const validity = bcrypt.compare(password, user.password);
  if (!validity) {
    return next(new AppError("Provided Wrong password", 403));
  }
  createJwtToken(req, res, tokenData);
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError("You are not logged in. Please Log in to grant acess", 401)
    );
  }
  const decoded = await promisify(jwt.verify)(token, JWT_SECRET);
  const currentUser = await prisma.user.findUnique({
    where: {
      id: decoded.id,
    },
  });

  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token does no longer exist", 401)
    );
  }

  req.user = currentUser;
  next();
});

exports.accessCheck = catchAsync(async (req, res, next) => {
  const { id } = req.user;

  if (req.user.role === "admin" || req.user.role === "moderator") {
    next();
  } else {
    const expiry_date = await prisma.purchase_info.findMany({
      where: {
        user_id: Number(id),
      },
    });

    if (expiry_date.length === 0) {
      return next(
        new AppError(`No payment recond with that user id ${id}`, 404)
      );
    }
    const today = new Date();

    if (expiry_date[expiry_date.length - 1].expiry_date <= today) {
      return next(
        new AppError(`Access date Expired Please purchase again`, 498)
      );
    }
    next();
  }
});

exports.nextPassage = catchAsync(async (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "moderator") {
    return next();
  }

  const { id } = req.user;
  const { lession } = req.query;

  if (lession < 1 || lession > 90) {
    return next(new AppError(`Access unavaiable`));
  }

  if (lession == 1) return next();

  if (req.user.level === "intermediate" && lession <= 31) {
    return next();
  }

  if (req.user.level === "advanced" && lession <= 61) {
    return next();
  }

  const progressReport = await prisma.progress_report.findFirst({
    where: {
      user_id: Number(id),
      lession_no: Number(lession - 1),
    },
  });

  if (!progressReport) {
    return next(
      new AppError(
        `No Progress Report found with that lession no ${lession - 1}`,
        404
      )
    );
  }

  const { comprehension } = progressReport;
  if (comprehension <= 60) {
    return next(new AppError(`lession locked based on previous report`, 423));
  }
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};
