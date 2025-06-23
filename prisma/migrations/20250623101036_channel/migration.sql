/*
  Warnings:

  - You are about to drop the column `slug` on the `channel` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "channel_slug_key";

-- AlterTable
ALTER TABLE "channel" DROP COLUMN "slug";
