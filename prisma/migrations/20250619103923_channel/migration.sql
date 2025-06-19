/*
  Warnings:

  - Made the column `slug` on table `channel` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "channel" ALTER COLUMN "slug" SET NOT NULL;
