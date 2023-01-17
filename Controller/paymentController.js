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

  const { id } = req.user;

  const tran_id = crypto.randomBytes(3 * 4).toString("base64");
  const packageAndVariationId = package_id + ":" + variation_id;

  const calAmountAfterVariationDiscount =
    details.variations[0].bdt - details.variations[0].discount_bdt;

  const data = {
    cus_name: req.body.cus_name,
    cus_email: req.body.cus_email,
    cus_phone: req.body.cus_phone,
    cus_add1: req.body.cus_add1,
    cus_add2: req.body.cus_add2,
    cus_city: req.body.cus_city,
    cus_country: req.body.cus_country,
    tran_id,
    app_uid: id,
    amount: calAmountAfterVariationDiscount,
    packageAndVariationId,
    discountAmount: details.variations[0].discount_bdt,
    currency: req.body.currency,
    desc: req.body.desc,
  };

  let codeDiscountAmount;
  let finalAmountAfterCodeDiscountCal;
  let totalDiscountAmount;

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
      codeDiscountAmount =
        (discountAmount[0].discount_amount / 100) * details.variations[0].bdt;
    } else {
      codeDiscountAmount = discountAmount[0].discount_amount;
    }
  } else if (discountType && discountType === "coupon_code") {
    const discountAmount = await prisma.coupon_code.findMany({
      where: {
        code: discountCode,
      },
      select: {
        discount_type: true,
        discount_amount: true,
      },
    });

    if (discountAmount[0].discount_type === "percentage") {
      codeDiscountAmount =
        (discountAmount[0].discount_amount / 100) * details.variations[0].bdt;
    } else {
      codeDiscountAmount = discountAmount[0].discount_amount;
    }
  }

  if (codeDiscountAmount) {
    finalAmountAfterCodeDiscountCal =
      calAmountAfterVariationDiscount - codeDiscountAmount;
    totalDiscountAmount =
      details.variations[0].discount_bdt + codeDiscountAmount;

    data.amount = finalAmountAfterCodeDiscountCal;
    data.discountAmount = totalDiscountAmount;
  }

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
  const { opt_a, opt_b, opt_c } = req.body;
  const packageAndVariationArray = opt_b.split(":");
  const package_id = packageAndVariationArray[0];
  const variation_id = packageAndVariationArray[1];
  const data = {
    app_uid: Number(opt_a),
    package_id: Number(package_id),
    variation_id: Number(variation_id),

    currency: "bdt",
    discount_amount: parseFloat(opt_c),
    amount: parseFloat(req.body.amount),

    service_charge: req.body.pg_service_charge_bdt,
    card_number: req.body.card_number,
    cus_phone: req.body.cus_phone,
    pg_taxnid: req.body.pg_txnid,
    mer_txnid: req.body.mer_txnid,
    store_amount: req.body.store_amount,
    bank_txn: req.body.bank_txn,
    card_type: "bKash-bKash",
  };

  await prisma.purchase_info.create({
    data: data,
  });

  await prisma.app_users.update({
    where: {
      id: Number(opt_a),
    },
    data: {
      payment_status: true,
    },
  });

  res.status(200).json("payment status updated");
});

exports.paymentFailed = (req, res) => {
  const html = pug.render("payment failed");
  res.send(html);
};
