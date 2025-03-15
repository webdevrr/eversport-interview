export class MembershipPeriod {
  id: number;
  uuid: string;
  membership: number;
  start: string;
  end: string;
  state: string;

  constructor(uuid: string, start: string, end: string, state: string) {
    this.uuid = uuid;
    this.start = start;
    this.end = end;
    this.state = state;
  }

  getId() {
    return this.id;
  }

  getUUID() {
    return this.uuid;
  }

  getMembership() {
    return this.membership;
  }

  setMembership(membership: number) {
    this.membership = membership;
    return this;
  }

  setId(id: number) {
    this.id = id;
    return this;
  }
}
