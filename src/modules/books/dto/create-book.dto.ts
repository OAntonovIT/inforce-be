import { IsString, IsInt, Min } from 'class-validator';

export class CreateBookDto {
  @IsString()
  name!: string;

  @IsString()
  author!: string;

  @IsInt()
  @Min(1)
  pageCount!: number;
}
