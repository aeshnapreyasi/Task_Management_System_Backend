/*
  Warnings:

  - You are about to drop the column `completeAt` on the `Task` table. All the data in the column will be lost.
  - Made the column `createdAt` on table `Task` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "completeAt",
ADD COLUMN     "completedAt" TIMESTAMP(3),
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;
