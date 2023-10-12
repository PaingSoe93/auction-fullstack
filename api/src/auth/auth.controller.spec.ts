import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: { signUp: jest.fn(), signIn: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('[Normal] should signUp user', async () => {
      jest
        .spyOn(service, 'signUp')
        .mockResolvedValueOnce({ access_token: 'access_token' });
      expect(
        await controller.signUp({
          email: 'test@email.com',
          password: 'password',
          username: 'Test User',
        }),
      ).toEqual({ access_token: 'access_token' });
    });
  });

  describe('signIn', () => {
    it('[Normal] should signIn user', async () => {
      jest
        .spyOn(service, 'signIn')
        .mockResolvedValueOnce({ access_token: 'access_token' });
      expect(
        await controller.signIn({
          email: 'test@email.com',
          password: 'password',
        }),
      ).toEqual({ access_token: 'access_token' });
    });
  });
});
