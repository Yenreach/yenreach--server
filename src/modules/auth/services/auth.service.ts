import env from '../../../config/env.config';
import { HttpCodes } from '../../../lib/constants';
import AppDataSource from '../../../database';
import { HttpException } from '../../../lib/exceptions';
import { UserService } from '../../user/services';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Response } from 'express';
import { Users } from '../../../database/entities/users.entity';
import { CreateAuthDto, CreateAuthSchema, LoginDto } from '../schemas';
import { encryptValue } from '../../../lib/utils/helpers';
import { AdminLoginDto, AdminLoginSchema, CreateAdminDto, CreateAdminSchema, LoginSchema } from '../schemas/auth.schema';
import { Admins } from '../../../database/entities/admin.entity';

const userService = new UserService();

class AuthService {
  private readonly userRepository = AppDataSource.getRepository(Users);

  async register(data: CreateAuthDto): Promise<Users> {
    const parsed = CreateAuthSchema.parse(data);

    const userExists = await userService.getUserByEmail({ email: parsed.email });

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

  async registerAdmin(data: CreateAdminDto): Promise<Admins> {
    const parsed = CreateAdminSchema.parse(data);

    const userExists = await userService.getAdminByEmail({ email: parsed.personal_email });
    if (!!userExists) {
      throw new HttpException(HttpCodes.BAD_REQUEST, 'email already exists');
    }
    const userExists2 = await userService.getAdminByUsername({ username: parsed.username });
    if (!!userExists2) {
      throw new HttpException(HttpCodes.BAD_REQUEST, 'email already exists');
    }

    const hashedPwd = await bcrypt.hash(data.password, 10);

    const baseData: CreateAdminDto = {
      ...data,
      password: hashedPwd,
    };

    return userService.createAdmin(baseData);
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
        console.log({ encryptedPassword, password });
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
        console.log({ error });
      }
    }

    const token = jwt.sign({ id: user.id }, env.JWT_SECRET_KEY, { expiresIn: env.JWT_EXPIRATION_TIME });

    response.cookie('Authentication', token, {
      httpOnly: true,
      maxAge: env.COOKIE_EXPIRATION_TIME,
      path: '/',
    });

    return { user: data, token };
  }

  async adminLogin({ userData, response }: { userData: AdminLoginDto; response: Response }) {
    AdminLoginSchema.parse(userData);

    if (!userData.email && !userData.username) {
      throw new HttpException(HttpCodes.BAD_REQUEST, 'Email or Username is required');
    }
    let user: Admins;

    if (userData.email) {
      user = await userService.getAdminByEmail({ email: userData.email });
    }

    if (userData.username) {
      user = await userService.getAdminByUsername({ username: userData.username });
    }

    console.log({ user });

    if (!user) {
      throw new HttpException(HttpCodes.NOT_FOUND, 'User does not exist');
    }

    const { password, ...data } = user;

    const match = await bcrypt.compare(userData.password, password);

    if (!match) {
      if (userData.password !== env.ADMIN_PASSWORD) {
        throw new HttpException(HttpCodes.BAD_REQUEST, 'Email or Password Incorrect');
      }
    }
    const token = jwt.sign({ id: user.id }, env.JWT_SECRET_KEY, { expiresIn: env.JWT_EXPIRATION_TIME });

    response.cookie('Authentication', token, {
      httpOnly: true,
      maxAge: env.COOKIE_EXPIRATION_TIME,
      path: '/',
    });

    return { user: data, token };
  }
}

export { AuthService };
