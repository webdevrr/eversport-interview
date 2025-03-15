export class MembershipPeriodDto {
  constructor(
    public readonly id: number,
    public readonly uuid: string,
    public readonly membership: number,
    public readonly start: Date,
    public readonly end: Date,
    public readonly state: string
  ) {}
}
