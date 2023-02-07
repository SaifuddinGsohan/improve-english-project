const prisma = require("../client");
const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");

exports.createPackage = catchAsync(async (req, res, next) => {
  const data = {
    name: req.body.name,
    title: req.body.title,
    currency: req.body.currency,
    price: req.body.price,
    discount: req.body.discount,
    expiration: req.body.expiration,
  };

  await prisma.packages.create({
    data: data,
  });

  res
    .status(200)
    .json({ status: "success", message: "Package Created Successfully" });
});

exports.getPackages = catchAsync(async (req, res, next) => {
  console.log("packages");
  const packages = await prisma.packages.findMany();
  if (packages.length === 0) {
    return next(new AppError(`No packages found in the database`, 404));
  }

  res
    .status(200)
    .json({ status: "success", message: `found all packages`, data: packages });
});

exports.getPackage = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const pacakge = await prisma.packages.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!pacakge) {
    return next(new AppError(`No package found with that id:${id}`, 404));
  }

  res.status(200).json({
    status: "success",
    message: `Package found with that id:${id}`,
    data: pacakge,
  });
});

exports.updatePackage = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = {
    name: req.body.name,
    title: req.body.title,
    currency: req.body.currency,
    price: req.body.price,
    status: req.body.status,
    discount: req.body.discount,
  };
  await prisma.packages.update({
    where: {
      id: Number(id),
    },
    data: data,
  });
  res.status(200).json({
    status: "success",
    message: `Package Updated Successfully with that id :${id}`,
  });
});

exports.deletePackage = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  const find = await prisma.packages.findUnique({
    where: {
      id: Number(id),
    },
  });
  console.log(find);
  const package = await prisma.packages.delete({
    where: {
      id: Number(id),
    },
  });
  if (!package) {
    return next(new AppError(`No package found with that id :${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    message: `package deleted with that id :${id}`,
  });
});
