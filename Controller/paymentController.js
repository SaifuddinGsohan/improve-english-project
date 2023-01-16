const axios = require("axios");
const crypto = require("crypto");
const Joi = require("joi");
const pug = require("pug");
const prisma = require("../client");
const {
  BACKEND_BASE_API_URL,
  AAMAR_PAY_STORE_ID,
  AAMAR_PAY_SIGNATURE_KEY,
  AAMAR_PAY_API_URL,
} = require("../Config/constant");
const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");

const schema = Joi.object().keys({
  name: Joi.string().alphanum().min(3).max(30).required(),
  birthyear: Joi.number().integer().integer().min(1995).max(2005),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
});

const options = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true, // remove unknown props
};

exports.validationCheck = catchAsync(async (req, res, next) => {
  const value = await schema.validateAsync(req.body);

  res.status(200).json(value);
});

const aamarPay = async (body) => {
  const result = await axios({
    method: "POST",
    url: AAMAR_PAY_API_URL,
    data: {
      store_id: AAMAR_PAY_STORE_ID,
      signature_key: AAMAR_PAY_SIGNATURE_KEY,
      cus_name: body.cus_name,
      cus_email: body.cus_email,
      cus_phone: body.cus_phone,
      cus_add1: body.cus_add1,
      cus_add2: body.cus_add2,
      opt_a: body.opt_a,
      opt_b: body.opt_b,
      opt_c: body.opt_c,
      cus_city: body.cus_city,
      cus_country: body.cus_country,
      amount: body.amount,
      tran_id: body.tran_id,
      currency: body.currency,
      success_url: `${BACKEND_BASE_API_URL}/api/v1/purchase/create`,
      fail_url: `${BACKEND_BASE_API_URL}/api/v1/payment/failed`,
      cancel_url: `${BACKEND_BASE_API_URL}/api/v1/payment/cancle`,
      desc: body.desc,
      type: body.type,
    },
  });

  return result;
};

exports.createPayment = catchAsync(async (req, res, next) => {
  console.log("hello");
  const data = {
    cus_name: req.body.cus_name,
    cus_email: req.body.cus_email,
    cus_phone: req.body.phone,
    cus_add1: req.body.cus_add1,
    cus_add2: req.body.cus_add2,
    cus_city: req.body.cus_city,
    cus_country: req.body.cus_country,
    packageId: req.body.packageId,
    variationId: req.body.variationId,
    voucher_code: req.body.voucher_code,
    amount: req.body.amount,
    currency: req.body.currency,
    desc: req.body.desc,
  };
  console.log(req.body);
  const tran_id = crypto.randomBytes(3 * 4).toString("base64");

  console.log(data);
  res.status(200).json(data);

  // const package = await prisma.package.res.status(200).json("success");

  //   const paymentUrl = await aamarPay(req.body);
  //   if (!paymentUrl.data.result) {
  //     return next(new AppError(`Can't create payment url`, 404));
  //   }
  //   res.status(200).json({
  //     status: "success",
  //     message: "Payment Url Created Successfully",
  //     url: paymentUrl.data.payment_url,
  //   });
});

exports.paymentSuccess = catchAsync(async (req, res, next) => {
  console.log(req.body);
  
});

exports.paymentFailed = (req, res) => {
  const html = pug.render("payment failed");
  res.send(html);
};
