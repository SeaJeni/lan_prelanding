const { Op } = require('sequelize');
const db = require('../db/models');
const DeploymentService = require('../services/deploymentService');
const Logger = require('../helpers/logger');
const cron = require('node-cron');

module.exports = async function SubscriptionCleanupCron() {
  const BATCH_SIZE = Number(process.env.CLEANUP_BATCH_SIZE) || 100;
  const graceDays = Number(process.env.SUBSCRIPTION_GRACE_DAYS) || 7;
  const CRON_INTERVAL = process.env.DEPLOY_PRELANDINGS_CRON_INTERVAL || '0 3 * * *';

  Logger.info('[CleanUpSubscriptionCron] started', {
    interval: CRON_INTERVAL,
  });

  cron.schedule(CRON_INTERVAL, async () => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - graceDays);

    let totalProcessed = 0;

    while (true) {

      const prelandings = await db.Prelanding.findAll({

        limit: BATCH_SIZE,

        where: {
          isActive: true,
          status: 'deployed',
        },

        include: [
          {
            model: db.User,
            as: 'user',
            attributes: ['id', 'subscriptionStatus', 'subscriptionCanceledAt'],

            where: {
              subscriptionStatus: {
                [Op.in]: ['canceled', 'unpaid']
              },

              subscriptionCanceledAt: {
                [Op.lte]: cutoff
              }
            }
          }
        ]
      });

      if (!prelandings.length) {
        break;
      }

      Logger.info('[CleanUpSubscriptionCron] batch_loaded', {
        batchSize: prelandings.length
      });

      for (const prelanding of prelandings) {
        Logger.info('[CleanUpSubscriptionCron] prelanding', {
          prelandingId: prelanding.id,
          subdomain: prelanding.subdomain,
          userId: prelanding.user?.id
        });

        try {
          await DeploymentService.remove(prelanding);
          totalProcessed++;
        } catch (err) {
          Logger.error('[CleanUpSubscriptionCron] error', {
            prelandingId: prelanding.id,
            subdomain: prelanding.subdomain,
            error: err.message
          });
        }
      }
    }

    Logger.info('[CleanUpSubscriptionCron] finished', {
      processed: totalProcessed
    });
  });
}
