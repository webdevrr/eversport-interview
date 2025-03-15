import { MembershipRepository } from "@membership/application/ports/persistence/membership.repository";
import { Membership } from "@membership/domain/membership.entity";

import membershipPeriodsData from "./data/membership-periods.json";
import membershipsData from "./data/memberships.json";
import { MembershipInMemoryMapper } from "./mappers/membership.in-memory.mapper";
import { IMembership } from "./types/membership.interface";

export class MembershipInMemoryRepository implements MembershipRepository {
  private memberships: IMembership[] = [];

  constructor() {
    this.loadData();
  }

  async findAllMemberships(): Promise<Membership[]> {
    return this.memberships.map(MembershipInMemoryMapper.toMembershipEntity);
  }

  async saveMembership(membership: Membership): Promise<Membership> {
    const membershipId = this.memberships.length + 1;
    const totalMembershipPeriods = this.memberships.reduce(
      (acc, curr) => acc + curr.membershipPeriods.length,
      0
    );

    membership.setId(membershipId);
    membership.getMembershipPeriods().forEach((membershipPeriod, index) => {
      membershipPeriod
        .setMembership(membershipId)
        .setId(totalMembershipPeriods + index + 1);
    });

    const savedMembership =
      MembershipInMemoryMapper.toMembershipPersistence(membership);

    this.memberships.push(savedMembership);

    return MembershipInMemoryMapper.toMembershipEntity(savedMembership);
  }

  private loadData(): void {
    try {
      this.memberships = membershipsData.map((membership) => ({
        ...membership,
        membershipPeriods: membershipPeriodsData.filter(
          (period) => period.membership === membership.id
        )
      }));
    } catch (error) {
      throw new Error("Failed to load membership data");
    }
  }

  //wouldn't be used in real life scenario, just for sake to reuse this in memory repository for tests
  public clearData(): void {
    this.memberships = [];
  }
}
