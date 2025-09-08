import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  // inject User repository to interact with the database
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  // create a new user with hashed password
  async create(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({
      email,
      password: hashedPassword,
    });
    return this.userRepo.save(user);
  }

  // find a user by email
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  // find a user by ID and throw exception if not found
  async findById(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // update user profile with given data and return updated user
  async updateProfile(id: number, dto: UpdateProfileDto): Promise<User> {
    console.log(id);
    await this.userRepo.update(id, dto);
    return this.findById(id);
  }
}
