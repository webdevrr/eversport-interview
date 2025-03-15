import { EversportException } from "@common/error-handling/eversport.exception";
import { InternalErrorCode } from "@common/error-handling/internal-error-code";
import { MembershipInMemoryRepository } from "@membership/infrastructure/persistence/in-memory/membership.in-memory.repository";
import { Test, TestingModule } from "@nestjs/testing";

import { MembershipService } from "./membership.service";
import { MembershipRepository } from "./ports/persistence/membership.repository";
import { BillingInterval } from "./types/billing-interval.enum";
import { PaymentMethod } from "./types/payment-method.enum";

describe("MembershipService", () => {
  let service: MembershipService;
  let repository: MembershipRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembershipService,
        {
          provide: MembershipRepository,
          useClass: MembershipInMemoryRepository
        }
      ]
    }).compile();

    service = module.get<MembershipService>(MembershipService);
    repository = module.get<MembershipRepository>(MembershipRepository);
    (repository as MembershipInMemoryRepository).clearData();
  });

  describe("getMemberships", () => {
    it("should return mapped memberships with periods", async () => {
      await service.createNewMembership({
        name: "Test Membership",
        recurringPrice: 150,
        paymentMethod: PaymentMethod.CASH,
        billingPeriods: 6,
        billingInterval: BillingInterval.MONTHLY,
        validFrom: new Date().toISOString()
      });

      const result = await service.getMemberships();
      expect(result).toHaveLength(1);
      expect(result[0].membership).toMatchObject({
        name: "Test Membership",
        recurringPrice: 150,
        paymentMethod: PaymentMethod.CASH,
        billingPeriods: 6,
        billingInterval: BillingInterval.MONTHLY,
        validFrom: expect.any(String),
        validUntil: expect.any(String),
        state: "active",
        userId: 2000,
        assignedBy: "Admin"
      });

      expect(result[0].periods).toHaveLength(6);
      expect(result[0].periods[0]).toMatchObject({
        start: expect.any(String),
        end: expect.any(String),
        state: "planned"
      });
    });
  });

  describe("createNewMembership", () => {
    it("should throw MISSING_MANDATORY_FIELDS when name is missing", async () => {
      await expect(
        service.createNewMembership({
          recurringPrice: 100,
          paymentMethod: PaymentMethod.CASH,
          billingPeriods: 6,
          billingInterval: BillingInterval.MONTHLY
        } as any)
      ).rejects.toThrow(
        new EversportException(InternalErrorCode.MISSING_MANDATORY_FIELDS)
      );
    });

    it("should throw NEGATIVE_RECURRING_PRICE when price is negative", async () => {
      await expect(
        service.createNewMembership({
          name: "Test",
          recurringPrice: -100,
          paymentMethod: PaymentMethod.CASH,
          billingPeriods: 6,
          billingInterval: BillingInterval.MONTHLY
        })
      ).rejects.toThrow(
        new EversportException(InternalErrorCode.NEGATIVE_RECURRING_PRICE)
      );
    });

    it("should throw CASH_PRICE_BELOW_100 when cash payment and price below 100", async () => {
      await expect(
        service.createNewMembership({
          name: "Test",
          recurringPrice: 50,
          paymentMethod: PaymentMethod.CASH,
          billingPeriods: 6,
          billingInterval: BillingInterval.MONTHLY
        })
      ).rejects.toThrow(
        new EversportException(InternalErrorCode.CASH_PRICE_BELOW_100)
      );
    });

    it("should throw INVALID_BILLING_PERIODS for invalid billing interval", async () => {
      await expect(
        service.createNewMembership({
          name: "Test",
          recurringPrice: 150,
          paymentMethod: PaymentMethod.CASH,
          billingPeriods: 6,
          billingInterval: "invalid" as any
        })
      ).rejects.toThrow(
        new EversportException(InternalErrorCode.INVALID_BILLING_PERIODS)
      );
    });

    it("should throw BILLING_PERIODS_LESS_THAN_6_MONTHS for monthly billing < 6", async () => {
      await expect(
        service.createNewMembership({
          name: "Test",
          recurringPrice: 150,
          paymentMethod: PaymentMethod.CASH,
          billingPeriods: 4,
          billingInterval: BillingInterval.MONTHLY
        })
      ).rejects.toThrow(
        new EversportException(
          InternalErrorCode.BILLING_PERIODS_LESS_THAN_6_MONTHS
        )
      );
    });

    it("should throw BILLING_PERIODS_MORE_THAN_12_MONTHS for monthly billing > 12", async () => {
      await expect(
        service.createNewMembership({
          name: "Test",
          recurringPrice: 150,
          paymentMethod: PaymentMethod.CASH,
          billingPeriods: 13,
          billingInterval: BillingInterval.MONTHLY
        })
      ).rejects.toThrow(
        new EversportException(
          InternalErrorCode.BILLING_PERIODS_MORE_THAN_12_MONTHS
        )
      );
    });

    it("should throw BILLING_PERIODS_LESS_THAN_3_YEARS for yearly billing < 3", async () => {
      await expect(
        service.createNewMembership({
          name: "Test",
          recurringPrice: 150,
          paymentMethod: PaymentMethod.CASH,
          billingPeriods: 2,
          billingInterval: BillingInterval.YEARLY
        })
      ).rejects.toThrow(
        new EversportException(
          InternalErrorCode.BILLING_PERIODS_LESS_THAN_3_YEARS
        )
      );
    });

    it("should throw BILLING_PERIODS_MORE_THAN_10_YEARS for yearly billing > 10", async () => {
      await expect(
        service.createNewMembership({
          name: "Test",
          recurringPrice: 150,
          paymentMethod: PaymentMethod.CASH,
          billingPeriods: 11,
          billingInterval: BillingInterval.YEARLY
        })
      ).rejects.toThrow(
        new EversportException(
          InternalErrorCode.BILLING_PERIODS_MORE_THAN_10_YEARS
        )
      );
    });
  });
});
