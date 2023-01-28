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
const { dateCalculator } = require("../Utils/dateCalculator");
const { date } = require("joi");

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
      opt_a: body.user_id,
      opt_b: body.packageAndExpiryDate,
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
  const { discountType, discountCode, package_id } = req.body;
  const package = await prisma.packages.findUnique({
    where: {
      id: package_id,
    },
  });

  if (!package) {
    return next(
      new AppError(`Package not found with that id :${package_id}`, 405)
    );
  }

  if (package.status === false) {
    return next(new AppError(`Package might not active right now`));
  }

  const expiry_date = dateCalculator(package.expiration);

  const packageAndExpiryDate = package_id + ":" + expiry_date;

  const { id, first_name, last_name, email, phone } = req.user;

  const cus_name = first_name + " " + last_name;

  const tran_id = crypto.randomBytes(3 * 4).toString("base64");

  const calAmountAfterPackageDiscount = package.price - package.discount;

  const data = {
    cus_name,
    cus_email: email,
    cus_phone: phone,
    cus_add1: req.body.cus_add1,
    cus_add2: req.body.cus_add2,
    cus_city: req.body.cus_city,
    cus_country: req.body.cus_country,
    tran_id,
    user_id: id,
    amount: calAmountAfterPackageDiscount,
    packageAndExpiryDate,
    discountAmount: package.discount,
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
        (discountAmount[0].discount_amount / 100) * package.price;
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
        (discountAmount[0].discount_amount / 100) * package.price;
    } else {
      codeDiscountAmount = discountAmount[0].discount_amount;
    }
  }

  if (codeDiscountAmount) {
    finalAmountAfterCodeDiscountCal =
      calAmountAfterPackageDiscount - codeDiscountAmount;
    totalDiscountAmount = package.discount + codeDiscountAmount;

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

  console.log(req.body);

  const packageIdAndExpiryDate = opt_b.split(":");
  const package_id = packageIdAndExpiryDate[0];
  //const expiry_date = packageIdAndExpiryDate[1];

  const expiry_date = new Date(packageIdAndExpiryDate[1]);

  const data = {
    user_id: Number(opt_a),
    package_id: Number(package_id),
    expiry_date,
    currency: req.body.currency_merchant,
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

  res.status(200).json("payment status updated");
});

exports.paymentFailed = (req, res) => {
  const html = pug.render("payment failed");
  res.send(html);
};
