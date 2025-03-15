import { MembershipWithPeriodsDto } from "@membership/application/dto/membership-with-periods.dto";
import { MembershipService } from "@membership/application/membership.service";
import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateMembershipRequestDto } from "./dto/create-membership.request.dto";
import { MembershipHttpMapper } from "./mapper/membership.http.mapper";
import { CreateMembershipResponseDto } from "./dto/create-membership.response.dto";

@Controller("/memberships")
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Get("/")
  async getMemberships(): Promise<MembershipWithPeriodsDto[]> {
    return await this.membershipService.getMemberships();
  }

  @Post("/")
  async createMembership(
    @Body() createMembershipRequestDto: CreateMembershipRequestDto
  ): Promise<CreateMembershipResponseDto> {
    const membership = await this.membershipService.createNewMembership(
      createMembershipRequestDto
    );
    return MembershipHttpMapper.toCreateMembershipResponseDto(membership);
  }
}
