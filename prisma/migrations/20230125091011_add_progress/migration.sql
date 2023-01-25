/*
  Warnings:

  - You are about to drop the column `categories_id` on the `quiz` table. All the data in the column will be lost.
  - You are about to drop the column `opt_a` on the `quiz_answer` table. All the data in the column will be lost.
  - You are about to drop the column `opt_b` on the `quiz_answer` table. All the data in the column will be lost.
  - You are about to drop the column `opt_c` on the `quiz_answer` table. All the data in the column will be lost.
  - You are about to drop the column `opt_d` on the `quiz_answer` table. All the data in the column will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[lession_no]` on the table `passage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expiration` to the `packages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lession_no` to the `passage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiry_date` to the `purchase_info` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `quiz` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "quizType" AS ENUM ('lexical', 'comprehensive');

-- DropForeignKey
ALTER TABLE "quiz" DROP CONSTRAINT "quiz_categories_id_fkey";

-- DropForeignKey
ALTER TABLE "quiz" DROP CONSTRAINT "quiz_passage_id_fkey";

-- DropForeignKey
ALTER TABLE "quiz_answer" DROP CONSTRAINT "quiz_answer_quiz_id_fkey";

-- AlterTable
ALTER TABLE "packages" ADD COLUMN     "expiration" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "passage" ADD COLUMN     "lession_no" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "purchase_info" ADD COLUMN     "expiry_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "quiz" DROP COLUMN "categories_id",
ADD COLUMN     "type" "quizType" NOT NULL;

-- AlterTable
ALTER TABLE "quiz_answer" DROP COLUMN "opt_a",
DROP COLUMN "opt_b",
DROP COLUMN "opt_c",
DROP COLUMN "opt_d",
ADD COLUMN     "ans_a" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ans_b" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ans_c" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ans_d" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "categories";

-- CreateTable
CREATE TABLE "progress_report" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "wpm" INTEGER NOT NULL,
    "lexical" INTEGER NOT NULL,
    "comprehension" INTEGER NOT NULL,
    "passage_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "progress_report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "progress_report_passage_id_key" ON "progress_report"("passage_id");

-- CreateIndex
CREATE UNIQUE INDEX "passage_lession_no_key" ON "passage"("lession_no");

-- AddForeignKey
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_passage_id_fkey" FOREIGN KEY ("passage_id") REFERENCES "passage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_answer" ADD CONSTRAINT "quiz_answer_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_report" ADD CONSTRAINT "progress_report_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_report" ADD CONSTRAINT "progress_report_passage_id_fkey" FOREIGN KEY ("passage_id") REFERENCES "passage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
