export const stripeCustomer = {
  id: "cus_Acme0001",
  email: "ops@acme.co",
  name: "Acme Corp",
  plan: "growth",
  mrr: 4900,
  currency: "usd",
  status: "active",
  currentPeriodEnd: "2026-05-24T00:00:00Z",
};

export const stripeInvoices = [
  { id: "inv_001", amount: 4900, currency: "usd", status: "paid", date: "2026-04-01" },
  { id: "inv_002", amount: 4900, currency: "usd", status: "paid", date: "2026-03-01" },
  { id: "inv_003", amount: 2900, currency: "usd", status: "paid", date: "2026-02-01" },
];
