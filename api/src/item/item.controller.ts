import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ItemService } from './item.service';
import {
  ItemCreateRequestDto,
  ItemResponseDto,
  ItemFindAllRequestDto,
} from './dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators';
import { User } from '@prisma/client';
import { ApiExceptionResponse } from '../shared/dto';

@Controller('item')
@UseGuards(JwtAuthGuard)
@ApiTags('item')
@ApiBearerAuth()
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @ApiCreatedResponse({ type: ItemResponseDto })
  create(
    @Body() data: ItemCreateRequestDto,
    @CurrentUser() user: User,
  ): Promise<ItemResponseDto> {
    return this.itemService.create(data, user);
  }

  @Get()
  @ApiOkResponse({ type: [ItemResponseDto] })
  findAll(@Query() data: ItemFindAllRequestDto): Promise<ItemResponseDto[]> {
    return this.itemService.findAll(data.status);
  }

  @Get(':id')
  @ApiOkResponse({ type: ItemResponseDto })
  @ApiNotFoundResponse({ type: ApiExceptionResponse })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ItemResponseDto> {
    return this.itemService.findOne(id);
  }
}
