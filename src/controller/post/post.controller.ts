import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Put,
} from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { CreatePostDto } from 'src/dto/create-post.dto';
import { UpdatePostDto } from 'src/dto/update-post.dto';
import { PostService } from 'src/service/post/post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto, @User() user) {
    return await this.postService.createPost(user.id, createPostDto);
  }

  @Get(':id/views')
  async incrementViews(@Param('id') postId: string) {
    await this.postService.incrementViews(postId);
  }

  @Post(':id/like')
  async toggleLike(@Param('id') postId: string, @User() user) {
    await this.postService.toggleLike(postId, user.id);
  }

  @Get(':id/tags')
  async findPostTags(@Param('id') postId: string) {
    return await this.postService.findPostTags(postId);
  }

  @Get(':id')
  async findPostById(@Param('id') postId: string) {
    return await this.postService.findPostById(postId);
  }

  @Get('user/:id')
  async findUserPosts(@Param('id') userId: string) {
    return await this.postService.findUserPosts(userId);
  }

  @Get()
  async findAll() {
    return await this.postService.findAll();
  }

  @Get('search')
  async findPostsByTag(@Param('id') tagId: string) {
    return await this.postService.findPostsByTag(tagId);
  }

  @Delete(':id')
  async deletePost(@Param('id') postId: string) {
    return await this.postService.deletePost(postId);
  }

  @Put(':id')
  async updatePost(
    @Param('id') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return await this.postService.updatePost(postId, updatePostDto);
  }
}
