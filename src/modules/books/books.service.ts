import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Prisma } from '@prisma/client';
import { BooksQueryDto } from './dto/books-query.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: BooksQueryDto) {
    const { page = 1, limit = 10, search } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.BookWhereInput = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              author: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {};

    const [books, total] = await this.prisma.$transaction([
      this.prisma.book.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data: books,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  async create(dto: CreateBookDto) {
    return this.prisma.book.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateBookDto) {
    return this.prisma.book.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.book.delete({
      where: { id },
    });
  }
}
