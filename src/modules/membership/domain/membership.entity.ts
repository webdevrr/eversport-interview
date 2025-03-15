export class Membership {
  id: number;
  uuid: string;
  name: string;
  userId: number;
  recurringPrice: number;
  validFrom: Date;
  validUntil: Date;
  state: string;
  assignedBy: string;
  paymentMethod: string;
  billingInterval: string;
  billingPeriods: number;

  constructor(
    uuid: string,
    name: string,
    userId: number,
    recurringPrice: number,
    validFrom: Date,
    validUntil: Date,
    state: string,
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
    this.validUntil = validUntil;
    this.state = state;
    this.assignedBy = assignedBy;
    this.paymentMethod = paymentMethod;
    this.billingInterval = billingInterval;
    this.billingPeriods = billingPeriods;
  }

  setId(id: number) {
    this.id = id;
    return this;
  }
}
