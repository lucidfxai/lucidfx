// services/index.ts
import { S3Service } from './s3_service';
import { FilesService } from './files_service';
import { UsersService } from './users_service';
import { ClerkService } from './clerk_service';

export const s3Service = new S3Service();
export const filesService = new FilesService();
export const clerkService = new ClerkService();
export const usersService = new UsersService(filesService, clerkService, s3Service);
