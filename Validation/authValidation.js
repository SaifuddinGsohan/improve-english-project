const catchAsync = require("../Utils/catchAsync");
const Joi = require("joi");

exports.createUserValidation = catchAsync(async (req, res, next) => {
  const role = ["admin", "moderator"];
  const schema = Joi.object({
    first_name: Joi.string().max(12).required(),
    last_name: Joi.string().max(12).required(),
    password: Joi.string().min(8).required(),
    confirm_password: Joi.string().min(8).required(),
    role: Joi.any().valid(...role),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
  });

  const value = await schema.validateAsync(req.body);

  if (value.password !== value.confirm_password) {
    return next(new AppError(`Password does not match! Try again please`, 403));
  }

  req.body = value;
  next();
});

exports.signInUserValidation = catchAsync(async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  const value = await schema.validateAsync(req.body);

  req.body = value;
  next();
});
