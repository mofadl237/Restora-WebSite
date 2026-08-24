-- AlterTable
ALTER TABLE "plans" ADD COLUMN     "recommendedFor" TEXT[] DEFAULT ARRAY[]::TEXT[];
