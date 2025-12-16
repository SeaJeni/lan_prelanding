const cron = require('node-cron');
const { Prelanding } = require('../db/models');
const DeploymentService = require('../services/deploymentService');
const Logger = require('../helpers/logger');

cron.schedule('*/5 * * * *', async () => {
    const jobStartedAt = Date.now();
    Logger.info({ step: 'cron_start' }, 'Deploy cron started');

    const prelandings = await Prelanding.findAll({
        where: {
            status: ['pending_deploy', 'failed'],
        },
    });

    for (const p of prelandings) {
        const startedAt = Date.now();

        try {
            Logger.info(
                { prelandingId: p.id, subdomain: p.subdomain, step: 'deploy_start' },
                'Deployment started'
            );

            const url = await DeploymentService.deploy(p);

            await p.update({
                status: 'deployed',
                deployed_at: new Date(),
                error_message: null,
            });

            Logger.info(
                {
                    prelandingId: p.id,
                    subdomain: p.subdomain,
                    url,
                    durationMs: Date.now() - startedAt,
                },
                'Deployment successful'
            );
        } catch (err) {
            await p.update({
                status: 'failed',
                error_message: err.message,
            });

            Logger.error(
                {
                    prelandingId: p.id,
                    subdomain: p.subdomain,
                    error: err.stack,
                    durationMs: Date.now() - startedAt,
                },
                'Deployment failed'
            );
        }
    }

    Logger.info(
        { durationMs: Date.now() - jobStartedAt },
        'Deploy cron finished'
    );
});
