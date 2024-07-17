/*
  Warnings:

  - You are about to drop the column `service_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `service_id` on the `ranks` table. All the data in the column will be lost.
  - You are about to drop the `services` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_service_id_fkey`;

-- DropForeignKey
ALTER TABLE `ranks` DROP FOREIGN KEY `ranks_service_id_fkey`;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `service_id`;

-- AlterTable
ALTER TABLE `ranks` DROP COLUMN `service_id`;

-- DropTable
DROP TABLE `services`;
