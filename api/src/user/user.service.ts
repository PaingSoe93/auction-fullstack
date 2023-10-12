import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  create(data: Omit<User, 'id' | 'balance'>) {
    return this.prismaService.user.create({
      data,
    });
  }

  findOne(query: Partial<Omit<User, 'balance'>>, selectPassword = false) {
    return this.prismaService.user.findFirst({
      where: query,
      select: !selectPassword
        ? { id: true, email: true, balance: true, username: true }
        : undefined,
    });
  }

  updateBalance(
    id: number,
    amount: { increment?: number; decrement?: number } | number,
  ) {
    return this.prismaService.user.update({
      where: { id },
      data: { balance: amount },
      select: { id: true },
    });
  }
}
