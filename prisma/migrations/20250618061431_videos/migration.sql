-- CreateEnum
CREATE TYPE "VideoVisibility" AS ENUM ('private', 'public');

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

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
    "channelId" TEXT NOT NULL,
    "categoryId" TEXT,
    "videoViews" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "like" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dislike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dislike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "category_slug_key" ON "category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "video_muxAssetId_key" ON "video"("muxAssetId");

-- CreateIndex
CREATE UNIQUE INDEX "video_muxUploadId_key" ON "video"("muxUploadId");

-- CreateIndex
CREATE UNIQUE INDEX "video_muxPlaybackId_key" ON "video"("muxPlaybackId");

-- CreateIndex
CREATE UNIQUE INDEX "video_muxTrackId_key" ON "video"("muxTrackId");

-- CreateIndex
CREATE UNIQUE INDEX "like_userId_videoId_key" ON "like"("userId", "videoId");

-- CreateIndex
CREATE UNIQUE INDEX "dislike_userId_videoId_key" ON "dislike"("userId", "videoId");

-- AddForeignKey
ALTER TABLE "video" ADD CONSTRAINT "video_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video" ADD CONSTRAINT "video_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like" ADD CONSTRAINT "like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like" ADD CONSTRAINT "like_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dislike" ADD CONSTRAINT "dislike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dislike" ADD CONSTRAINT "dislike_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
