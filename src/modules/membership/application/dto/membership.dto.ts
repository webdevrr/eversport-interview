export class MembershipDto {
  constructor(
    public readonly id: number,
    public readonly uuid: string,
    public readonly name: string,
    public readonly userId: number,
    public readonly recurringPrice: number,
    public readonly validFrom: string,
    public readonly validUntil: string,
    public readonly state: string,
    public readonly assignedBy: string,
    public readonly paymentMethod: string,
    public readonly billingInterval: string,
    public readonly billingPeriods: number
  ) {}
}
