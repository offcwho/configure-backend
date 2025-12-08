-- DropForeignKey
ALTER TABLE `FeedbackToUser` DROP FOREIGN KEY `FeedbackToUser_feedbackId_fkey`;

-- DropIndex
DROP INDEX `FeedbackToUser_feedbackId_fkey` ON `FeedbackToUser`;

-- AddForeignKey
ALTER TABLE `FeedbackToUser` ADD CONSTRAINT `FeedbackToUser_feedbackId_fkey` FOREIGN KEY (`feedbackId`) REFERENCES `Feedback`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
