import { Injectable } from "@nestjs/common";
import { MembershipMapper } from "./mappers/membership.mapper";
import { MembershipWithPeriodsDto } from "./dto/membership-with-periods.dto";
import { MembershipRepository } from "./ports/persistence/membership.repository";
import { CreateMembershipRequestDto } from "@membership/presenter/http/dto/create-membership.request.dto";
import { EversportException } from "@common/error-handling/eversport.exception";
import { InternalErrorCode } from "@common/error-handling/internal-error-code";
import { Membership } from "@membership/domain/membership.entity";
import { randomUUID } from "node:crypto";

@Injectable()
export class MembershipService {
  constructor(private readonly membershipRepository: MembershipRepository) {}

  async getMemberships(): Promise<MembershipWithPeriodsDto[]> {
    const memberships =
      await this.membershipRepository.findAllMembershipsWithPeriods();
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
      billingInterval
    } = createMembershipRequestDto;
    const userId = 2000;

    const membership = new Membership(
      randomUUID(),
      name,
      userId,
      recurringPrice,
      new Date(),
      null,
      "active",
      "system",
      paymentMethod,
      billingInterval,
      billingPeriods
    );

    if (!name || !recurringPrice) {
      throw new EversportException(InternalErrorCode.MISSING_MANDATORY_FIELDS);
    }

    if (recurringPrice < 0) {
      throw new EversportException(InternalErrorCode.NEGATIVE_RECURRING_PRICE);
    }

    if (recurringPrice < 100 && paymentMethod === "cash") {
      throw new EversportException(InternalErrorCode.CASH_PRICE_BELOW_100);
    }

    if (billingInterval === "monthly") {
      if (billingPeriods > 12) {
        throw new EversportException(
          InternalErrorCode.BILLING_PERIODS_MORE_THAN_12_MONTHS
        );
      }
      if (billingPeriods < 6) {
        throw new EversportException(
          InternalErrorCode.BILLING_PERIODS_LESS_THAN_6_MONTHS
        );
      }
    }

    return "" as any;
  }
}
