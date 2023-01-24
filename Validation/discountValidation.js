const Joi = require("joi");
const catchAsync = require("../Utils/catchAsync");

exports.promoSchema = catchAsync(async (req, res, next) => {
  const type = ["flat", "percentage"];
  const schema = Joi.object({
    code: Joi.string().min(5).max(10).required(),
    discount_type: Joi.any()
      .valid(...type)
      .required(),
    discount_amount: Joi.number().min(1).required(),
    affiliate_amount: Joi.number().min(1).required(),
    is_active: Joi.boolean().default(true),
  });

  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true, // remove unknown props
  };

  const value = await schema.validateAsync(req.body, options);

  req.body = value;
  next();
});

exports.couponSchema = catchAsync(async (req, res, next) => {
  const type = ["flat", "percentage"];
  const schema = Joi.object({
    code: Joi.string().min(5).max(10).required(),
    discount_type: Joi.any()
      .valid(...type)
      .required(),
    discount_amount: Joi.number().min(1).required(),
    is_active: Joi.boolean().default(true),
  });

  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true, // remove unknown props
  };

  const value = await schema.validateAsync(req.body, options);

  console.log(value);

  // on success replace req.body with validated value and trigger next middleware function
  req.body = value;
  next();
});
