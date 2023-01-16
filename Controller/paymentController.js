const axios = require("axios");
const crypto = require("crypto");
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
      opt_a: body.app_uid,
      opt_b: body.packageAndVariationId,
      opt_c: body.discountAmount,
      cus_city: body.cus_city,
      cus_country: body.cus_country,
      amount: body.amount,
      tran_id: body.tran_id,
      currency: body.currency,
      success_url: `${BACKEND_BASE_API_URL}/api/v1/payment/success`,
      fail_url: `${BACKEND_BASE_API_URL}/api/v1/payment/failed`,
      cancel_url: `${BACKEND_BASE_API_URL}/api/v1/payment/cancle`,
      desc: body.desc,
      type: "json",
    },
  });

  return result;
};

exports.createPayment = catchAsync(async (req, res, next) => {
  const { discountType, discountCode, package_id, variation_id } = req.body;
  const tran_id = crypto.randomBytes(3 * 4).toString("base64");
  const details = await prisma.packages.findUnique({
    where: {
      id: package_id,
    },

    include: {
      variations: {
        where: {
          id: variation_id,
        },
        select: {
          status: true,
          bdt: true,
          discount_bdt: true,
        },
      },
    },
  });

  if (details.status === false || details.variations[0].status === false) {
    return next(
      new AppError(`Package or variation might not active right now`)
    );
  }

  const calAmountAfterVariationDiscount =
    details.variations[0].bdt - details.variations[0].discount_bdt;

  let codeDiscountAmount;

  if (discountType && discountType === "promo_code") {
    const discountAmount = await prisma.promo_code.findMany({
      where: {
        code: discountCode,
      },
      select: {
        discount_type: true,
        discount_amount: true,
      },
    });

    if (discountAmount[0].discount_type === "percentage") {
      codeDiscountAmount = (discountAmount / 100) * details.variations[0].bdt;
    } else {
      codeDiscountAmount = discountAmount[0].discount_amount;
    }
  }

  const finalAmount = calAmountAfterVariationDiscount - codeDiscountAmount;
  const totalDiscountAmount =
    details.variations[0].discount_bdt + codeDiscountAmount;

  const packageAndVariationId = package_id + ":" + variation_id;

  const data = {
    cus_name: req.body.cus_name,
    cus_email: req.body.cus_email,
    cus_phone: req.body.cus_phone,
    cus_add1: req.body.cus_add1,
    cus_add2: req.body.cus_add2,
    cus_city: req.body.cus_city,
    cus_country: req.body.cus_country,
    tran_id,
    app_uid,
    amount: finalAmount,
    packageAndVariationId,
    discountAmount: totalDiscountAmount,
    currency: req.body.currency,
    desc: req.body.desc,
  };

  const paymentUrl = await aamarPay(data);

  if (!paymentUrl.data.result) {
    return next(new AppError(`Can't create payment url`, 404));
  }
  res.status(200).json({
    status: "success",
    message: "Payment Url Created Successfully",
    url: paymentUrl.data.payment_url,
  });
});

exports.paymentSuccess = catchAsync(async (req, res, next) => {
  console.log(req.body);
  // const data = {
  //   package_id: req.body.opt_a,
  //   variation_id: req.body.opt_b,
  //   app_uid,

  //   currency: req.body.currency_merchant,
  //   discount_amount: req.body.opt_c,
  //   amount: req.body.acmount,

  //   service_charge: req.body.pg_service_charge_bdt,
  //   card_number: req.body.card_number,
  //   cus_phone: req.body.cus_phone,
  //   pg_taxnid: req.body.pg_txnid,
  //   mer_txnid: req.body.mer_txnid,
  //   store_amount: store_amount,
  //   bank_txn: req.body.bank_txn,
  //   card_type: req.body.card_type,
  // };
  res.status(200).json(req.body);
});

exports.paymentFailed = (req, res) => {
  const html = pug.render("payment failed");
  res.send(html);
};
