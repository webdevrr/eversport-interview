import { MembershipPeriod } from "@membership/domain/membership-period.entity";
import { Membership } from "@membership/domain/membership.entity";

interface RawMembership {
  id: number;
  uuid: string;
  name: string;
  userId: number;
  recurringPrice: number;
  validFrom: string;
  validUntil: string;
  state: string;
  assignedBy: string;
  paymentMethod: string | null;
  billingInterval: string;
  billingPeriods: number;
}

interface RawMembershipPeriod {
  id: number;
  uuid: string;
  membership: number;
  start: string;
  end: string;
  state: string;
}

export class MembershipInMemoryMapper {
  static toMembershipEntity(raw: RawMembership): Membership {
    return new Membership(
      raw.uuid,
      raw.name,
      raw.userId,
      raw.recurringPrice,
      new Date(raw.validFrom),
      new Date(raw.validUntil),
      raw.state,
      raw.assignedBy,
      raw.paymentMethod ?? "",
      raw.billingInterval,
      raw.billingPeriods
    ).setId(raw.id);
  }

  static toMembershipPeriodEntity(raw: RawMembershipPeriod): MembershipPeriod {
    return new MembershipPeriod(
      raw.id,
      raw.uuid,
      raw.membership,
      new Date(raw.start),
      new Date(raw.end),
      raw.state
    );
  }
}
