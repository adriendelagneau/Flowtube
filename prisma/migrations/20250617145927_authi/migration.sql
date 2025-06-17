/*
  Warnings:

  - You are about to drop the column `createdAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `img` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "channel" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "createdAt",
DROP COLUMN "img",
ADD COLUMN     "image" TEXT;
