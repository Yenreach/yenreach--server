import AppDataSource from '../../../core/database';
import { Admins } from '../../../core/database/postgres/admin.entity';
import { Users } from '../../../core/database/postgres/users.entity';
import { calculatePagination, paginate } from '../../../core/utils/pagination/paginate';
import { PaginationResponse } from '../../../core/utils/pagination/pagination.interface';
import { CreateAdminDto } from '../../auth/schemas';
import { CreateUserDto, UpdateUserDto } from '../schemas';
import * as bcrypt from 'bcrypt';

class UserService {
  private readonly userRepository = AppDataSource.getRepository(Users);
  private readonly adminRepository = AppDataSource.getRepository(Admins);

  async createUser(data: CreateUserDto): Promise<Users> {
    const newUser = this.userRepository.create(data);
    return await this.userRepository.save(newUser);
  }
  
  async createAdmin(data: CreateAdminDto): Promise<Admins> {
    const newUser = this.adminRepository.create(data);
    return await this.adminRepository.save(newUser);
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

  async getAdminById(id: string): Promise<Admins | null> {
    return await this.adminRepository.findOneBy({ id });
  }

  async getUserByEmail({ email }: { email: string }): Promise<Users | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async getAdminByEmail({ email }: { email: string }): Promise<Admins | null> {
    return await this.adminRepository.findOne({
      where:  [
          { personal_email: email },
          { official_email: email },
        ]
    });
  }
  async getAdminByUsername({ username }: { username: string }): Promise<Admins | null> {
    return await this.adminRepository.findOneBy({ username });
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected > 0;
  }
}

export { UserService };
