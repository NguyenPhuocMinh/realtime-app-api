import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SignInProviderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  photoURL?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  provider?: string;
}
