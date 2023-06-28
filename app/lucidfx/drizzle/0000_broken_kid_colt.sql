CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`full_name` varchar(256),
	`other` varchar(256));
--> statement-breakpoint
CREATE INDEX `name_idx` ON `users` (`full_name`);