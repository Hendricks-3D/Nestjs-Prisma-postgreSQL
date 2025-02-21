import { IsNumberString } from 'class-validator';

export class ValidateUserId {
  @IsNumberString()
  id: number;
}
