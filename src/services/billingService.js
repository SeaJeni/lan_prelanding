const stripe = require('./stripeClient');

const priceMap = {
  trial: process.env.STRIPE_PRICE_TRIAL,
  standard: process.env.STRIPE_PRICE_STANDARD,
  pro: process.env.STRIPE_PRICE_PRO,
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE,
};

class BillingService {

  static getPriceId(subscriptionType) {
    const priceId = priceMap[subscriptionType];

    if (!priceId) {
      throw new Error('Invalid subscriptionType');
    }

    return priceId;
  }

  static async createCheckoutSession({ subscriptionType, userId, email }) {

    const priceId = this.getPriceId(subscriptionType);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',

      customer_email: email,

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,

      metadata: {
        userId: String(userId),
        subscriptionType,
      },
    });

    return session.url;
  }
}

module.exports = BillingService;
