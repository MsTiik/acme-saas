export const mockTeamMembers = [
  { id: "tm_001", name: "Jamie Lee", email: "jamie@acme.co", initials: "JL", role: "Admin", lastActive: "2026-04-25T09:45:00Z" },
  { id: "tm_002", name: "Sam Kim", email: "sam@acme.co", initials: "SK", role: "Admin", lastActive: "2026-04-25T08:30:00Z" },
  { id: "tm_003", name: "Alex Rivera", email: "alex@acme.co", initials: "AR", role: "Editor", lastActive: "2026-04-24T17:15:00Z" },
  { id: "tm_004", name: "Morgan Chen", email: "morgan@acme.co", initials: "MC", role: "Editor", lastActive: "2026-04-24T14:00:00Z" },
  { id: "tm_005", name: "Taylor Nguyen", email: "taylor@acme.co", initials: "TN", role: "Editor", lastActive: "2026-04-23T11:30:00Z" },
  { id: "tm_006", name: "Priya Shah", email: "priya@acme.co", initials: "PS", role: "Viewer", lastActive: "2026-04-22T16:45:00Z" },
  { id: "tm_007", name: "Liam O'Connor", email: "liam@acme.co", initials: "LO", role: "Viewer", lastActive: "2026-04-21T10:00:00Z" },
  { id: "tm_008", name: "Nadia Hassan", email: "nadia@acme.co", initials: "NH", role: "Viewer", lastActive: "2026-04-19T09:20:00Z" },
];

export const mockApiKeys = [
  { id: "key_001", name: "Production API", prefix: "acme_live_sk••••••", created: "2025-11-01", lastUsed: "2026-04-25T09:58:00Z", status: "Active" },
  { id: "key_002", name: "Staging API", prefix: "acme_test_sk••••••", created: "2025-11-01", lastUsed: "2026-04-24T14:22:00Z", status: "Active" },
  { id: "key_003", name: "Analytics Webhook", prefix: "acme_live_sk••••••", created: "2026-02-14", lastUsed: "2026-04-20T08:00:00Z", status: "Active" },
];

export const mockActivityFeed = [
  { id: "act_001", user: "Jamie Lee", initials: "JL", action: "upgraded the workspace to Growth plan", category: "Billing", timestamp: "2026-04-25T09:30:00Z" },
  { id: "act_002", user: "Sam Kim", initials: "SK", action: "invited 3 new team members", category: "Team", timestamp: "2026-04-25T08:15:00Z" },
  { id: "act_003", user: "Alex Rivera", initials: "AR", action: "enabled SSO for the workspace", category: "Security", timestamp: "2026-04-24T17:40:00Z" },
  { id: "act_004", user: "Morgan Chen", initials: "MC", action: "exported Q1 customer report", category: "Product", timestamp: "2026-04-24T14:00:00Z" },
  { id: "act_005", user: "Priya Shah", initials: "PS", action: "updated billing email to billing@acme.co", category: "Billing", timestamp: "2026-04-23T11:20:00Z" },
  { id: "act_006", user: "Taylor Nguyen", initials: "TN", action: "connected Notion integration", category: "Product", timestamp: "2026-04-22T15:10:00Z" },
  { id: "act_007", user: "Nadia Hassan", initials: "NH", action: "revoked API key acme_test_sk••••••", category: "Security", timestamp: "2026-04-21T09:50:00Z" },
  { id: "act_008", user: "Liam O'Connor", initials: "LO", action: "added Northwind Logistics as customer", category: "Product", timestamp: "2026-04-20T13:30:00Z" },
];
