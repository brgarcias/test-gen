import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    required: true,
    type: String,
    maxLength: 80,
    description: 'The category name',
  })
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: true,
    type: Number,
    description: 'The category interest',
  })
  @IsNumber()
  @IsNotEmpty()
  interest: number;
}
