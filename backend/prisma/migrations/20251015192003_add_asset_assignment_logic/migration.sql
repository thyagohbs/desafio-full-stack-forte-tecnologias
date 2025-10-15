/*
  Warnings:

  - A unique constraint covering the columns `[assetId,unassignedAt]` on the table `AssetAssignment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."AssetAssignment" DROP CONSTRAINT "AssetAssignment_assetId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AssetAssignment" DROP CONSTRAINT "AssetAssignment_employeeId_fkey";

-- DropIndex
DROP INDEX "public"."AssetAssignment_assetId_employeeId_key";

-- CreateIndex
CREATE UNIQUE INDEX "AssetAssignment_assetId_unassignedAt_key" ON "AssetAssignment"("assetId", "unassignedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- AddForeignKey
ALTER TABLE "AssetAssignment" ADD CONSTRAINT "AssetAssignment_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetAssignment" ADD CONSTRAINT "AssetAssignment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
