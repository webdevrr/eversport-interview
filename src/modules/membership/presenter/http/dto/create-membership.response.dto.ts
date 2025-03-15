import { MembershipPeriodDto } from "@membership/application/dto/membership-period.dto";
import { MembershipDto } from "@membership/application/dto/membership.dto";

export class CreateMembershipResponseDto {
  constructor(
    public readonly membership: MembershipDto,
    public readonly membershipPeriods: MembershipPeriodDto[]
  ) {}
}
