import { ApiProperty } from '@nestjs/swagger';
import {
  MaxLength,
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsInt,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ type: String })
  @MaxLength(191)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String })
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: Number })
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ type: Number })
  @Min(1)
  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}
