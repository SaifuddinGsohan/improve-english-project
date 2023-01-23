-- CreateEnum
CREATE TYPE "role" AS ENUM ('user', 'moderator', 'admin');

-- CreateEnum
CREATE TYPE "currencyType" AS ENUM ('BDT', 'USD');

-- CreateEnum
CREATE TYPE "discountType" AS ENUM ('flat', 'percentage');

-- CreateEnum
CREATE TYPE "level" AS ENUM ('beginner', 'intermediate', 'advanced');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" "role" NOT NULL DEFAULT 'user',
    "password" TEXT NOT NULL,
    "email_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "currency" "currencyType" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promo_code" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "discount_type" "discountType" NOT NULL,
    "discount_amount" INTEGER NOT NULL,
    "use_count" INTEGER NOT NULL DEFAULT 0,
    "affiliate_amount" INTEGER NOT NULL DEFAULT 0,
    "total_affiliate_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promo_code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupon_code" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "discount_type" "discountType" NOT NULL,
    "discount_amount" INTEGER NOT NULL,
    "use_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coupon_code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_info" (
    "id" SERIAL NOT NULL,
    "package_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "currency" "currencyType" NOT NULL,
    "discount_amount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "amount" DOUBLE PRECISION NOT NULL,
    "service_charge" TEXT NOT NULL,
    "card_number" TEXT NOT NULL,
    "cus_phone" TEXT NOT NULL,
    "pg_taxnid" TEXT NOT NULL,
    "mer_txnid" TEXT NOT NULL,
    "store_amount" TEXT NOT NULL,
    "bank_txn" TEXT NOT NULL,
    "card_type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passage" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "passage" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "level" "level" NOT NULL,
    "creator_id" INTEGER NOT NULL,
    "created_by" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "passage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "opt_a" TEXT NOT NULL,
    "opt_b" TEXT NOT NULL,
    "opt_c" TEXT NOT NULL,
    "opt_d" TEXT NOT NULL,
    "passage_id" INTEGER NOT NULL,
    "categories_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_answer" (
    "id" SERIAL NOT NULL,
    "quiz_id" INTEGER NOT NULL,
    "opt_a" BOOLEAN NOT NULL DEFAULT false,
    "opt_b" BOOLEAN NOT NULL DEFAULT false,
    "opt_c" BOOLEAN NOT NULL DEFAULT false,
    "opt_d" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quiz_answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_id_email_key" ON "user"("id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "user_id_first_name_key" ON "user"("id", "first_name");

-- CreateIndex
CREATE UNIQUE INDEX "packages_id_key" ON "packages"("id");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_answer_quiz_id_key" ON "quiz_answer"("quiz_id");

-- AddForeignKey
ALTER TABLE "purchase_info" ADD CONSTRAINT "purchase_info_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_info" ADD CONSTRAINT "purchase_info_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passage" ADD CONSTRAINT "passage_creator_id_created_by_fkey" FOREIGN KEY ("creator_id", "created_by") REFERENCES "user"("id", "first_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_passage_id_fkey" FOREIGN KEY ("passage_id") REFERENCES "passage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_categories_id_fkey" FOREIGN KEY ("categories_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_answer" ADD CONSTRAINT "quiz_answer_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
