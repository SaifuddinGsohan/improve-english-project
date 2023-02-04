const prisma = require("../client");
const { uploadImage } = require("../Helper/imageUploader");
const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");

exports.createLanding = catchAsync(async (req, res, next) => {
  if (req.files.length === 0) {
    return next(new AppError(`Images field can not be empty`, 404));
  }

  const isExist = await prisma.landing_page.findUnique({
    where: {
      id: 1,
    },
  });

  if (isExist) {
    return next(new AppError(`Landing Page already created`, 409));
  }

  const imgUrl = [];

  if (req?.files) {
    for (let i = 0; i < req.files.length; i++) {
      imgUrl[i] = await uploadImage(req.files[i]);
    }
  }

  const createLanding = await prisma.landing_page.create({
    data: {
      id: 1,
      heading: req.body.heading,
      sub_heading: req.body.sub_heading,
      cta: req.body.cta,
      fa_heading: req.body.fa_heading,
      fa_cta: req.body.fa_cta,
      landing_img1: imgUrl[0],
      landing_img2: imgUrl[1],
      landing_img3: imgUrl[3],
    },
  });

  res.status(200).json({
    status: "success",
    message: `landing page created successfully`,
    data: createLanding,
  });
});

exports.getLandingPage = catchAsync(async (req, res, next) => {
  const landingPage = await prisma.landing_page.findUnique({
    where: {
      id: 1,
    },
  });

  if (!landingPage) {
    return next(new AppError(`No landing page found in this database`, 404));
  }

  res.status(200).json({
    status: "success",
    message: `Landing page information found`,
    data: landingPage,
  });
});

exports.updateLandingPage = catchAsync(async (req, res, next) => {});
