import { MembershipPeriod } from "./membership-period.entity";

/** Aggregate root **/
export class Membership {
  id: number;
  uuid: string;
  name: string;
  userId: number;
  recurringPrice: number;
  validFrom: string;
  validUntil: string;
  state: string;
  assignedBy: string;
  paymentMethod: string;
  billingInterval: string;
  billingPeriods: number;
  membershipPeriods: MembershipPeriod[];

  constructor(
    uuid: string,
    name: string,
    userId: number,
    recurringPrice: number,
    validFrom: string,
    assignedBy: string,
    paymentMethod: string,
    billingInterval: string,
    billingPeriods: number
  ) {
    this.uuid = uuid;
    this.name = name;
    this.userId = userId;
    this.recurringPrice = recurringPrice;
    this.validFrom = validFrom;
    this.assignedBy = assignedBy;
    this.paymentMethod = paymentMethod;
    this.billingInterval = billingInterval;
    this.billingPeriods = billingPeriods;
  }

  setId(id: number) {
    this.id = id;
    return this;
  }

  getId(): number {
    return this.id;
  }

  getValidUntil(): string {
    return this.validUntil;
  }

  getMembershipPeriods(): MembershipPeriod[] {
    return this.membershipPeriods;
  }

  setMembershipPeriods(membershipPeriods: MembershipPeriod[]) {
    this.membershipPeriods = membershipPeriods;
    return this;
  }

  setState(state: string) {
    this.state = state;
    return this;
  }

  setValidUntil(validUntil: string) {
    this.validUntil = validUntil;
    return this;
  }
}
