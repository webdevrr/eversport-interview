import { MembershipService } from "@membership/application/membership.service";
import { MembershipRepository } from "@membership/application/ports/persistence/membership.repository";
import { MembershipInMemoryRepository } from "@membership/infrastructure/persistence/in-memory/membership.in-memory.repository";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { MembershipController } from "./membership.controller";

describe("MembershipController", () => {
  let app: INestApplication;
  let membershipService: MembershipService;
  let repository: MembershipRepository;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [MembershipController],
      providers: [
        MembershipService,
        {
          provide: MembershipRepository,
          useClass: MembershipInMemoryRepository
        }
      ]
    }).compile();

    app = moduleFixture.createNestApplication();
    membershipService = moduleFixture.get<MembershipService>(MembershipService);
    repository = moduleFixture.get<MembershipRepository>(MembershipRepository);
    (repository as MembershipInMemoryRepository).clearData();

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe("GET /memberships", () => {
    it("should return array of memberships with periods", async () => {
      const response = await request(app.getHttpServer()).get("/api/v1/posts");
    });
  });

  describe("POST /memberships", () => {});
});
