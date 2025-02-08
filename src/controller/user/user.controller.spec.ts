import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../../service/user/user.service';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  // Mock data
  const mockUser = {
    id: '123',
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedPassword',
    created_at: new Date().toISOString(),
  };

  const mockCreateUserDto = {
    email: 'test@example.com',
    username: 'testuser',
    password: 'password123',
  };

  const mockUpdateUserDto = {
    username: 'newUsername',
  };

  // Create mock service
  const mockUserService = {
    create: jest.fn(),
    findall: jest.fn(),
    findone: jest.fn(),
    upDateUser: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      mockUserService.create.mockResolvedValue(mockUser);

      const result = await controller.create(mockCreateUserDto);

      expect(userService.create).toHaveBeenCalledWith(mockCreateUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if user creation fails', async () => {
      const error = new Error('Creation failed');
      mockUserService.create.mockRejectedValue(error);

      await expect(controller.create(mockCreateUserDto)).rejects.toThrow(error);
      expect(userService.create).toHaveBeenCalledWith(mockCreateUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      mockUserService.findall.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(userService.findall).toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it('should throw an error if finding all users fails', async () => {
      const error = new Error('Find all failed');
      mockUserService.findall.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow(error);
      expect(userService.findall).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      mockUserService.findone.mockResolvedValue(mockUser);

      const result = await controller.findOne('123');

      expect(userService.findone).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if finding one user fails', async () => {
      const error = new Error('Find one failed');
      mockUserService.findone.mockRejectedValue(error);

      await expect(controller.findOne('123')).rejects.toThrow(error);
      expect(userService.findone).toHaveBeenCalledWith('123');
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updatedUser = { ...mockUser, username: 'newUsername' };
      mockUserService.upDateUser.mockResolvedValue(updatedUser);

      const result = await controller.update('123', mockUpdateUserDto);

      expect(userService.upDateUser).toHaveBeenCalledWith(
        mockUpdateUserDto,
        '123',
      );
      expect(result).toEqual(updatedUser);
    });

    it('should throw an error if updating user fails', async () => {
      const error = new Error('Update failed');
      mockUserService.upDateUser.mockRejectedValue(error);

      await expect(controller.update('123', mockUpdateUserDto)).rejects.toThrow(
        error,
      );
      expect(userService.upDateUser).toHaveBeenCalledWith(
        mockUpdateUserDto,
        '123',
      );
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      mockUserService.delete.mockResolvedValue({ message: 'User deleted' });

      const result = await controller.delete('123');

      expect(userService.delete).toHaveBeenCalledWith('123');
      expect(result).toEqual({ message: 'User deleted' });
    });

    it('should throw an error if deleting user fails', async () => {
      const error = new Error('Delete failed');
      mockUserService.delete.mockRejectedValue(error);

      await expect(controller.delete('123')).rejects.toThrow(error);
      expect(userService.delete).toHaveBeenCalledWith('123');
    });
  });
});
