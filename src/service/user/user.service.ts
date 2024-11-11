import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { IUser } from '../../interface/user.entity';
import { CreateUser } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';

import * as bcrypt from 'bcrypt';
// import { IPost } from 'src/interface/postInterface';

@Injectable()
export class UserService {
  private supabase;
  private jwtSecret: string;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');
    this.jwtSecret = this.configService.get<string>('JWT_SECRET');

    if (!supabaseUrl || !supabaseKey || !this.jwtSecret) {
      throw new Error('Supabase URL, API key, or JWT secret is missing');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }
  async create(createUser: CreateUser): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(createUser.password, 10);
    const userToCreate = { ...createUser, password: hashedPassword };

    const { data, error } = await this.supabase
      .from('users')
      .insert(userToCreate)
      .single();
    if (error) throw error;
    return data as IUser;
  }

  async findone(id: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('users')
      .select('id, email, username, created_at')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async findall(): Promise<IUser[]> {
    const { data, error } = await this.supabase.from('users').select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data as IUser[];
  }

  async upDateUser(upDateUser: UpdateUserDto, id: string): Promise<IUser> {
    const updateData: Partial<IUser> = {};

    if (upDateUser.email) {
      updateData.email = upDateUser.email;
    }
    if (upDateUser.username) {
      updateData.username = upDateUser.username;
    }
    if (upDateUser.password) {
      updateData.password = await bcrypt.hash(upDateUser.password, 10);
    }

    const { data, error } = await this.supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as IUser;
  }

  async delete(id: string): Promise<IUser> {
    const { data, error } = await this.supabase
      .from('users')
      .delete()
      .eq('id', id)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data as IUser;
  }

  // async findUserPosts(userId: string): Promise<IPost[]> {
  //   const { data, error } = await this.supabase
  //     .from('posts')
  //     .select(
  //       `
  //     *,
  //     category:categories(id, name),
  //     user:users(id, username),
  //     comments:comments(count)
  //   `,
  //     )
  //     .eq('id', userId)
  //     .order('created_at', { ascending: false });

  //   if (error) {
  //     throw new Error(error.message);
  //   }
  //   return data as IPost[];
  // }
}
