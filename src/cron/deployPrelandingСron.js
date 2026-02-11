const cron = require('node-cron');
const Logger = require('../helpers/logger');
const DeploymentService = require('../services/deploymentService');
const db = require('../db/models');

const CRON_INTERVAL =
  process.env.DEPLOY_PRELANDINGS_CRON_INTERVAL || '*/5 * * * *';

module.exports = function startDeployPrelandingsCron() {
  Logger.info('[DeployPrelandingsCron] started', {
    interval: CRON_INTERVAL,
  });

  cron.schedule(CRON_INTERVAL, async () => {
    const startedAt = Date.now();

    Logger.info('[DeployPrelandingsCron] tick');

    try {
      const prelandings = await db.Prelanding.findAll({
        where: {
          status: 'pending',
        },
        limit: parseInt(process.env.DEPLOY_PRELANDINGS_BATCH_SIZE) || 10,
      });

      if (!prelandings.length) {
        Logger.info('[DeployPrelandingsCron] no prelandings to deploy');
        return;
      }

      Logger.info('[DeployPrelandingsCron] found prelandings', {
        count: prelandings.length,
      });

      for (const prelanding of prelandings) {
        const prelandingStartedAt = Date.now();

        Logger.info('[DeployPrelandingsCron] deploy started', {
          prelandingId: prelanding.id,
          subdomain: prelanding.subdomain,
        });

        try {
          await DeploymentService.deploy(prelanding);

          await prelanding.update({
            status: 'deployed',
            deployed_at: new Date(),
            error_message: null,
          });

          Logger.info('[DeployPrelandingsCron] deploy success', {
            prelandingId: prelanding.id,
            subdomain: prelanding.subdomain,
            durationMs: Date.now() - prelandingStartedAt,
          });
        } catch (err) {
          await prelanding.update({
            status: 'failed',
            error_message: err.message,
          });

          Logger.error('[DeployPrelandingsCron] deploy failed', {
            prelandingId: prelanding.id,
            subdomain: prelanding.subdomain,
            error: err.message,
            stack: err.stack,
          });
        }
      }

      Logger.info('[DeployPrelandingsCron] tick finished', {
        durationMs: Date.now() - startedAt,
      });
    } catch (err) {
      Logger.error('[DeployPrelandingsCron] fatal error', {
        error: err.message,
        stack: err.stack,
      });
    }
  });
};
