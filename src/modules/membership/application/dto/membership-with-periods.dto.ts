import { MembershipPeriodDto } from "./membership-period.dto";
import { MembershipDto } from "./membership.dto";

export class MembershipWithPeriodsDto {
  constructor(
    public readonly membership: MembershipDto,
    public readonly periods: MembershipPeriodDto[]
  ) {}
}
