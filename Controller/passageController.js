const catchAsync = require("../Utils/catchAsync");
const prisma = require("../client");
const AppError = require("../Utils/appError");
const { countWords } = require("../Utils/wordCount");

exports.createPassage = catchAsync(async (req, res, next) => {
  const { passage } = req.body;

  const passage_len = countWords(passage);

  const data = {
    lession_no: req.body.lession_no,
    title: req.body.title,
    passage: req.body.passage,
    passage_len,
    summary: req.body.summary,
    level: req.body.level,
    creator_id: req.user.id,
    created_by: req.user.first_name,
  };

  if (req.body.lession_no === 0) {
    data.level = "assessment";
  }

  await prisma.passage.create({
    data: data,
  });

  res
    .status(200)
    .json({ status: "success", message: `Passage created succussfully` });
});

exports.getPassages = catchAsync(async (req, res, next) => {
  const { level } = req.query;
  console.log(level);
  let passages;
  if (level) {
    passages = await prisma.passage.findMany({
      where: {
        level: level,
      },
      select: {
        lession_no: true,
        level: true,
        title: true,
      },
      orderBy: {
        lession_no: "asc",
      },
    });
  } else {
    passages = await prisma.passage.findMany({
      select: {
        lession_no: true,
        level: true,
        title: true,
      },
      orderBy: {
        lession_no: "asc",
      },
    });
  }

  if (passages.length === 0) {
    return next(new AppError(`No passages in the database. Sorry!`, 404));
  }
  res.status(200).json({
    status: "success",
    message: `Found all ${passages.length} passages`,
    data: passages,
  });
});

exports.getPassage = catchAsync(async (req, res, next) => {
  const { lession } = req.query;
  const passage = await prisma.passage.findUnique({
    where: {
      lession_no: Number(lession),
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
    return next(
      new AppError(`Passage not found with that lession no:${lession}`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    message: `Passage found with that lession no: ${lession}`,
    data: passage,
  });
});
exports.updatePassage = catchAsync(async (req, res, next) => {
  const { lession } = req.query;
  const data = {
    title: req.body.title,
    passage: req.body.passage,
    summary: req.body.summary,
    level: req.body.level,
  };

  const passage = await prisma.passage.update({
    where: {
      lession_no: Number(lession),
    },
    data: data,
  });
  if (!passage) {
    return next(
      new AppError(`Passage not found with that id :${lession}`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    message: `Passage updated successfully with that id :${lession}`,
  });
});

exports.deletePassage = catchAsync(async (req, res, next) => {
  const { lession } = req.query;
  await prisma.passage.delete({
    where: {
      lession_no: Number(lession),
    },
  });
  res.status(200).json({
    status: "success",
    message: `Passage deleted successfully with that id :${lession}`,
  });
});
