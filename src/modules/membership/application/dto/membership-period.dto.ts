export class MembershipPeriodDto {
  constructor(
    public readonly id: number,
    public readonly uuid: string,
    public readonly membership: number,
    public readonly start: string,
    public readonly end: string,
    public readonly state: string
  ) {}
}
