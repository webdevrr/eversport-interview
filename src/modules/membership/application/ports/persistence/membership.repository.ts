import { Membership } from "@membership/domain/membership.entity";

export abstract class MembershipRepository {
  abstract findAllMemberships(): Promise<Membership[]>;

  abstract saveMembership(membership: Membership): Promise<Membership>;
}
