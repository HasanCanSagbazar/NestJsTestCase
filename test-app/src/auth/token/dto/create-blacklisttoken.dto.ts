import { IsNotEmpty, IsString, IsDate } from 'class-validator';

export class CreateBlacklistTokenDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsDate()
  expiryDate: Date;
}

