// ---------------------------------------------------------------------------
// Acme Events – telemetry, Intercom helpers, and webhook utilities
// ---------------------------------------------------------------------------

/** Well-known Intercom event names used during onboarding. */
export type IntercomEventName =
  | "trial_started"
  | "user_signed_up"
  | "onboarding_step_completed"
  | "onboarding_completed"
  | "webhook_registered";

/** Payload shape sent with every Intercom event. */
export interface IntercomEventPayload {
  userId?: string;
  email?: string;
  trialEndsAt?: string;
  step?: string;
  webhookUrl?: string;
  [key: string]: unknown;
}

/** Structured error raised by event / webhook helpers. */
export class AcmeEventError extends Error {
  public readonly code: string;
  public readonly context: Record<string, unknown>;

  constructor(
    message: string,
    code: string,
    context: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = "AcmeEventError";
    this.code = code;
    this.context = context;
  }
}

// ---------------------------------------------------------------------------
// Core event tracking
// ---------------------------------------------------------------------------

export function trackEvent(name: string, props?: Record<string, unknown>) {
  console.log("[acme-events]", name, props);
}

// ---------------------------------------------------------------------------
// Enhanced helpers – gated behind `enhanced_error_handling_and_docs`
// ---------------------------------------------------------------------------

/**
 * Emit a typed Intercom event (e.g. `trial_started`).
 *
 * In production this would call the Intercom Track Events API; here we log
 * through the unified `trackEvent` helper.
 */
export function trackIntercomEvent(
  event: IntercomEventName,
  payload: IntercomEventPayload = {},
): void {
  trackEvent(`intercom.${event}`, {
    ...payload,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Report an operational error in a structured way so dashboards can triage.
 *
 * Mirrors the pattern Sam suggested for better error handling on the
 * onboarding flow.
 */
export function reportError(
  message: string,
  code: string,
  context: Record<string, unknown> = {},
): AcmeEventError {
  const err = new AcmeEventError(message, code, context);
  trackEvent("error.reported", {
    message: err.message,
    code: err.code,
    ...err.context,
    timestamp: new Date().toISOString(),
  });
  return err;
}

// ---------------------------------------------------------------------------
// Webhook registration utilities – avoids API polling per Sam's feedback
// ---------------------------------------------------------------------------

export interface WebhookConfig {
  url: string;
  events: string[];
  secret?: string;
}

export interface WebhookRegistrationResult {
  id: string;
  status: "active" | "failed";
  registeredAt: string;
  events: string[];
}

/**
 * Register a webhook endpoint so downstream systems push updates instead of
 * requiring polling.
 *
 * Returns a mock registration result for the demo scaffold.
 */
export function registerWebhook(
  config: WebhookConfig,
): WebhookRegistrationResult {
  if (!config.url) {
    throw reportError(
      "Webhook URL is required",
      "WEBHOOK_URL_MISSING",
      { config },
    );
  }
  if (config.events.length === 0) {
    throw reportError(
      "At least one event type must be specified",
      "WEBHOOK_EVENTS_EMPTY",
      { config },
    );
  }

  const result: WebhookRegistrationResult = {
    id: `wh_${Date.now()}`,
    status: "active",
    registeredAt: new Date().toISOString(),
    events: config.events,
  };

  trackEvent("webhook.registered", {
    webhookId: result.id,
    url: config.url,
    events: config.events,
  });

  trackIntercomEvent("webhook_registered", { webhookUrl: config.url });

  return result;
}

/**
 * Process an inbound webhook payload.
 *
 * Validates the event name and delegates to `trackEvent` so existing
 * telemetry pipelines pick it up.
 */
export function handleWebhookEvent(
  eventName: string,
  payload: Record<string, unknown>,
): void {
  if (!eventName) {
    throw reportError(
      "Webhook event name is required",
      "WEBHOOK_EVENT_NAME_MISSING",
      { payload },
    );
  }

  trackEvent(`webhook.received.${eventName}`, {
    ...payload,
    receivedAt: new Date().toISOString(),
  });
}
