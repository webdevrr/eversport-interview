import { MembershipRepository } from "@membership/application/ports/persistence/membership.repository";
import { Membership } from "@membership/domain/membership.entity";
import membershipPeriodsData from "./data/membership-periods.json";
import membershipsData from "./data/memberships.json";
import { MembershipInMemoryMapper } from "./mappers/membership.in-memory.mapper";
import { IMembershipPeriod } from "./types/membership-period.interface";
import { IMembership } from "./types/membership.interface";
import { MembershipPeriod } from "@membership/domain/membership-period.entity";

export class MembershipInMemoryRepository implements MembershipRepository {
  private memberships: IMembership[] = [];
  private membershipPeriods: IMembershipPeriod[] = [];

  constructor() {
    this.loadData();
  }

  async findAllMembershipsWithPeriods(): Promise<
    { membership: Membership; periods: MembershipPeriod[] }[]
  > {
    return this.memberships.map((membership) => ({
      membership: MembershipInMemoryMapper.toMembershipEntity(membership),
      periods: this.membershipPeriods
        .filter((period) => period.membership === membership.id)
        .map(MembershipInMemoryMapper.toMembershipPeriodEntity)
    }));
  }

  private loadData(): void {
    try {
      this.memberships = membershipsData;
      this.membershipPeriods = membershipPeriodsData;
    } catch (error) {
      throw new Error("Failed to load membership data");
    }
  }
}
