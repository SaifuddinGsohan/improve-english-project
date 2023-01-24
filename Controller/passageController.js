const catchAsync = require("../Utils/catchAsync");
const prisma = require("../client");
const AppError = require("../Utils/appError");

exports.createPassage = catchAsync(async (req, res, next) => {
  const data = {
    title: req.body.title,
    passage: req.body.passage,
    summary: req.body.summary,
    level: req.body.level,
    creator_id: req.user.id,
    created_by: req.user.first_name,
  };
  await prisma.passage.create({
    data: data,
  });

  res
    .status(200)
    .json({ status: "success", message: "Passage created succussfully" });
});

exports.getPassages = catchAsync(async (req, res, next) => {
  const passages = await prisma.passage.findMany();
  if (passages.length === 0) {
    return next(new AppError(`No passages in the database. Sorry!`, 404));
  }
  res
    .status(200)
    .json({ status: "success", message: "Found all passages", data: passages });
});

exports.getPassage = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const passage = await prisma.passage.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      quiz: {
        include: {
          quiz_answer: true,
        },
      },
    },
  });
  if (!passage) {
    return next(new AppError(`Passage not found with that id:${id}`, 404));
  }

  res.status(200).json({
    status: "success",
    message: `Passage found with that id: ${id}`,
    data: passage,
  });
});
exports.updatePassage = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = {
    title: req.body.title,
    passage: req.body.passage,
    summary: req.body.summary,
    level: req.body.level,
  };
  const passage = await prisma.passage.update({
    where: {
      id: Number(id),
    },
    data: data,
  });
  if (!passage) {
    return next(new AppError(`Passage not found with that id :${id}`, 404));
  }

  res.status(200).json({
    status: "success",
    message: `Passage updated successfully with that id :${id}`,
  });
});

exports.deletePassage = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await prisma.passage.delete({
    where: {
      id: Number(id),
    },
  });
  res.status(200).json({
    status: "success",
    message: `Passage deleted successfully with that id :${id}`,
  });
});
