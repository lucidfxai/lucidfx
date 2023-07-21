import { S3Service } from './s3_service';
import { UsersService } from './users_service';
import { FilesService } from './files_service';
import getDb from '../db/connection';
import { User, users } from '../db/schema/users';
import clerk from '@clerk/clerk-sdk-node';
import { eq } from 'drizzle-orm';

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
    s3Service = new S3Service();
    filesService = new FilesService(s3Service);
    usersService = new UsersService(filesService);
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

  it('should delete user in db and clerk correctly', async () => {
    const id = 'test_user';
    await usersService.deleteUserInDbAndClerk(id);

    expect(clerk.users.deleteUser).toHaveBeenCalledWith(id);
    expect(filesService.deleteAllFilesByUserId).toHaveBeenCalledWith(id);
    expect(mockDb.delete).toHaveBeenCalledWith(users);
    expect(mockDb.delete().where).toHaveBeenCalledWith(eq(users.user_id, id));
  });

  it('should delete user from handler event after manual deletion in clerk web UI correctly', async () => {
    const id = 'test_user';
    await usersService.deleteUserInDatabaseAfterManualDeletionInClerkWebUi(id);

    expect(filesService.deleteAllFilesByUserId).toHaveBeenCalledWith(id);
    expect(mockDb.delete).toHaveBeenCalledWith(users);
    expect(mockDb.delete().where).toHaveBeenCalledWith(eq(users.user_id, id));
  });

  it('should fetch users correctly', async () => {
    await usersService.fetchUsers();

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.select().from).toHaveBeenCalledWith(users);
  });
});

