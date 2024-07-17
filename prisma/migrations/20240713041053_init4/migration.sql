/*
  Warnings:

  - You are about to alter the column `order_status` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(4))` to `Enum(EnumId(4))`.
  - Added the required column `service_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orders` ADD COLUMN `payment_image` VARCHAR(191) NULL,
    ADD COLUMN `service_id` VARCHAR(191) NOT NULL,
    MODIFY `order_status` ENUM('UNPAID', 'ONCHECK', 'INPROGRESS', 'FINISH') NOT NULL DEFAULT 'UNPAID';

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
