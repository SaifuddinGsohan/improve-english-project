const Joi = require("joi");
const catchAsync = require("../Utils/catchAsync");

exports.createPaymentSchema = catchAsync(async (req, res, next) => {
  const discountType = ["promo_code", "coupon_code"];
  const schema = Joi.object({
    cus_name: Joi.string().required(),
    cus_email: Joi.string().required(),
    cus_phone: Joi.string().min(11).max(11).required(),
    cus_add1: Joi.string().required(),
    cus_add2: Joi.string().required(),
    cus_city: Joi.string().required(),
    cus_country: Joi.string().required(),
    package_id: Joi.number().min(1).max(2).required(),
    variation_id: Joi.number().min(1).max(2).required(),
    discountType: Joi.any().valid(...discountType),
    discountCode: Joi.any().when("discountType", {
      is: Joi.exist(),
      then: Joi.valid().required(),
      otherwise: Joi.valid({ place: Joi.forbidden() }),
    }),
    currency: Joi.string().required(),
    desc: Joi.string().required(),
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
