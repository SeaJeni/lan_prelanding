module.exports = {
  PRELANDING_STATUSES: [
    'pending',
    'failed',
    'repeat',
    'deployed',
    'deleted_due_to_subscription'
  ],

  PUSH_TASK_STATUSES: [
    'pending',
    'failed',
    'processing',
    'done'
  ],

  SUBSCRIPTION_AGE: [
    '0-3',
    '3-7',
    '7-30',
    'all'
  ],

  SUBSCRIPTION_PRICE_MAP: {
    "trial": process.env.STRIPE_PRICE_TRIAL,
    "standard": process.env.STRIPE_PRICE_STANDARD,
    "pro": process.env.STRIPE_PRICE_PRO,
    "enterprise": process.env.STRIPE_PRICE_ENTERPRISE,
  },

  SUBSCRIPTION_PLAN_LIMITS: {
    "trial": parseInt(process.env.TRIAL_PLAN_LIMIT || 5),
    "standard": parseInt(process.env.STANDARD_PLAN_LIMIT || 7),
    "pro": parseInt(process.env.PRO_PLAN_LIMIT),
    "enterprise": parseInt(process.env.ENTERPRISE_PLAN_LIMIT || 100)
  }
};
