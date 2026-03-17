const stripe = require('../services/stripeClient');
const StripeWebhookService = require('../services/stripeWebhookService');
const Logger = require('../helpers/logger');

class BillingWebhookController {

  static async handle(req, res) {
    const signature = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      Logger.error('[StripeWebhook] signature failed', err.message);

      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {

        case 'checkout.session.completed':
          await StripeWebhookService.handleCheckoutCompleted(event.data.object);
          break;

        case 'customer.subscription.created':
          await StripeWebhookService.handleSubscriptionCreated(event.data.object);
          break;

        case 'customer.subscription.updated':
          await StripeWebhookService.handleSubscriptionUpdated(event.data.object);
          break;

        case 'customer.subscription.deleted':
          await StripeWebhookService.handleSubscriptionDeleted(event.data.object);
          break;

        default:
          Logger.info('[StripeWebhook] unhandled event', {
            type: event.type,
          });
      }

      res.json({ received: true });
    } catch (err) {
      
      Logger.error('[StripeWebhook] processing error', err);

      res.status(500).json({
        message: 'Webhook processing failed',
      });
    }
  }
}

module.exports = BillingWebhookController;
