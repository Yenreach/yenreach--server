import AppDataSource from '../../../core/database';
import { Users } from '../../../core/database/postgres/users.entity';
import { calculatePagination, paginate } from '../../../core/utils/pagination/paginate';
import { PaginationResponse } from '../../../core/utils/pagination/pagination.interface';
import { CreateUserDto, UpdateUserDto } from '../schemas';
import * as bcrypt from 'bcrypt';

class UserService {
  private readonly userRepository = AppDataSource.getRepository(Users);

  async createUser(data: CreateUserDto): Promise<Users> {
    const newUser = this.userRepository.create(data);
    return await this.userRepository.save(newUser);
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<Users | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    Object.assign(user, data);
    return await this.userRepository.save(user);
  }

  async getAllUsers(page = 1, limit = 10): Promise<PaginationResponse<Users>> {
    const { skip } = calculatePagination(page, limit);

    const [users, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
    });

    return paginate(users, total, page, limit);
  }

  async getUserById(id: string): Promise<Users | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async getUserByEmail({ email }: { email: string }): Promise<Users | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected > 0;
  }
}

export { UserService };
