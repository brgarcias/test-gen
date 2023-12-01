import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ type: String })
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;
}
