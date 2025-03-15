import { Module } from "@nestjs/common";
import { MembershipService } from "./membership.service";
import { MembershipController } from "@membership/presenter/http/membership.controller";
import { MembershipRepository } from "./ports/persistence/membership.repository";
import { MembershipInMemoryRepository } from "@membership/infrastructure/persistence/in-memory/membership.in-memory.repository";

@Module({
  providers: [
    MembershipService,
    { provide: MembershipRepository, useClass: MembershipInMemoryRepository }
  ],
  controllers: [MembershipController]
})
export class MembershipModule {}
