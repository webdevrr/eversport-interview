import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
  Min,
  Max,
  IsIn
} from "class-validator";

export enum BillingInterval {
  MONTHLY = "monthly",
  YEARLY = "yearly",
  WEEKLY = "weekly"
}

export enum PaymentMethod {
  CASH = "cash",
  CARD = "card"
}

export class CreateMembershipRequestDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  recurringPrice: number;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsEnum(BillingInterval)
  billingInterval: BillingInterval;

  @IsNumber()
  @Min(3)
  @Max(12)
  billingPeriods: number;

  @IsOptional()
  @IsDateString()
  validFrom?: string;
}
