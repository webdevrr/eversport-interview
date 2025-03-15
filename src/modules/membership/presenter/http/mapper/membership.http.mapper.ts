import { MembershipWithPeriodsDto } from "@membership/application/dto/membership-with-periods.dto";

import { CreateMembershipResponseDto } from "../dto/create-membership.response.dto";
export class MembershipHttpMapper {
  static toCreateMembershipResponseDto(
    dto: MembershipWithPeriodsDto
  ): CreateMembershipResponseDto {
    return new CreateMembershipResponseDto(dto.membership, dto.periods);
  }
}
