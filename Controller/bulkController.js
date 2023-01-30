const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");
const { dateCalculator } = require("../Utils/dateCalculator");
const prisma = require("../client");
const bcrypt = require("bcrypt");
exports.bulkCreation = catchAsync(async (req, res, next) => {
  const { first_name, last_name, email, password, phone, package_id } =
    req.body;

  const package = await prisma.packages.findUnique({
    where: {
      id: package_id,
    },
  });

  if (!package) {
    return next(
      new AppError(`Package not found with that id :${package_id}`, 404)
    );
  }

  if (package.status === false) {
    return next(new AppError(`Package might not active right now`));
  }

  let expiry_date = dateCalculator(package.expiration);
  expiry_date = new Date(expiry_date);
  const data = {
    user_id: "user",
    package_id: Number(package_id),
    expiry_date,
    currency: "BDT",
    discount_amount: parseFloat(00),
    amount: parseFloat(00),

    service_charge: "b2b",
    card_number: "b2b",
    cus_phone: phone,
    pg_taxnid: "b2b",
    mer_txnid: "b2b",
    store_amount: "b2b",
    bank_txn: "b2b",
    card_type: "b2b",
    b2b: req.user.first_name,
  };

  const isExisted = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (isExisted) {
    const isSubscribed = await prisma.purchase_info.findFirst({
      where: {
        user_id: Number(isExisted.id),
      },
    });

    if (isSubscribed) {
      return next(
        new AppError(`This ${email} is already subscibed! Please login`, 409)
      );
    } else {
      data.user_id = isExisted.id;
      const newSubscriber = await prisma.purchase_info.create({
        data: data,
      });

      return res.status(200).json({
        status: "success",
        message: `New User Subscribed Successfully`,
        data: newSubscriber,
      });
    }
  } else {
    const salt = await bcrypt.genSalt(10);

    const hash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
        password: hash,
        phone,
      },
    });

    data.user_id = user.id;

    const newSubscriber = await prisma.purchase_info.create({
      data: data,
    });

    return res.status(200).json({
      status: "success",
      message: `New User Subscribed Successfully`,
      data: newSubscriber,
    });
  }
});

exports.getB2bUsers = catchAsync(async (req, res, next) => {
  const users = await prisma.purchase_info.findMany({
    where: {
      b2b: req.user.first_name,
    },
    select: {
      b2b: true,
      expiry_date: true,
      user: {
        select: {
          first_name: true,
          last_name: true,
          phone: true,
          email: true,
        },
      },
    },
  });

  if (users.length === 0) {
    return next(
      new AppError(
        `No Users found with this ${req.user.first_name} b2b account`,
        404
      )
    );
  }

  res.status(200).json({
    status: "success",
    message: `Total ${users.length} found users with this ${req.user.first_name} user`,
    data: users,
  });
});

exports.getAllB2bUsers = catchAsync(async (req, res, next) => {
  const { name } = req.query;
  const users = await prisma.purchase_info.findMany({
    where: {
      mer_txnid: "b2b",
      b2b: name,
    },
    select: {
      b2b: true,
      expiry_date: true,
      user: {
        select: {
          first_name: true,
          last_name: true,
          phone: true,
          email: true,
        },
      },
    },
  });

  if (users.length === 0) {
    return next(new AppError(`No b2b input users found right now`, 404));
  }

  res.status(200).json({
    status: "success",
    message: `Total ${users.length} users found successfully`,
    data: users,
  });
});
