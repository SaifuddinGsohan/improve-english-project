/*
  Warnings:

  - You are about to drop the column `passage_id` on the `progress_report` table. All the data in the column will be lost.
  - You are about to drop the column `passage_id` on the `quiz` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[lession_no]` on the table `progress_report` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lession_no` to the `progress_report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lession_no` to the `quiz` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "progress_report" DROP CONSTRAINT "progress_report_passage_id_fkey";

-- DropForeignKey
ALTER TABLE "quiz" DROP CONSTRAINT "quiz_passage_id_fkey";

-- DropIndex
DROP INDEX "progress_report_passage_id_key";

-- AlterTable
ALTER TABLE "progress_report" DROP COLUMN "passage_id",
ADD COLUMN     "lession_no" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "quiz" DROP COLUMN "passage_id",
ADD COLUMN     "lession_no" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "progress_report_lession_no_key" ON "progress_report"("lession_no");

-- AddForeignKey
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_lession_no_fkey" FOREIGN KEY ("lession_no") REFERENCES "passage"("lession_no") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_report" ADD CONSTRAINT "progress_report_lession_no_fkey" FOREIGN KEY ("lession_no") REFERENCES "passage"("lession_no") ON DELETE RESTRICT ON UPDATE CASCADE;
