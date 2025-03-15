import { Membership } from "@membership/domain/membership.entity";
import { MembershipDto } from "../dto/membership.dto";
import { MembershipPeriod } from "@membership/domain/membership-period.entity";
import { MembershipWithPeriodsDto } from "../dto/membership-with-periods.dto";
import { MembershipPeriodDto } from "../dto/membership-period.dto";

export class MembershipMapper {
  static toMembershipDto(domain: Membership): MembershipDto {
    return new MembershipDto(
      domain.id,
      domain.uuid,
      domain.name,
      domain.userId,
      domain.recurringPrice,
      domain.validFrom.toISOString(),
      domain.validUntil.toISOString(),
      domain.state,
      domain.assignedBy,
      domain.paymentMethod,
      domain.billingInterval,
      domain.billingPeriods
    );
  }

  static toMembershipPeriodDto(domain: MembershipPeriod): MembershipPeriodDto {
    return new MembershipPeriodDto(
      domain.id,
      domain.uuid,
      domain.membership,
      domain.start,
      domain.end,
      domain.state
    );
  }
  static toMembershipWithPeriodsDto(domain: {
    membership: Membership;
    periods: MembershipPeriod[];
  }): MembershipWithPeriodsDto {
    return new MembershipWithPeriodsDto(
      MembershipMapper.toMembershipDto(domain.membership),
      domain.periods.map(MembershipMapper.toMembershipPeriodDto)
    );
  }
}
