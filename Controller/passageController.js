const catchAsync = require("../Utils/catchAsync");
const prisma = require("../client");

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
