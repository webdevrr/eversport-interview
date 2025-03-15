import { MembershipService } from "@membership/application/membership.service";
import { MembershipRepository } from "@membership/application/ports/persistence/membership.repository";
import { BillingInterval } from "@membership/application/types/billing-interval.enum";
import { PaymentMethod } from "@membership/application/types/payment-method.enum";
import { MembershipInMemoryRepository } from "@membership/infrastructure/persistence/in-memory/membership.in-memory.repository";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";

import { MembershipController } from "./membership.controller";

describe("MembershipController", () => {
  let app: INestApplication;
  let repository: MembershipRepository;
  let service: MembershipService;

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
    repository = moduleFixture.get<MembershipRepository>(MembershipRepository);
    (repository as MembershipInMemoryRepository).clearData();
    service = moduleFixture.get<MembershipService>(MembershipService);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe("GET /memberships", () => {
    it("should return empty array of memberships if no membership exist", async () => {
      const response = await request(app.getHttpServer()).get("/memberships");

      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body).toEqual([]);
    });

    it("should return populated array when memberships exist", async () => {
      await service.createNewMembership({
        name: "Test Membership",
        recurringPrice: 150,
        paymentMethod: PaymentMethod.CASH,
        billingPeriods: 6,
        billingInterval: BillingInterval.MONTHLY,
        validFrom: new Date().toISOString()
      });

      const response = await request(app.getHttpServer()).get("/memberships");

      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].membership).toBeDefined();
      expect(response.body[0].periods).toBeDefined();
    });
  });

  describe("POST /memberships", () => {
    it("should create monthly membership successfully", async () => {
      const membershipData = {
        name: "Monthly Membership",
        recurringPrice: 150,
        paymentMethod: PaymentMethod.CASH,
        billingPeriods: 6,
        billingInterval: BillingInterval.MONTHLY,
        validFrom: new Date().toISOString()
      };

      const response = await request(app.getHttpServer())
        .post("/memberships")
        .send(membershipData);

      expect(response.status).toBe(201);
      expect(response.body.membership).toMatchObject({
        id: expect.any(Number),
        uuid: expect.stringMatching(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
        ),
        name: membershipData.name,
        userId: expect.any(Number),
        recurringPrice: membershipData.recurringPrice,
        validFrom: membershipData.validFrom,
        validUntil: expect.any(String),
        state: "active",
        assignedBy: "Admin",
        paymentMethod: "cash",
        billingInterval: "monthly",
        billingPeriods: 6
      });
      expect(response.body.membershipPeriods).toHaveLength(6);
      expect(response.body.membershipPeriods[0]).toMatchObject({
        id: expect.any(Number),
        uuid: expect.stringMatching(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
        ),
        membership: expect.any(Number),
        start: expect.any(String),
        end: expect.any(String),
        state: "planned"
      });
    });

    it("should create yearly membership successfully", async () => {
      const membershipData = {
        name: "Yearly Membership",
        recurringPrice: 1000,
        paymentMethod: PaymentMethod.CARD,
        billingPeriods: 3,
        billingInterval: BillingInterval.YEARLY,
        validFrom: new Date().toISOString()
      };

      const response = await request(app.getHttpServer())
        .post("/memberships")
        .send(membershipData);

      expect(response.status).toBe(201);
      expect(response.body.membership).toMatchObject({
        name: membershipData.name,
        recurringPrice: membershipData.recurringPrice
      });
    });

    it("should fail with 400 when name is missing", async () => {
      const response = await request(app.getHttpServer())
        .post("/memberships")
        .send({
          recurringPrice: 150,
          paymentMethod: PaymentMethod.CASH,
          billingPeriods: 6,
          billingInterval: BillingInterval.MONTHLY
        });

      expect(response.status).toBe(400);
    });

    it("should fail with 400 when price is negative", async () => {
      const response = await request(app.getHttpServer())
        .post("/memberships")
        .send({
          name: "Test",
          recurringPrice: -100,
          paymentMethod: PaymentMethod.CASH,
          billingPeriods: 6,
          billingInterval: BillingInterval.MONTHLY
        });

      expect(response.status).toBe(400);
    });

    it("should fail with 400 when cash payment is below 100", async () => {
      const response = await request(app.getHttpServer())
        .post("/memberships")
        .send({
          name: "Test",
          recurringPrice: 50,
          paymentMethod: PaymentMethod.CASH,
          billingPeriods: 6,
          billingInterval: BillingInterval.MONTHLY
        });

      expect(response.status).toBe(400);
    });

    it("should fail with 400 when billing interval is invalid", async () => {
      const response = await request(app.getHttpServer())
        .post("/memberships")
        .send({
          name: "Test",
          recurringPrice: 150,
          paymentMethod: PaymentMethod.CASH,
          billingPeriods: 6,
          billingInterval: "invalid"
        });

      expect(response.status).toBe(400);
    });
  });
});
