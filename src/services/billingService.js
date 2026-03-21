const stripe = require('./stripeClient');
const db = require('../db/models');
const { SUBSCRIPTION_PRICE_MAP } = require('../constants/enums');

class BillingService {

  static getPriceId(subscriptionType) {
    const priceId = SUBSCRIPTION_PRICE_MAP[subscriptionType];

    if (!priceId) {
      throw new Error('Invalid subscriptionType');
    }

    return priceId;
  }

  static async createCheckoutSession({ subscriptionType, userId, email }) {
    const priceId = this.getPriceId(subscriptionType);
    const user = await db.User.findByPk(userId);
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email
      });

      customerId = customer.id;

      await user.update({
        stripeCustomerId: customerId
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,

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

  static async cancel(userId) {
    const user = await db.User.findByPk(userId);

    if (
      !user ||
      !user.stripeSubscriptionId ||
      user.subscriptionStatus !== 'active'
    ) {
      throw new Error('NO_ACTIVE_SUBSCRIPTION');
    }

    const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);

    if (subscription.cancel_at_period_end) {
      return {
        success: true,
        message: 'Subscription already scheduled for cancellation'
      };
    }

    await stripe.subscriptions.update(
      user.stripeSubscriptionId,
      {
        cancel_at_period_end: true
      }
    );

    return {
      success: true,
      message:
        'Subscription will be canceled at the end of the billing period'
    };

  }

}

module.exports = BillingService;
