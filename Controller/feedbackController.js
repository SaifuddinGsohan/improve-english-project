const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");
const prisma = require("../client");

exports.createFeedback = catchAsync(async (req, res, next) => {
  const { title, max_range, min_range, feedback } = req.body;

  const isExist = await prisma.feedback.findFirst({
    where: {
      max_range: Number(max_range),
      min_range: Number(min_range),
    },
  });

  if (isExist) {
    return next(new AppError(`This range already existed`, 409));
  }

  const newFeedback = await prisma.feedback.create({
    data: {
      title,
      max_range,
      min_range,
      feedback,
      img_url: "testing",
    },
  });

  res.status(200).json({
    status: "success",
    message: "new feedback added successfully",
    data: newFeedback,
  });
});
