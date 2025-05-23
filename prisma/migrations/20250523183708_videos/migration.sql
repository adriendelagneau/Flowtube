-- CreateEnum
CREATE TYPE "VideoVisibility" AS ENUM ('private', 'public');

-- CreateTable
CREATE TABLE "video" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "muxStatus" TEXT,
    "muxAssetId" TEXT,
    "muxUploadId" TEXT,
    "muxPlaybackId" TEXT,
    "muxTrackId" TEXT,
    "muxTrackStatus" TEXT,
    "thumbnailUrl" TEXT,
    "thumbnailKey" TEXT,
    "previewUrl" TEXT,
    "previewKey" TEXT,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "visibility" "VideoVisibility" NOT NULL DEFAULT 'private',
    "userId" TEXT NOT NULL,
    "categoryId" TEXT,
    "videoViews" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "video_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "video_muxAssetId_key" ON "video"("muxAssetId");

-- CreateIndex
CREATE UNIQUE INDEX "video_muxUploadId_key" ON "video"("muxUploadId");

-- CreateIndex
CREATE UNIQUE INDEX "video_muxPlaybackId_key" ON "video"("muxPlaybackId");

-- CreateIndex
CREATE UNIQUE INDEX "video_muxTrackId_key" ON "video"("muxTrackId");

-- AddForeignKey
ALTER TABLE "video" ADD CONSTRAINT "video_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video" ADD CONSTRAINT "video_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
