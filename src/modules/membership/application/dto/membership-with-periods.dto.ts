import { MembershipDto } from "./membership.dto";
import { MembershipPeriodDto } from "./membership-period.dto";

export class MembershipWithPeriodsDto {
  constructor(
    public readonly membership: MembershipDto,
    public readonly periods: MembershipPeriodDto[]
  ) {}
}
