/*
  Warnings:

  - A unique constraint covering the columns `[assetId,employeeId]` on the table `AssetAssignment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Employee" DROP CONSTRAINT "Employee_companyId_fkey";

-- DropIndex
DROP INDEX "public"."AssetAssignment_assetId_key";

-- DropIndex
DROP INDEX "public"."Company_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "AssetAssignment_assetId_employeeId_key" ON "AssetAssignment"("assetId", "employeeId");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
