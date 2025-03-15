import { MembershipPeriod } from "@membership/domain/membership-period.entity";
import { Membership } from "@membership/domain/membership.entity";
import { IMembershipPeriod } from "../types/membership-period.interface";
import { IMembership } from "../types/membership.interface";

export class MembershipInMemoryMapper {
  static toMembershipEntity(raw: IMembership): Membership {
    return new Membership(
      raw.uuid,
      raw.name,
      raw.userId,
      raw.recurringPrice,
      raw.validFrom,
      raw.assignedBy,
      raw.paymentMethod,
      raw.billingInterval,
      raw.billingPeriods
    )
      .setId(raw.id)
      .setMembershipPeriods(
        raw.membershipPeriods.map((period) =>
          MembershipInMemoryMapper.toMembershipPeriodEntity(period)
        )
      )
      .setValidUntil(raw.validUntil)
      .setState(raw.state);
  }

  static toMembershipPersistence(entity: Membership): IMembership {
    return {
      id: entity.id,
      uuid: entity.uuid,
      name: entity.name,
      userId: entity.userId,
      validUntil: entity.getValidUntil(),
      recurringPrice: entity.recurringPrice,
      validFrom: entity.validFrom,
      state: entity.state,
      assignedBy: entity.assignedBy,
      paymentMethod: entity.paymentMethod,
      billingInterval: entity.billingInterval,
      billingPeriods: entity.billingPeriods,
      membershipPeriods: entity.getMembershipPeriods()
    };
  }

  static toMembershipPeriodPersistence(
    entity: MembershipPeriod,
    id: number
  ): IMembershipPeriod {
    return {
      id,
      uuid: entity.uuid,
      membership: entity.id,
      start: entity.start,
      end: entity.end,
      state: entity.state
    };
  }

  static toMembershipPeriodEntity(raw: IMembershipPeriod): MembershipPeriod {
    return new MembershipPeriod(raw.uuid, raw.start, raw.end, raw.state)
      .setId(raw.id)
      .setMembership(raw.membership);
  }
}
