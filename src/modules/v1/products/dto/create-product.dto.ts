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
  @ApiProperty({
    required: true,
    type: String,
    maxLength: 191,
    description: 'The product name',
  })
  @MaxLength(191)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: true,
    type: String,
    maxLength: 255,
    description: 'The product description',
  })
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    required: true,
    type: Number,
    minimum: 1,
    description: 'The product price',
  })
  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    required: true,
    type: Number,
    minimum: 1,
    description: 'The product category id',
  })
  @Min(1)
  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}
