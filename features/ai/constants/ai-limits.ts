/**
 * Input boundaries only. Durable request and spending limits will be selected
 * before provider access is enabled.
 */
export const AI_MAX_REQUEST_BYTES = 16_000;
export const AI_MAX_MESSAGE_COUNT = 12;
export const AI_MAX_MESSAGE_CHARACTERS = 2_000;
export const AI_MAX_TOTAL_MESSAGE_CHARACTERS = 8_000;

export type AiLimitContracts = {
  readonly maximumInputBytes: number;
  readonly maximumOutputBytes: number;
  readonly perUserRequestLimit: "future";
  readonly perIpRequestLimit: "future";
  readonly dailyUserQuota: "future";
  readonly monthlyUsageQuota: "future";
  readonly circuitBreaker: "future";
};

export const aiLimitContracts: AiLimitContracts = {
  maximumInputBytes: AI_MAX_REQUEST_BYTES,
  maximumOutputBytes: 16_000,
  perUserRequestLimit: "future",
  perIpRequestLimit: "future",
  dailyUserQuota: "future",
  monthlyUsageQuota: "future",
  circuitBreaker: "future",
};
