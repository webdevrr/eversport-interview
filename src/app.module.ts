import { MembershipModule } from "@membership/application/membership.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [MembershipModule]
})
export class AppModule {}
