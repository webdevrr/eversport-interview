import { BillingInterval } from "@membership/application/types/billing-interval.enum";
import { PaymentMethod } from "@membership/application/types/payment-method.enum";
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min
} from "class-validator";

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
