import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { createClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';

// Mock the external dependencies
jest.mock('@supabase/supabase-js');
jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let configService: ConfigService;
  let mockSupabaseClient: any;

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

  // const mockPost = {
  //   id: '1',
  //   title: 'Test Post',
  //   content: 'Test Content',
  //   user_id: '123',
  //   category: { id: '1', name: 'Test Category' },
  //   user: { id: '123', username: 'testuser' },
  //   comments: { count: 5 },
  // };

  beforeEach(async () => {
    // Mock ConfigService
    const mockConfigService = {
      get: jest.fn((key: string) => {
        const config = {
          SUPABASE_URL: 'http://localhost',
          SUPABASE_KEY: 'test-key',
          JWT_SECRET: 'test-secret',
        };
        return config[key];
      }),
    };

    // Mock Supabase client responses
    mockSupabaseClient = {
      from: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      order: jest.fn().mockReturnThis(),
    };

    (createClient as jest.Mock).mockReturnValue(mockSupabaseClient);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should throw error if environment variables are missing', () => {
      jest.spyOn(configService, 'get').mockReturnValue(undefined);
      expect(() => new UserService(configService)).toThrow();
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      mockSupabaseClient.single.mockResolvedValue({
        data: mockUser,
        error: null,
      });

      const result = await service.create(mockCreateUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(mockCreateUserDto.password, 10);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('users');
      expect(mockSupabaseClient.insert).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should throw error if creation fails', async () => {
      mockSupabaseClient.single.mockResolvedValue({
        data: null,
        error: new Error('Creation failed'),
      });

      await expect(service.create(mockCreateUserDto)).rejects.toThrow();
    });
  });

  describe('findone', () => {
    it('should find a user by id', async () => {
      mockSupabaseClient.single.mockResolvedValue({
        data: mockUser,
        error: null,
      });

      const result = await service.findone('123');

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('users');
      expect(mockSupabaseClient.select).toHaveBeenCalledWith(
        'id, email, username, created_at',
      );
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', '123');
      expect(result).toEqual(mockUser);
    });
  });

  describe('findall', () => {
    it('should return all users', async () => {
      mockSupabaseClient.select.mockResolvedValue({
        data: [mockUser],
        error: null,
      });

      const result = await service.findall();

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('users');
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
      expect(result).toEqual([mockUser]);
    });
  });

  describe('updateUser', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should update a user', async () => {
      const updateUserDto = {
        email: 'updated@example.com',
        username: 'Updated User',
      };
      const updatedUser = {
        email: 'updated@example.com',
        username: 'Updated User',
      };

      mockSupabaseClient.single.mockResolvedValue({
        data: updatedUser,
        error: null,
      });

      const result = await service.upDateUser(updateUserDto, '123');

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('users');
      expect(mockSupabaseClient.update).toHaveBeenCalledWith({
        email: 'updated@example.com',
        username: 'Updated User',
      });
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', '123');
      expect(mockSupabaseClient.single).toHaveBeenCalled();
      expect(result).toEqual(updatedUser);
    });
  });
  describe('delete', () => {
    it('should delete a user', async () => {
      mockSupabaseClient.from.mockReturnThis();
      mockSupabaseClient.eq.mockReturnThis();
      mockSupabaseClient.delete.mockReturnThis();
      mockSupabaseClient.single.mockResolvedValue({
        data: mockUser,
        error: null,
      });

      const result = await service.delete('123');

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('users');
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', '123');
      expect(mockSupabaseClient.delete).toHaveBeenCalled();
      expect(mockSupabaseClient.single).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  // describe('findUserPosts', () => {
  //   it('should return user posts', async () => {
  //     mockSupabaseClient.select.mockResolvedValue({
  //       data: [mockPost],
  //       error: null,
  //     });

  //     const result = await service.findUserPosts('123');

  //     expect(mockSupabaseClient.from).toHaveBeenCalledWith('posts');
  //     expect(mockSupabaseClient.select).toHaveBeenCalled();
  //     expect(mockSupabaseClient.eq).toHaveBeenCalledWith('user_id', '123');
  //     expect(result).toEqual([mockPost]);
  //   });
  // });
});
