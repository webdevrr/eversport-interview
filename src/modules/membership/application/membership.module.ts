import { MembershipInMemoryRepository } from "@membership/infrastructure/persistence/in-memory/membership.in-memory.repository";
import { MembershipController } from "@membership/presenter/http/membership.controller";
import { Module } from "@nestjs/common";

import { MembershipService } from "./membership.service";
import { MembershipRepository } from "./ports/persistence/membership.repository";

@Module({
  providers: [
    MembershipService,
    { provide: MembershipRepository, useClass: MembershipInMemoryRepository }
  ],
  controllers: [MembershipController]
})
export class MembershipModule {}
