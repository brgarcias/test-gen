import { ApiProperty } from '@nestjs/swagger';

export default class VerifyUserDto {
  @ApiProperty({
    type: String,
    description: 'The user email',
    example: 'user@gmail.com',
  })
  readonly email: string = '';
}
