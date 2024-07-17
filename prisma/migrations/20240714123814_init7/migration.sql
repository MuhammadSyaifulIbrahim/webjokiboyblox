/*
  Warnings:

  - You are about to alter the column `order_status` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(4))` to `Enum(EnumId(4))`.

*/
-- AlterTable
ALTER TABLE `orders` MODIFY `order_status` ENUM('PENDING', 'SELESAI') NOT NULL DEFAULT 'PENDING';
