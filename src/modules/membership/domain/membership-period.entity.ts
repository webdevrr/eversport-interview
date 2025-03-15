export class MembershipPeriod {
  id: number;
  uuid: string;
  membership: number;
  start: Date;
  end: Date;
  state: string;

  constructor(
    id: number,
    uuid: string,
    membership: number,
    start: Date,
    end: Date,
    state: string
  ) {
    this.id = id;
    this.uuid = uuid;
    this.membership = membership;
    this.start = start;
    this.end = end;
    this.state = state;
  }
}
