import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PostService } from './post.service';
import { createClient } from '@supabase/supabase-js';

jest.mock('@supabase/supabase-js');

describe('PostService', () => {
  let service: PostService;
  let mockSupabaseClient: any;

  // Mock data
  const mockPost = {
    id: '1',
    title: 'Test Post',
    content: 'Test Content',
    user_id: 'user123',
    category_id: 'category123',
    created_at: new Date().toISOString(),
  };

  const mockCreatePostDto = {
    title: 'Test Post',
    content: 'Test Content',
    category_id: 'category123',
    tags: ['tag1', 'tag2'],
  };

  const mockUpdatePostDto = {
    title: 'Updated Post',
    content: 'Updated Content',
  };

  beforeEach(async () => {
    // Mock ConfigService
    const mockConfigService = {
      get: jest.fn((key: string) => {
        const config = {
          SUPABASE_URL: 'http://localhost',
          SUPABASE_KEY: 'test-key',
        };
        return config[key];
      }),
    };

    // Mock Supabase client responses
    mockSupabaseClient = {
      from: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockPost, error: null }),
      select: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      match: jest.fn().mockReturnThis(),
      rpc: jest.fn().mockReturnThis(),
    };

    (createClient as jest.Mock).mockReturnValue(mockSupabaseClient);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  describe('constructor', () => {
    it('should throw error if environment variables are missing', () => {
      const mockConfigService = {
        get: jest.fn().mockReturnValue(undefined),
      };
      expect(() => new PostService(mockConfigService as any)).toThrow();
    });
  });

  describe('createPost', () => {
    it('should create a post with tags', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: mockPost,
        error: null,
      });
      mockSupabaseClient.insert.mockResolvedValueOnce({
        data: [],
        error: null,
      });

      const result = await service.createPost('user123', mockCreatePostDto);

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('posts');
      expect(mockSupabaseClient.insert).toHaveBeenCalled();
      expect(result).toEqual(mockPost);
    });

    it('should throw error if post creation fails', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: new Error('Creation failed'),
      });

      await expect(
        service.createPost('user123', mockCreatePostDto),
      ).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return all posts', async () => {
      mockSupabaseClient.eq.mockReturnThis();
      mockSupabaseClient.eq.mockReturnThis();
      mockSupabaseClient.select.mockResolvedValueOnce({
        data: [mockPost],
        error: null,
      });

      const result = await service.findAll();

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('posts');
      expect(result).toEqual([mockPost]);
    });
  });

  describe('incrementViews', () => {
    it('should increment post views', async () => {
      mockSupabaseClient.rpc.mockResolvedValueOnce({
        data: null,
        error: null,
      });

      await service.incrementViews('1');

      expect(mockSupabaseClient.rpc).toHaveBeenCalledWith('increment_views', {
        post_id: '1',
      });
    });
  });

  describe('toggleLike', () => {
    it('should toggle like status', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: null,
      });
      mockSupabaseClient.insert.mockResolvedValueOnce({
        data: null,
        error: null,
      });

      const result = await service.toggleLike('1', 'user123');

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('post_likes');
      expect(result).toEqual({ liked: true });
    });
  });

  describe('findPostTags', () => {
    it('should return post tags', async () => {
      const mockTags = [{ tag_id: 'tag1' }, { tag_id: 'tag2' }];
      mockSupabaseClient.select.mockResolvedValueOnce({
        data: mockTags,
        error: null,
      });

      const result = await service.findPostTags('1');

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('post_tags');
      expect(result).toEqual(mockTags);
    });
  });

  describe('findPostById', () => {
    it('should return a post by id', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: mockPost,
        error: null,
      });

      const result = await service.findPostById('1');

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('posts');
      expect(result).toEqual(mockPost);
    });
  });

  describe('findUserPosts', () => {
    it('should return posts by user id', async () => {
      mockSupabaseClient.select.mockResolvedValueOnce({
        data: [mockPost],
        error: null,
      });

      const result = await service.findUserPosts('user123');

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('posts');
      expect(result).toEqual([mockPost]);
    });
  });

  describe('findPostsByTag', () => {
    it('should return posts by tag id', async () => {
      mockSupabaseClient.select.mockResolvedValueOnce({
        data: [mockPost],
        error: null,
      });

      const result = await service.findPostsByTag('tag1');

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('posts');
      expect(result).toEqual([mockPost]);
    });
  });

  describe('deletePost', () => {
    it('should delete a post', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: mockPost,
        error: null,
      });

      const result = await service.deletePost('1');

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('posts');
      expect(mockSupabaseClient.delete).toHaveBeenCalled();
      expect(result).toEqual(mockPost);
    });
  });

  describe('updatePost', () => {
    it('should update a post', async () => {
      const updatedPost = { ...mockPost, ...mockUpdatePostDto };
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: updatedPost,
        error: null,
      });

      const result = await service.updatePost('1', mockUpdatePostDto);

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('posts');
      expect(mockSupabaseClient.update).toHaveBeenCalledWith(mockUpdatePostDto);
      expect(result).toEqual(updatedPost);
    });
  });
});
