import { LoggingMiddleware } from "@common/middleware/logging.middleware";
import { MembershipModule } from "@membership/application/membership.module";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";

@Module({
  imports: [MembershipModule]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes("*");
  }
}
