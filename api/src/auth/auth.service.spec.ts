import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcryptjs';

const mockUserService = {
  findOne: jest.fn(),
  create: jest.fn(),
};

const user = {
  id: 1,
  email: 'test1@email.com',
  password: 'salted_password',
  username: 'Testing 1',
  balance: 0,
};

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'testSecret',
        }),
      ],
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue('testSecret'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('decrypt', () => {
    it('[Normal] should generate jwt token', async () => {
      jest
        .spyOn(authService.cryptr, 'decrypt')
        .mockReturnValueOnce('decrypt payload');
      expect(authService.decrypt('payload_to generate jwt')).toBe(
        'decrypt payload',
      );
    });
  });

  describe('signUp', () => {
    it('[Normal] should sign up user with hashed password', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(null);
      const userCreateSpy = jest
        .spyOn(userService, 'create')
        .mockResolvedValueOnce({ ...user, id: 1 });
      expect(
        (
          await authService.signUp({
            email: user.email,
            username: user.username,
            password: user.password,
          })
        ).access_token,
      ).toBeDefined();
      const userCreateData = userCreateSpy.mock.calls[0][0];
      expect(userCreateData.password).not.toEqual('password');
    });

    it('[Error]should throw error with existing email', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(user);
      expect(
        authService.signUp({
          email: user.email,
          username: user.username,
          password: user.password,
        }),
      ).rejects.toThrow(`User already existed with ${user.email}.`);
    });
  });

  describe('signIn', () => {
    it('[Normal] should sign in user', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
        return true;
      });
      expect(
        (
          await authService.signIn({
            email: user.email,
            password: user.password,
          })
        ).access_token,
      ).toBeDefined();
    });

    it('[Error] should throw error with non-existed email', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(null);
      expect(
        authService.signIn({
          email: 'non-existed@email.com',
          password: 'XXXXXXXX',
        }),
      ).rejects.toThrow('user not found');
    });

    it('[Error] should throw error with wrong password', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(user);
      expect(
        authService.signIn({
          email: user.email,
          password: 'XXXXXXXX',
        }),
      ).rejects.toThrow('wrong password');
    });
  });
});
