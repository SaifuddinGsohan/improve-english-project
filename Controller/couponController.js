const prisma = require("../client");
const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");

exports.createCoupon = catchAsync(async (req, res, next) => {
  const data = {
    code: req.body.code,
    discount_type: req.body.discount_type,
    discount_amount: req.body.discount_amount,
  };
  const newCoupon = await prisma.coupon_code.create({
    data: data,
  });

  res.status(200).json({
    status: "success",
    message: `New Coupon created successfully`,
    data: newCoupon,
  });
});

exports.allCoupons = catchAsync(async (req, res, next) => {
  const docs = await prisma.coupon_code.findMany();
  res
    .status(200)
    .json({ status: "success", message: `Found All Coupon code`, data: docs });
});

exports.aCoupon = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const doc = await prisma.coupon_code.findUnique({
    where: {
      id: Number(id),
    },
  });
  if (!doc) {
    return next(new AppError(`No Coupon found with that id :${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    message: `Coupon found with that id :${id}`,
    data: doc,
  });
});

exports.updateCoupon = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = {
    code: req.body.code,
    discount_type: req.body.discount_type,
    discount_amount: req.body.discount_amount,
    is_active: req.body.is_active,
  };
  const doc = await prisma.coupon_code.update({
    where: {
      id: Number(id),
    },
    data: data,
  });

  res.status(200).json({
    status: "success",
    message: `Updated Coupon with that id :${id}`,
    data: doc,
  });
});

exports.deleteCoupon = catchAsync(async (req, res, next) => {
  await prisma.coupon_code.delete({
    where: {
      id: Number(id),
    },
  });
  res
    .status(200)
    .json({ status: "success", message: `Deleted coupon with id :${id}` });
});
