const BillingService = require('../services/billingService');
const Logger = require('../helpers/logger');

class BillingController {

  static async createCheckout(req, res) {
    try {
      const userId = req.user.userId;
      const email = req.user.email;
      const { subscriptionType } = req.body;

      if (!subscriptionType) {
        return res.status(400).json({
          message: 'subscriptionType is required',
        });
      }

      const checkoutUrl = await BillingService.createCheckoutSession({
        subscriptionType,
        userId,
        email,
      });

      return res.json({
        checkoutUrl,
      });
    } catch (err) {
      if (err.message === 'Invalid subscriptionType') {
        return res.status(400).json({
          message: 'Invalid subscriptionType',
        });
      }

      Logger.error('[Billing] checkout failed', err);

      return res.status(500).json({
        message: 'Failed to create checkout session',
      });
    }
  }

   static async cancel(req, res) {
    try {
      const userId = req.user.userId;
      const result = await BillingService.cancel(userId);

      return res.json(result);
    } catch (err) {
      if (err.message === 'NO_ACTIVE_SUBSCRIPTION') {
        return res.status(400).json({
          error: 'No active subscription'
        });
      }

      return res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
}

module.exports = BillingController;
