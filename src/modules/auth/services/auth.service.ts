import env from '../../../config/env.config';
import { HttpCodes } from '../../../core/constants';
import AppDataSource from '../../../core/database';
import { HttpException } from '../../../core/exceptions';
import { UserService } from '../../user/services';
import { CreateAuthDto, LoginDto } from '../dto/auth.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Response } from 'express';
import { Users } from '../../../core/database/postgres/users.entity';

const userService = new UserService();

class AuthService {
  private readonly userRepository = AppDataSource.getRepository(Users);

  async register(data: CreateAuthDto): Promise<Users> {
    const userExists = await userService.getUserByEmail({ email: data.email });
    if (!userExists) {
      throw new HttpException(HttpCodes.BAD_REQUEST, 'email already exists');
    }

    const hashedPwd = await bcrypt.hash(data.password, 10);

    const baseData: CreateAuthDto = {
      ...data,
      password: hashedPwd,
    };

    return userService.createUser(baseData);
  }

  async login({ userData, response }: { userData: LoginDto; response: Response }) {
    const user = await userService.getUserByEmail({ email: userData.email });

    if (!user) {
      throw new HttpException(HttpCodes.NOT_FOUND, 'User does not exist');
    }

    const { password, ...data } = user;

    const match = await bcrypt.compare(userData.password, password);

    if (!match) throw new HttpException(HttpCodes.BAD_REQUEST, 'Email or Password Incorrect');

    const token = jwt.sign({ id: user.id }, env.JWT_SECRET_KEY, { expiresIn: Number(env.JWT_EXPIRATION_HOURS) });

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + env.JWT_EXPIRATION_HOURS);

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
      path: '/',
    });

    return { user: data, token };
  }
}

export { AuthService };
