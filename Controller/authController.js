const prisma = require("../client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { ACCESS_SECRET, REFRESH_SECRET } = require("../Config/constant");
const catchAsync = require("../Utils/catchAsync");
const AppError = require("../Utils/appError");

const createJwtToken = async (tokenData, res, resMessage) => {
  const accessToken = jwt.sign(tokenData, ACCESS_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign(tokenData, REFRESH_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: resMessage,
    accessToken,
    refreshToken,
  });
};

exports.refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.cookies;
  if (refreshToken === undefined) {
    return next(new AppError(`empty token field`, 401));
  }

  const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
  const isUserExits = await prisma.user.findUnique({
    where: {
      id: decoded.id,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
    },
  });

  if (!isUserExits) {
    return next(new AppError(`User not exist`, 404));
  }

  createJwtToken(
    isUserExits,
    res,
    "New Access Token And Refresh Token Generated"
  );
});

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
  };

  createJwtToken(
    tokenData,
    res,
    "User Created Successfully and login into readvive"
  );
});

exports.signIn = catchAsync(async (req, res, next) => {
  console.log(req.body);
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
  };

  const validity = bcrypt.compare(password, user.password);
  if (!validity) {
    return next(new AppError("Provided Wrong password", 403));
  }
  createJwtToken(tokenData, res, "login Successfull into readvive");
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in. Please Log in to grant acess", 401)
    );
  }
  const decoded = jwt.verify(token, ACCESS_SECRET);
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

  console.log(currentUser);

  req.user = currentUser;
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
