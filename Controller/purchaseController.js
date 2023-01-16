const prisma = require("../client");
const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");

exports.createPurchase = catchAsync(async (req, res) => {
  const result = await prisma.vocavive_purchase_info.create({
    data: {
      package_id: req.body.package_id,
      variation_id: req.body.variation_id,
      vocavive_id: req.body.vocavive_id,
    },
  });
  await prisma.vocavive_user.update({
    where: {
      id: req.body.vocavive_id,
    },
    data: {
      payment_status: true,
    },
  });
  console.log(result);
  res.status(200).json({
    status: "success",
    message: "Purchase information for vocavive created successfully",
    data: result,
  });
});

exports.getPurchaseInfo = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  const info = await prisma.vocavive_purchase_info.findMany({
    where: {
      vocavive_id: Number(id),
    },
  });

  if (info.length === 0) {
    return next(
      new AppError(`No purchase information found with this id: ${id}`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    message: `found purchase information with this id: ${id}`,
    data: info,
  });
});
