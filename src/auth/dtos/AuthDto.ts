import { IsEmail, IsString } from 'class-validator';

class AuthDto {
  // @ts-ignore
  IsEmail()
  public email: string;

  // @ts-ignore
  IsString()
  public password: string;
}

export { AuthDto }
