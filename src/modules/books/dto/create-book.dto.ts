import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: 'The Pragmatic Programmer' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'Andrew Hunt' })
  @IsString()
  author!: string;

  @ApiProperty({ example: 352, minimum: 1 })
  @IsInt()
  @Min(1)
  pageCount!: number;
}
