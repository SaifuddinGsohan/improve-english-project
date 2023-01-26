const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");
const prisma = require("../client");

exports.createProgress = catchAsync(async (req, res, next) => {
  const existenReport = await prisma.progress_report.findMany({
    where: {
      user_id: Number(req.user.id),
      lession_no: Number(req.body.lession_no),
    },
  });

  if (existenReport.length !== 0) {
    return next(
      new AppError(
        `This is user already completed ${req.body.lession_no} no lession`,
        409
      )
    );
  }

  const data = {
    user_id: req.user.id,
    wpm: req.body.wpm,
    lexical: req.body.lexical,
    comprehension: req.body.comprehension,
    lession_no: req.body.lession_no,
  };

  const progress = await prisma.progress_report.create({
    data: data,
  });

  res.status(200).json({
    status: "success",
    message: `Lession no ${req.body.lession_no} created successfuly`,
    data: progress,
  });
});

exports.getAllProgress = catchAsync(async (req, res, next) => {
  const progress = await prisma.progress_report.findMany();
  if (progress.length === 0) {
    return next(new AppError(`No progress report found with this users`, 404));
  }
  res.status(200).json({
    status: "success",
    message: `found ${progress.length} progress report with this id`,
    data: progress,
  });
});

exports.updateProgress = catchAsync(async (req, res, next) => {
  const { lession } = req.query;
  const data = {
    wpm: req.body.wpm,
    lexical: req.body.lexical,
    comprehension: req.body.comprehension,
  };

  const existed = await prisma.progress_report.findMany({
    where: {
      user_id: req.user.id,
      lession_no: Number(lession),
    },
  });

  if (existed.length === 0) {
    return next(
      new AppError(
        ` No progress record found with that lession no :${lession} `,
        404
      )
    );
  }

  if (existed[0].wpm > req.body.wpm) {
    data.wpm = existed[0].wpm;
  }
  if (existed[0].lexical > req.body.lexical) {
    data.lexical = existed[0].lexical;
  }
  if (existed[0].comprehension > req.body.comprehension) {
    data.comprehension = existed[0].comprehension;
  }

  const progress = await prisma.progress_report.update({
    where: {
      id: existed[0].id,
    },
    data: data,
  });

  res.status(200).json({
    status: "success",
    message: ` Progress report updated with that lession no :${lession}`,
    data: progress,
  });
});
