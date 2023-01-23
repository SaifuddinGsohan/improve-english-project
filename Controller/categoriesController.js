const prisma = require("../client");
const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");

exports.createCategories = catchAsync(async (req, res, next) => {
  const data = {
    title: req.body.title,
    description: req.body.description,
  };
  const newCategory = await prisma.categories.create({
    data: data,
  });
  res.status(200).json({
    status: "success",
    message: "new category created successfully",
    data: newCategory,
  });
});

exports.getCategories = catchAsync(async (req, res, next) => {
  const categories = await prisma.categories.findMany();
  if (categories.length === 0) {
    return next(new AppError(`No categories found in the database`, 404));
  }

  res.status(200).json({
    status: "success",
    message: "Found all categories",
    data: categories,
  });
});

exports.getCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const category = await prisma.categories.findUnique({
    where: {
      id: Number(id),
    },
  });
  if (!category) {
    return next(new AppError(`No category found with that id :${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    message: `category found with that id :${id}`,
    data: category,
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = {
    title: req.body.title,
    description: req.body.description,
  };
  const category = await prisma.categories.update({
    where: {
      id: Number(id),
    },
    data: data,
  });
  if (!category) {
    return next(new AppError(`No category found with that id :${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    message: `category updated with that id :${id}`,
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const category = await prisma.categories.delete({
    where: {
      id: Number(id),
    },
  });
  if (!category) {
    return next(new AppError(`no category found with that id ${id}`));
  }
  res.status(200).json({
    status: "success",
    message: `category deleted successfully with that id :${id}`,
  });
});
