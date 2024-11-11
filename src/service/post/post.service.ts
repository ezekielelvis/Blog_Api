import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { CreatePostDto } from 'src/dto/create-post.dto';
import { IPost } from 'src/interface/post.entity';
import { UpdatePostDto } from 'src/dto/update-post.dto';

@Injectable()
export class PostService {
  private supabase;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL or API key is missing');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async createPost(
    userId: string,
    createPostDto: CreatePostDto,
  ): Promise<IPost> {
    const { data: post, error } = await this.supabase
      .from('posts')
      .insert([
        {
          ...createPostDto,
          user_id: userId,
        },
      ])
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (createPostDto.tags) {
      const postTags = createPostDto.tags.map((tagId) => ({
        post_id: post.id,
        tag_id: tagId,
      }));

      await this.supabase.from('post_tags').insert(postTags);
    }
    return post as IPost;
  }

  async findAll(): Promise<IPost[]> {
    const { data, error } = await this.supabase.from('posts').select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data as IPost[];
  }

  async incrementViews(postId: string): Promise<void> {
    const { data, error } = await this.supabase.rpc('increment_views', {
      post_id: postId,
    });

    if (error) throw error;
    return data;
  }

  async toggleLike(postId: string, userId: string) {
    const { data: existingLike } = await this.supabase
      .from('post_likes')
      .select()
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      await this.supabase
        .from('post_likes')
        .delete()
        .match({ post_id: postId, user_id: userId });
    } else {
      await this.supabase
        .from('post_likes')
        .insert([{ post_id: postId, user_id: userId }]);
    }

    return { liked: !existingLike };
  }

  async findPostTags(postId: string) {
    const { data, error } = await this.supabase
      .from('post_tags')
      .select('tag_id')
      .eq('post_id', postId);

    if (error) throw error;
    return data;
  }

  async findPostById(postId: string): Promise<IPost> {
    const { data, error } = await this.supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (error) throw error;
    return data as IPost;
  }

  async findUserPosts(userId: string): Promise<IPost[]> {
    const { data, error } = await this.supabase
      .from('posts')
      .select(
        `
        *,
        category:categories(id, name),
        user:users(id, username),
        tags:post_tags(tag_id)
        `,
      )
      .eq('id', userId);

    if (error) throw error;
    return data as IPost[];
  }

  async findPostsByTag(tagId: string): Promise<IPost[]> {
    const { data, error } = await this.supabase
      .from('posts')
      .select(
        `
        *,
        category:categories(id, name),
        user:users(id, username),
        post_tags!inner(tag_id)
        `,
      )
      .eq('post_tags.tag_id', tagId);

    if (error) throw error;
    return data as IPost[];
  }

  async deletePost(postId: string): Promise<IPost> {
    const { data, error } = await this.supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      .single();

    if (error) throw error;
    return data as IPost;
  }

  async updatePost(
    postId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<IPost> {
    const { data, error } = await this.supabase
      .from('posts')
      .update(updatePostDto)
      .eq('id', postId)
      .single();

    if (error) throw error;
    return data as IPost;
  }
}
