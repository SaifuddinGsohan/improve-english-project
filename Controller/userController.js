const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");
const prisma = require("../client");

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await prisma.user.findMany();

  if (users.length === 0) {
    return next(new AppError(`No users found in this database`, 404));
  }

  res
    .status(200)
    .json({ status: "success", message: `Users data founds`, data: users });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });
  if (!user) {
    return next(new AppError(`No user found with that id :${id}`));
  }
  res.status(200).json({
    status: "success",
    message: `User Data found with that id :${id}`,
    data: user,
  });
});

exports.updateUserLevel = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const data = {
    level: req.body.level,
  };
  const updated = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: data,
  });
  if (!updated) {
    return next(new AppError(`No user found with that id :${id}`));
  }
  res.status(200).json({
    status: "success",
    message: `User level updated with that id :${id}`,
    data: data,
  });
});
