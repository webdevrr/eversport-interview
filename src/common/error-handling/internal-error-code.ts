export enum InternalErrorCode {
  MISSING_MANDATORY_FIELDS = "missingMandatoryFields",
  NEGATIVE_RECURRING_PRICE = "negativeRecurringPrice",
  CASH_PRICE_BELOW_100 = "cashPriceBelow100",
  BILLING_PERIODS_MORE_THAN_12_MONTHS = "billingPeriodsMoreThan12Months",
  BILLING_PERIODS_LESS_THAN_6_MONTHS = "billingPeriodsLessThan6Months",
  BILLING_PERIODS_MORE_THAN_10_YEARS = "billingPeriodsMoreThan10Years",
  BILLING_PERIODS_LESS_THAN_3_YEARS = "billingPeriodsLessThan3Years",
  INVALID_BILLING_PERIODS = "invalidBillingPeriods"
}
