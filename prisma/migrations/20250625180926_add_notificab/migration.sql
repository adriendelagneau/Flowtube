-- CreateEnum
CREATE TYPE "NotifyLevel" AS ENUM ('ALL', 'PERSONALIZED', 'NONE');

-- DropIndex
DROP INDEX "Subscription_userId_channelId_key";

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "notifyLevel" "NotifyLevel" NOT NULL DEFAULT 'ALL';
