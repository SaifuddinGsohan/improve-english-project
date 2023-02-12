const prisma = require("../client");
const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");

exports.createPromoCode = catchAsync(async (req, res, next) => {
  const data = {
    code: req.body.code,
    discount_type: req.body.discount_type,
    discount_amount: req.body.discount_amount,
    affiliate_amount: req.body.affiliate_amount,
  };

  const newPromoCode = await prisma.promo_code.create({
    data: data,
  });

  res.status(200).json({
    status: "success",
    message: "Promo Code Created Successfully",
    data: newPromoCode,
  });
});

exports.getAllPromoCode = catchAsync(async (req, res, next) => {
  const data = await prisma.promo_code.findMany();
  res
    .status(200)
    .json({
      status: "success",
      message: `Found All ${data.length} Promo Code`,
      data: data,
    });
});

exports.getAPromoCode = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = await prisma.promo_code.findUnique({
    where: {
      id: Number(id),
    },
  });
  if (!data) {
    return next(new AppError(`No Promo code found with that id:${id}`, 404));
  }
  res
    .status(200)
    .json({ status: "success", message: "Promo code found", data: data });
});

exports.promoPrice = catchAsync(async (req, res, next) => {
  const { code } = req.query;
  console.log(code);
  const promoDetails = await prisma.promo_code.findMany({
    where: {
      code: code,
    },
    select: {
      discount_amount: true,
      discount_type: true,
    },
  });
  if (promoDetails.length === 0) {
    return next(new AppError(`No promo code found with that code  ${code}`));
  }

  res.status(200).json({
    status: "success",
    message: "Get Promo code successfully",
    data: promoDetails,
  });
});

exports.updatePromoCode = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = {
    code: req.body.code,
    discount_type: req.body.discount_type,
    discount_amount: req.body.discount_amount,
    affiliate_amount: req.body.affiliate_amount,
    is_active: req.body.is_active,
  };

  await prisma.promo_code.update({
    where: {
      id: Number(id),
    },
    data: data,
  });

  res.status(200).json({
    status: "success",
    message: `Promo code update with that id:${id}`,
  });
});

exports.deletePromoCode = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deleted = await prisma.promo_code.delete({
    where: {
      id: Number(id),
    },
  });
  res.status(200).json({
    status: "success",
    message: `Promo code deteled with that id:${id}`,
    data: deleted,
  });
});
