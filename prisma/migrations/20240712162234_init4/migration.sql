/*
  Warnings:

  - Added the required column `description` to the `services` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ranks` DROP FOREIGN KEY `ranks_service_id_fkey`;

-- AlterTable
ALTER TABLE `services` ADD COLUMN `description` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `ranks` ADD CONSTRAINT `ranks_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
