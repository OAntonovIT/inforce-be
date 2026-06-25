import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { BooksService } from './books.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { BooksQueryDto } from './dto/books-query.dto';

@ApiTags('Books')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get paginated list of books' })
  @ApiResponse({ status: 200, description: 'Paginated book list' })
  findAll(@Query() query: BooksQueryDto) {
    return this.booksService.findAll(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get book by ID' })
  @ApiResponse({ status: 200, description: 'Book found' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Roles(Role.admin)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new book (admin only)' })
  @ApiResponse({ status: 201, description: 'Book created' })
  @ApiResponse({ status: 400, description: 'Validation error or name taken' })
  create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }

  @Roles(Role.admin)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update book (admin only)' })
  @ApiResponse({ status: 200, description: 'Book updated' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.booksService.update(id, dto);
  }

  @Roles(Role.admin)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete book (admin only)' })
  @ApiResponse({ status: 200, description: 'Book deleted' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
