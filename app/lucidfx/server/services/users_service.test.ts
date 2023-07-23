import { S3Service } from './s3_service';
import { UsersService } from './users_service';
import { FilesService } from './files_service';
import getDb from '../db/connection';
import { User, users } from '../db/schema/users';
import clerk from '@clerk/clerk-sdk-node';
import { eq } from 'drizzle-orm';
import { ClerkService } from './clerk_service';

jest.mock('../db/connection');

jest.mock('@clerk/clerk-sdk-node', () => ({
  users: {
    deleteUser: jest.fn(),
  },
}));

jest.mock('./files_service');
jest.mock('./s3_service');

describe('UsersService tests', () => {
  let usersService: UsersService;
  let filesService: FilesService;
  let s3Service: S3Service;
  let clerkService: ClerkService;

  // Mock database connection
  const mockDb = {
    delete: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    values: jest.fn(),
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
  };

  (getDb as jest.MockedFunction<typeof getDb>).mockReturnValue(mockDb as any);

  beforeEach(() => {
    jest.clearAllMocks();
    (getDb as jest.Mock).mockReturnValue(mockDb);
    filesService = { 
      deleteAllFilesByUserId: jest.fn().mockResolvedValue('User deleted from files'),
      getFilesByUserId: jest.fn().mockResolvedValue([
        { unique_key: 'file1', /* Other properties of the File object */ },
        { unique_key: 'file2', /* Other properties of the File object */ },
        // Add as many mock files as needed
      ]), 
    } as any;
    s3Service = { deleteMultipleObjects: jest.fn().mockResolvedValue('Files deleted from S3') } as any;
    clerkService = { deleteUser: jest.fn().mockResolvedValue('User deleted from clerk') } as any;
    usersService = new UsersService(filesService, clerkService, s3Service);
  });


  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should insert user correctly', async () => {
    const user: User = { id: 1, user_id: 'test_user' };
    await usersService.insertUser(user);
    expect(mockDb.insert).toHaveBeenCalledWith(users);
    expect(mockDb.insert().values).toHaveBeenCalledWith(user);
  });

   it('should deleteUserFromSystem correctly', async () => {
    const id = 'test_user';
    const result = await usersService.deleteUserFromSystem(id);

    expect(result).toEqual('User deleted');
    expect(clerkService.deleteUser).toHaveBeenCalledWith(id);
    const files = await filesService.getFilesByUserId(id);
    expect(s3Service.deleteMultipleObjects).toHaveBeenCalledWith(files);
    expect(filesService.deleteAllFilesByUserId).toHaveBeenCalledWith(id);
    expect(mockDb.delete).toHaveBeenCalledWith(users);
    expect(mockDb.delete().where).toHaveBeenCalledWith(eq(users.user_id, id));
  });


  // it('should deleteUsersInUsersTable correctly', async () => {
  //   const id = 'test_user';
  //   (mockDb.delete().where as jest.Mock).mockResolvedValue('User deleted from database');
  //   const result = await usersService.deleteUserInUsersTable(id);
  //
  //   expect(result).toEqual('User deleted from database');
  //   expect(mockDb.delete).toHaveBeenCalledWith(users);
  //   expect(mockDb.delete().where).toHaveBeenCalledWith(eq(users.user_id, id));
  // });


  it('should fetch users correctly', async () => {
    await usersService.fetchUsers();
    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.select().from).toHaveBeenCalledWith(users);
  });
});

