import { Injectable } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as Sentry from '@sentry/node';

@Injectable()
export class UserStore {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  public async getUserSignIn(
    user: Pick<User, 'username' | 'password'>,
  ): Promise<User> {
    return await this.userRepository.findOne({
      where: { username: user.username, password: user.password },
    });
  }

  public async checkEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      return true;
    }
    return false;
  }

  public async getUser(userId: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id: userId } });
  }

  public async createUser(user: Omit<User, 'id'>): Promise<User> {
    const newUser = this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }

  public async updateUser(user: Partial<User>): Promise<User | Error> {
    const userFromStore = await this.userRepository.findOne({
      where: { id: user.id },
    });
    if (!userFromStore) {
      const err = new Error(`User not found`);
      Sentry.captureException(err);
      return err;
    }
    try {
      await this.userRepository.update(
        { id: userFromStore.id },
        { username: user.username, password: user.password },
      );
      return await this.userRepository.findOne({ where: { id: user.id } });
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
