import { TrStatus } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { MIN_WITHDRAW_AMOUNT } from 'src/constants';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(MIN_WITHDRAW_AMOUNT, {
    message: `Minimum withdrawal amount is ${MIN_WITHDRAW_AMOUNT} soums`,
  })
  amount: number;

  @IsNotEmpty()
  @IsNumberString()
  @Length(1, 16)
  card_number: string;

  @IsNotEmpty()
  @IsString()
  card_name: string;
}

export class UpdateTrStatusDto {
  @IsEnum(
    {
      PAID: 'PAID',
      REJECTED: 'REJECTED',
    },
    {
      message: 'Given value should be either PAID or REJECTED!',
    },
  )
  @IsNotEmpty()
  status: TrStatus;

  @IsOptional()
  @IsString()
  message: string;
}
