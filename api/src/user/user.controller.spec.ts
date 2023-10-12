import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('me', () => {
    it('[Normal] should return user info', () => {
      const user = {
        id: 1,
        email: 'test1@email.com',
        password: 'salted_password',
        username: 'Testing 1',
        balance: 0,
      };
      expect(controller.getMe(user)).toEqual(user);
    });
  });
});
