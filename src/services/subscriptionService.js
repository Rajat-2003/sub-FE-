import api from "./api";

export const subscriptionService = {
  // Get all subscriptions for current user
  getAllSubscriptions: async () => {
    const response = await api.get("/subscriptions");
    return response.data;
  },

  // Get subscription by ID
  getSubscriptionById: async (id) => {
    const response = await api.get(`/subscriptions/${id}`);
    return response.data;
  },

  // Create new subscription
  createSubscription: async (subscriptionData) => {
    const response = await api.post("/subscriptions", subscriptionData);
    return response.data;
  },

  // Update subscription
  updateSubscription: async (id, subscriptionData) => {
    const response = await api.put(`/subscriptions/${id}`, subscriptionData);
    return response.data;
  },

  // Delete subscription
  deleteSubscription: async (id) => {
    await api.delete(`/subscriptions/${id}`);
  },

  // Get dashboard data
  getDashboardData: async () => {
    const response = await api.get("/dashboard/total-monthly-cost");
    return response.data;
  },

  // Get upcoming renewals
  getUpcomingRenewals: async (days = 7) => {
    const response = await api.get(`/dashboard/upcoming-renewals?days=${days}`);
    return response.data;
  },
};

// Subscription categories and billing cycles for forms
export const CATEGORIES = [
  "ENTERTAINMENT",
  "PRODUCTIVITY",
  "SOFTWARE",
  "GAMING",
  "UTILITY",
  "OTHER",
];

export const BILLING_CYCLES = ["MONTHLY", "QUARTERLY", "ANNUAL", "BIANNUAL"];




