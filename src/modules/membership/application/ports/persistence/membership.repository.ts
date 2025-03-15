import { MembershipPeriod } from "@membership/domain/membership-period.entity";
import { Membership } from "@membership/domain/membership.entity";

export abstract class MembershipRepository {
  abstract findAllMembershipsWithPeriods(): Promise<
    { membership: Membership; periods: MembershipPeriod[] }[]
  >;
}
