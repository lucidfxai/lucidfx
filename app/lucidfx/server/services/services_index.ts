// services/index.ts
import { S3Service } from './s3_service';
import { FilesService } from './files_service';
import { UsersService } from './users_service';

export const s3Service = new S3Service();
export const filesService = new FilesService(s3Service);
export const usersService = new UsersService(filesService);
