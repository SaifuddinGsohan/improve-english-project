const { uploadImage } = require("../Helper/imageUploader");
const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");
const prisma = require("../client");

exports.createFeedback = catchAsync(async (req, res, next) => {
  if (!req?.file) {
    return next(new AppError(`Image field Missing`));
  }

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

  //const img_url = await uploadImage(req.file);

  const newFeedback = await prisma.feedback.create({
    data: {
      title,
      max_range: Number(max_range),
      min_range: Number(min_range),
      feedback,
      img_url: "image text format",
    },
  });

  res.status(200).json({
    status: "success",
    message: "new feedback added successfully",
    data: newFeedback,
  });
});

exports.getsFeedback = catchAsync(async (req, res, next) => {
  const feedbacks = await prisma.feedback.findMany();
  if (feedbacks.length === 0) {
    return next(new AppError(`No Feedback found in this database`, 404));
  }
  res.status(200).json({
    status: "success",
    message: `Total ${feedbacks.length} found in this database`,
    data: feedbacks,
  });
});

exports.getAFeedback = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const feedback = await prisma.feedback.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!feedback) {
    return next(
      new AppError(`No feedback message found with that id :${id}`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    message: `Feedback found with this id :${id}`,
    data: feedback,
  });
});

exports.updateFeedback = catchAsync(async (req, res, next) => {
  let img_url;
  if (req.file) {
    img_url = await uploadImage(req.file);
  }
  const { title, max_range, min_range, feedback } = req.body;
  const data = {
    title,
    max_range: Number(max_range),
    min_range: Number(min_range),
    feedback,
    img_url,
  };
  const { id } = req.params;
  const updateFeedback = await prisma.feedback.update({
    where: {
      id: Number(id),
    },
    data: data,
  });

  if (!feedback) {
    return next(new AppError(`No Feedback found with this id ${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    message: `Feedback updated successfully with that id :${id}`,
    data: updateFeedback,
  });
});

exports.deleteFeedback = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deleted = await prisma.feedback.delete({
    where: {
      id: Number(id),
    },
  });
  if (!deleted) {
    return next(new AppError(`No feedback found with that id: ${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    message: `Feedback deleted successfully with that id: ${id}`,
  });
});

const compare = (min, max, result) => {
  if (result <= max && result >= min) return true;
};

exports.getFeedbackText = catchAsync(async (req, res, next) => {
  const { result } = req.query;

  const allFeedback = await prisma.feedback.findMany();

  let compareResult;

  for (let i = 0; i < allFeedback.length; i++) {
    compareResult = compare(
      allFeedback[i].min_range,
      allFeedback[i].max_range,
      result
    );

    if (compareResult) {
      return res.status(200).json({
        status: "success",
        message: `Found text based on result`,
        data: allFeedback[i].feedback,
      });
    }
  }

  res.status(200).json({
    status: "success",
    message: `No feedback found with this value ${result}`,
  });
});
