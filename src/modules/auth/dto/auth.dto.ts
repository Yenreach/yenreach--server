export class CreateAuthDto {
  name: string;
  email: string;
  password: string;
  image?: string;
  referMethod?: string;
  admin?: number;
  activation?: number;
  authoLevel?: number;
  cv?: string;
  dob?: string;
  phone?: string;
  gender?: string;
}

export class LoginDto {
  email: string;
  password: string;
}
