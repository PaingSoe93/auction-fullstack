import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';

const user = {
  id: 1,
  email: 'test1@email.com',
  password: 'salted_password',
  username: 'Testing 1',
  balance: 0,
};

const db = {
  user: {
    findFirst: jest.fn().mockResolvedValue(user),
    create: jest.fn().mockResolvedValue(user),
    update: jest.fn().mockResolvedValue(user),
  },
};

describe('UserService', () => {
  let service: UserService;
  let prismaService: Partial<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('[Normal] should create user', async () => {
      const newUser = {
        email: user.email,
        password: user.password,
        username: user.username,
      };
      expect(await service.create(newUser)).toEqual(user);
      expect(prismaService.user.create).toHaveBeenCalledWith({ data: newUser });
    });
  });

  describe('findOne', () => {
    it('[Normal] should return user with email', async () => {
      const query = { email: 'test@email.com' };

      expect(await service.findOne({ email: 'test@email.com' })).toEqual(user);

      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: query,
        select: { balance: true, email: true, id: true, username: true },
      });
    });

    it('[Normal] should return user with email and id', async () => {
      const query = { email: 'test@email.com', id: 1 };
      expect(await service.findOne(query)).toEqual(user);
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: query,
        select: { balance: true, email: true, id: true, username: true },
      });
    });

    it('[Normal] should return user with password is admin true', async () => {
      const query = { email: 'test@email.com', id: 1 };
      expect(await service.findOne(query, true)).toEqual(user);
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: query,
      });
    });
  });

  describe('updateBalance', () => {
    it('[Normal] should increment user balance', async () => {
      const id = 1;
      const amount = { increment: 10 };
      expect(await service.updateBalance(id, amount)).toEqual(user);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id },
        data: { balance: amount },
        select: { id: true },
      });
    });

    it('[Normal] should decrement user balance', async () => {
      const id = 1;
      const amount = { decrement: 10 };
      expect(await service.updateBalance(id, amount)).toEqual(user);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id },
        data: { balance: amount },
        select: { id: true },
      });
    });
  });
});
