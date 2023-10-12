import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import {
  SignUpRequestDto,
  SignInRequestDto,
  ApiCredentialResponse,
} from './dto';
import Cryptr from 'cryptr';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  cryptr: Cryptr;
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.cryptr = new Cryptr(
      this.configService.getOrThrow<string>('CRYPTR_SECRET'),
    );
  }

  generateJwt(payload: string): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async comparePassword(
    password: string,
    storedPasswordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, storedPasswordHash);
  }

  encrypt(payload: string): string {
    return this.cryptr.encrypt(payload);
  }

  decrypt(payload: string): string {
    return this.cryptr.decrypt(payload);
  }

  async signUp(data: SignUpRequestDto): Promise<ApiCredentialResponse> {
    const { email, password, username } = data;
    const existedUser = await this.userService.findOne({ email: data.email });
    if (existedUser)
      throw new BadRequestException(`User already existed with ${email}.`);
    const hashedPassword = await this.hashPassword(password);
    const newUser = await this.userService.create({
      email,
      username,
      password: hashedPassword,
    });

    const access_token = await this.generateJwt(
      this.encrypt(JSON.stringify({ id: newUser.id, email: newUser.email })),
    );

    return {
      access_token,
    };
  }

  async signIn(data: SignInRequestDto): Promise<ApiCredentialResponse> {
    const user = await this.userService.findOne({ email: data.email }, true);
    if (!user) throw new NotFoundException('user not found');
    const isMatch = await this.comparePassword(data.password, user['password']);
    if (!isMatch) throw new BadRequestException('wrong password');
    const access_token = await this.generateJwt(
      this.encrypt(JSON.stringify({ id: user.id, email: user.email })),
    );
    return {
      access_token,
    };
  }
}
