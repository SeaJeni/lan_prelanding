const db = require('../db/models');
const Logger = require('../helpers/logger');

class StripeWebhookService {

  static async handleCheckoutCompleted(session) {

    const userId = session.metadata?.userId;
    const stripeCustomerId = session.customer;

    if (!userId) {
      Logger.warn('[StripeWebhook] missing userId in metadata');
      return;
    }

    const user = await db.User.findByPk(userId);

    if (!user) {
      Logger.warn('[StripeWebhook] user not found', { userId });
      return;
    }

    await user.update({
      stripeCustomerId,
    });

    Logger.info('[StripeWebhook] customer linked', {
      userId,
      stripeCustomerId,
    });
  }

  static async handleSubscriptionCreated(subscription) {

    const stripeCustomerId = subscription.customer;
    const stripeSubscriptionId = subscription.id;
    const status = subscription.status;

    const user = await db.User.findOne({
      where: { stripeCustomerId },
    });

    if (!user) {
      Logger.warn('[StripeWebhook] user not found by customer', {
        stripeCustomerId,
      });
      return;
    }

    const subscriptionType =
      subscription.items.data[0].price.id;

    await user.update({
      subscriptionType,
      subscriptionStatus: status,
      subscriptionStartedAt: new Date(),
      stripeSubscriptionId,
    });

    Logger.info('[StripeWebhook] subscription created', {
      userId: user.id,
      status,
    });
  }

  static async handleSubscriptionUpdated(subscription) {

    const stripeCustomerId = subscription.customer;
    const status = subscription.status;

    const user = await db.User.findOne({
      where: { stripeCustomerId },
    });

    if (!user) return;

    await user.update({
      subscriptionStatus: status,
    });

    Logger.info('[StripeWebhook] subscription updated', {
      userId: user.id,
      status,
    });
  }

  static async handleSubscriptionDeleted(subscription) {

    const stripeCustomerId = subscription.customer;

    const user = await db.User.findOne({
      where: { stripeCustomerId },
    });

    if (!user) return;

    await user.update({
      subscriptionStatus: 'canceled',
      subscriptionType: null,
      stripeSubscriptionId: null,
    });

    Logger.info('[StripeWebhook] subscription canceled', {
      userId: user.id,
    });
  }

  static async handleSubscriptionDeleted(subscription) {

    const stripeCustomerId = subscription.customer;

    const user = await db.User.findOne({
      where: { stripeCustomerId },
    });

    if (!user) return;

    await user.update({
      subscriptionStatus: 'canceled',
      subscriptionCanceledAt: new Date(),
    });

    Logger.info('[StripeWebhook] subscription canceled', {
      userId: user.id,
    });
  }

}

module.exports = StripeWebhookService;
