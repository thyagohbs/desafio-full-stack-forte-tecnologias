/*
  Warnings:

  - The values [Disponivel,Em_Uso,Em_Manutencao] on the enum `AssetStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [Notebook,Monitor,Celular] on the enum `AssetType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[assetId]` on the table `AssetAssignment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AssetStatus_new" AS ENUM ('DISPONIVEL', 'EM_USO', 'EM_MANUTENCAO');
ALTER TABLE "Asset" ALTER COLUMN "status" TYPE "AssetStatus_new" USING ("status"::text::"AssetStatus_new");
ALTER TYPE "AssetStatus" RENAME TO "AssetStatus_old";
ALTER TYPE "AssetStatus_new" RENAME TO "AssetStatus";
DROP TYPE "public"."AssetStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "AssetType_new" AS ENUM ('NOTEBOOK', 'MONITOR', 'CELULAR');
ALTER TABLE "Asset" ALTER COLUMN "type" TYPE "AssetType_new" USING ("type"::text::"AssetType_new");
ALTER TYPE "AssetType" RENAME TO "AssetType_old";
ALTER TYPE "AssetType_new" RENAME TO "AssetType";
DROP TYPE "public"."AssetType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Employee" DROP CONSTRAINT "Employee_companyId_fkey";

-- DropIndex
DROP INDEX "public"."AssetAssignment_assetId_employeeId_key";

-- AlterTable
ALTER TABLE "Asset" ALTER COLUMN "status" SET DEFAULT 'DISPONIVEL';

-- CreateIndex
CREATE UNIQUE INDEX "AssetAssignment_assetId_key" ON "AssetAssignment"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
