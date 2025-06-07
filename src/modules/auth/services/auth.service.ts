import env from '../../../config/env.config';
import { HttpCodes } from '../../../core/constants';
import AppDataSource from '../../../core/database';
import { HttpException } from '../../../core/exceptions';
import { UserService } from '../../user/services';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Response } from 'express';
import { Users } from '../../../core/database/postgres/users.entity';
import { CreateAuthDto, CreateAuthSchema, LoginDto, LoginSchema } from '../schemas';
import { encryptValue } from '../../../core/utils/helpers';

const userService = new UserService();

class AuthService {
  private readonly userRepository = AppDataSource.getRepository(Users);

  async register(data: CreateAuthDto): Promise<Users> {
    const parsed = CreateAuthSchema.parse(data);

    const userExists = await userService.getUserByEmail({ email: data.email });

    // console.log({userExists});

    if (!!userExists) {
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
    LoginSchema.parse(userData);

    const user = await userService.getUserByEmail({ email: userData.email });

    if (!user) {
      throw new HttpException(HttpCodes.NOT_FOUND, 'User does not exist');
    }

    console.log(user);

    const { password, ...data } = user;

    const match = await bcrypt.compare(userData.password, password);

    if (!match) {
      try {
        const encryptedPassword = encryptValue(user.timer, userData.password);
        console.log({ encryptedPassword, password })
        if (encryptedPassword !== password) {
          throw new HttpException(HttpCodes.BAD_REQUEST, 'Email or Password Incorrect');
        }
      } catch (error) {
        throw new HttpException(HttpCodes.BAD_REQUEST, 'Email or Password Incorrect');
      }
      try {
        await userService.updateUser(user.id, {
          password: userData.password,
        });
      } catch (error) {
        // fail silently and allow login
        console.log({ error })
      }
    };

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
