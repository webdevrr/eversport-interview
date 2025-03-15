import { Membership } from "@membership/domain/membership.entity";
import { MembershipPeriod } from "@membership/domain/membership-period.entity";

import { MembershipDto } from "../dto/membership.dto";
import { MembershipPeriodDto } from "../dto/membership-period.dto";
import { MembershipWithPeriodsDto } from "../dto/membership-with-periods.dto";

export class MembershipMapper {
  static toMembershipDto(domain: Membership): MembershipDto {
    return new MembershipDto(
      domain.getId(),
      domain.uuid,
      domain.name,
      domain.userId,
      domain.recurringPrice,
      domain.validFrom,
      domain.validUntil,
      domain.state,
      domain.assignedBy,
      domain.paymentMethod,
      domain.billingInterval,
      domain.billingPeriods
    );
  }

  static toMembershipPeriodDto(domain: MembershipPeriod): MembershipPeriodDto {
    return new MembershipPeriodDto(
      domain.getId(),
      domain.getUUID(),
      domain.getMembership(),
      domain.start,
      domain.end,
      domain.state
    );
  }
  static toMembershipWithPeriodsDto(
    domain: Membership
  ): MembershipWithPeriodsDto {
    return new MembershipWithPeriodsDto(
      MembershipMapper.toMembershipDto(domain),
      domain.getMembershipPeriods().map(MembershipMapper.toMembershipPeriodDto)
    );
  }
}
