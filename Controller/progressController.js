const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");
const prisma = require("../client");

exports.createProgress = catchAsync(async (req, res, next) => {
  const data = {
    user_id: req.user.id,
    wpm: req.body.wpm,
    lexical: req.body.lexical,
    comprehension: req.body.comprehension,
    lession_no: req.body.lession_no,
  };
  await prisma.progress_report.create({
    data: data,
  });

  res.status(200).json({
    status: "success",
    message: `Lession no ${req.body.lession_no} created successfuly`,
  });
});

exports.getAllProgress = catchAsync(async (req, res, next) => {
  const progress = await prisma.progress_report.findMany();
  if (progress.length === 0) {
    return next(new AppError(`No progress report found with this users`));
  }
  res.status(200).json({
    status: "success",
    message: `found ${progress.length} progress report with this id`,
    data: progress,
  });
});

exports.updateProgress = catchAsync(async (req, res, next) => {
  const { lession_no } = req.query;
  const data = {
    wpm: req.body.wpm,
    lexical: req.body.lexical,
    comprehension: req.body.comprehension,
  };
  const progress = await prisma.progress_report.update({
    where: {
      lession_no: Number(),
    },
    data: data,
  });

  if (!progress) {
    return next(
      new AppError(
        ` No progress record found with that lession no :${lession_no} `
      )
    );
  }

  res.status(200).json({
    status: "success",
    message: ` Progress report updated with that lession no :${lession_no}`,
  });
});
