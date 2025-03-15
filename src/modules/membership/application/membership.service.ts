import { randomUUID } from "node:crypto";

import { EversportException } from "@common/error-handling/eversport.exception";
import { InternalErrorCode } from "@common/error-handling/internal-error-code";
import { Membership } from "@membership/domain/membership.entity";
import { MembershipPeriod } from "@membership/domain/membership-period.entity";
import { CreateMembershipRequestDto } from "@membership/presenter/http/dto/create-membership.request.dto";
import { Injectable, Logger } from "@nestjs/common";

import { MembershipWithPeriodsDto } from "./dto/membership-with-periods.dto";
import { MembershipMapper } from "./mappers/membership.mapper";
import { MembershipRepository } from "./ports/persistence/membership.repository";
import { PaymentMethod } from "./types/payment-method.enum";

@Injectable()
export class MembershipService {
  private readonly logger = new Logger(MembershipService.name);

  constructor(private readonly membershipRepository: MembershipRepository) {}

  async getMemberships(): Promise<MembershipWithPeriodsDto[]> {
    const memberships = await this.membershipRepository.findAllMemberships();
    return memberships.map(MembershipMapper.toMembershipWithPeriodsDto);
  }

  async createNewMembership(
    createMembershipRequestDto: CreateMembershipRequestDto
  ): Promise<MembershipWithPeriodsDto> {
    const {
      recurringPrice,
      name,
      paymentMethod,
      billingPeriods,
      billingInterval,
      validFrom
    } = createMembershipRequestDto;
    const userId = 2000;

    if (!this.hasMandatoryFields(createMembershipRequestDto)) {
      throw new EversportException(InternalErrorCode.MISSING_MANDATORY_FIELDS);
    }

    if (!this.isRecurringPriceValid(recurringPrice)) {
      throw new EversportException(InternalErrorCode.NEGATIVE_RECURRING_PRICE);
    }

    if (!this.isCashPriceValid(recurringPrice, paymentMethod)) {
      throw new EversportException(InternalErrorCode.CASH_PRICE_BELOW_100);
    }

    if (!this.isValidBillingInterval(billingInterval)) {
      throw new EversportException(InternalErrorCode.INVALID_BILLING_PERIODS);
    }

    if (billingInterval === "monthly") {
      if (!this.isValidMonthlyBillingPeriods(billingPeriods)) {
        throw new EversportException(
          billingPeriods > 12
            ? InternalErrorCode.BILLING_PERIODS_MORE_THAN_12_MONTHS
            : InternalErrorCode.BILLING_PERIODS_LESS_THAN_6_MONTHS
        );
      }
    }

    if (billingInterval === "yearly") {
      if (!this.isValidYearlyBillingPeriods(billingPeriods)) {
        throw new EversportException(
          billingPeriods > 10
            ? InternalErrorCode.BILLING_PERIODS_MORE_THAN_10_YEARS
            : InternalErrorCode.BILLING_PERIODS_LESS_THAN_3_YEARS
        );
      }
    }

    const validUntil = this.calculateValidUntil(
      validFrom,
      billingPeriods,
      billingInterval
    );
    const membership = new Membership(
      randomUUID(),
      name,
      userId,
      recurringPrice,
      validFrom,
      "Admin",
      paymentMethod,
      billingInterval,
      billingPeriods
    )
      .setMembershipPeriods(
        this.createMembershipPeriods(validFrom, billingPeriods, billingInterval)
      )
      .setState(this.determineMembershipStatus(validFrom, validUntil))
      .setValidUntil(validUntil);

    const savedMembership =
      await this.membershipRepository.saveMembership(membership);

    this.logger.log(`Created new membership for user ${userId}`);

    return MembershipMapper.toMembershipWithPeriodsDto(savedMembership);
  }

  private hasMandatoryFields(
    createMembershipRequestDto: CreateMembershipRequestDto
  ): boolean {
    const { name, recurringPrice } = createMembershipRequestDto;
    return Boolean(name && recurringPrice);
  }

  private isRecurringPriceValid(reccuringPrice: number) {
    return reccuringPrice > 0;
  }

  private isCashPriceValid(
    recurringPrice: number,
    paymentMethod: PaymentMethod
  ): boolean {
    return !(paymentMethod === PaymentMethod.CASH && recurringPrice < 100);
  }

  private isValidBillingInterval(billingInterval: string): boolean {
    return ["yearly", "monthly", "weekly"].includes(billingInterval);
  }

  private isValidMonthlyBillingPeriods(billingPeriods: number): boolean {
    return billingPeriods >= 6 && billingPeriods <= 12;
  }

  private isValidYearlyBillingPeriods(billingPeriods: number): boolean {
    return billingPeriods >= 3 && billingPeriods <= 10;
  }
  private createMembershipPeriods(
    validFrom: string,
    billingPeriods: number,
    billingInterval: string
  ): MembershipPeriod[] {
    const membershipPeriods: MembershipPeriod[] = [];
    let periodStart = new Date(validFrom);

    for (let i = 0; i < billingPeriods; i++) {
      const validFrom = new Date(periodStart);
      const validUntil = new Date(validFrom);

      switch (billingInterval.toLowerCase()) {
        case "monthly":
          validUntil.setMonth(validFrom.getMonth() + 1);
          break;
        case "yearly":
          validUntil.setFullYear(validFrom.getFullYear() + 1);
          break;
        case "weekly":
          validUntil.setDate(validFrom.getDate() + 7);
          break;
      }

      const period = new MembershipPeriod(
        randomUUID(),
        validFrom.toISOString(),
        validUntil.toISOString(),
        "planned"
      );
      membershipPeriods.push(period);
      periodStart = validUntil;
    }
    return membershipPeriods;
  }

  private determineMembershipStatus(
    validFrom: string,
    validUntil: string
  ): string {
    const now = new Date();
    const startDate = new Date(validFrom);
    const endDate = new Date(validUntil);

    if (startDate > now) {
      return "pending";
    } else if (endDate < now) {
      return "expired";
    } else {
      return "active";
    }
  }

  private calculateValidUntil(
    validFrom: string,
    billingPeriods: number,
    billingInterval: string
  ): string {
    const dateToUse = validFrom ? new Date(validFrom) : new Date();

    switch (billingInterval.toLowerCase()) {
      case "monthly":
        return new Date(
          dateToUse.setMonth(dateToUse.getMonth() + billingPeriods)
        ).toISOString();
      case "yearly":
        return new Date(
          dateToUse.setFullYear(dateToUse.getFullYear() + billingPeriods)
        ).toISOString();
      case "weekly":
        return new Date(
          dateToUse.setDate(dateToUse.getDate() + billingPeriods * 7)
        ).toISOString();
    }
  }
}
