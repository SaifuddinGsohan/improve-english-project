const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");
const prisma = require("../client");

exports.createQuiz = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const quiz = await prisma.quiz.create({
    data: {
      passage_id: req.body.passage_id,
      type: req.body.type,
      question: req.body.question,
      opt_a: req.body.opt_a,
      opt_b: req.body.opt_b,
      opt_c: req.body.opt_c,
      opt_d: req.body.opt_d,
      quiz_answer: {
        create: {
          ans_a: req.body.ans_a,
          ans_b: req.body.ans_b,
          ans_c: req.body.ans_c,
          ans_d: req.body.ans_d,
        },
      },
    },
  });

  res.status(200).json({
    status: "success",
    message: "Quiz created successfully",
    data: quiz,
  });
});

exports.getQuizes = catchAsync(async (req, res, next) => {
  const quizes = await prisma.quiz.findMany({
    include: {
      quiz_answer: true,
    },
  });

  if (quizes.length === 0) {
    return next(new AppError(`No quizes found in the database`, 404));
  }
  res
    .status(200)
    .json({ status: "success", message: `found all quizes`, data: quizes });
});

exports.getQuiz = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const quiz = await prisma.quiz.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      quiz_answer: true,
    },
  });
  if (!quiz) {
    return next(new AppError(`Quiz not found with that id :${id}`));
  }
  res.status(200).json({
    status: "success",
    message: `Quiz found with that id :${id}`,
    data: quiz,
  });
});

exports.updateQuiz = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const quiz = await prisma.quiz.update({
    where: {
      id: Number(id),
    },
    data: {
      type: req.body.type,
      question: req.body.question,
      opt_a: req.body.opt_a,
      opt_b: req.body.opt_b,
      opt_c: req.body.opt_c,
      opt_d: req.body.opt_d,
      quiz_answer: {
        update: {
          ans_a: req.body.ans_a,
          ans_b: req.body.ans_b,
          ans_c: req.body.ans_c,
          ans_d: req.body.ans_d,
        },
      },
    },
  });
  if (!quiz) {
    return next(new AppError(`Quiz not found with that id :${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    message: `Quiz updated Successfully with that id :${id}`,
  });
});

exports.deleteQuiz = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const quiz = await prisma.quiz.delete({
    where: {
      id: Number(id),
    },
  });
  if (!quiz) {
    return next(new AppError(`Quiz not found with that id :${id}`));
  }
  res.status(200).json({
    status: "success",
    message: `Quiz delete successfully with that id :${id}`,
  });
});
