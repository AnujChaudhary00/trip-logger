-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "startLocation" TEXT NOT NULL,
    "endLocation" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "distanceUnit" TEXT NOT NULL,
    "notes" TEXT,
    "isMemorable" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Trip_deviceId_createdAt_idx" ON "Trip"("deviceId", "createdAt" DESC);
