const fs = require('fs/promises');
const path = require('path');
const Logger = require('../helpers/logger');
const HostingApi = require('./HostingApi');
const { buildUrl } = require('../helpers/buildUrl');

const TEMPLATES_ROOT = path.join(__dirname, '../../templates');

class DeploymentService {
    /**
     * @param {Prelanding} prelanding
     * @returns {Promise<string>} deployed URL
     */
    static async deploy(prelanding) {
        const startedAt = Date.now();

        const ctx = {
            prelandingId: prelanding.id,
            subdomain: prelanding.subdomain,
        };

        Logger.info({ ...ctx, step: 'deploy_start' }, 'Deployment started');

        try {
            const templatePath = path.join(
                TEMPLATES_ROOT,
                prelanding.templateName
            );

            Logger.info({ ...ctx, step: 'check_template' }, 'Checking template');

            await DeploymentService.ensureTemplateExists(templatePath);

            const domain = buildUrl(prelanding.subdomain, process.env.URL_PREFIX);
            const deployPath = buildUrl(prelanding.subdomain, process.env.DEPLOY_PATH_PATTERN);

            if (deployPath?.startsWith(process.env.DEPLOY_PATH_PATTERN)) {
                throw new Error('Unsafe path');
            }

            Logger.info(
                { ...ctx, step: 'paths_resolved', domain, deployPath },
                'Paths resolved'
            );

            Logger.info({ ...ctx, step: 'dns_create' }, 'Creating DNS record');
            await HostingApi.createSubdomain(prelanding.subdomain);

            Logger.info({ ...ctx, step: 'copy_files' }, 'Copying template files');
            await DeploymentService.copyRecursive(templatePath, deployPath);

            Logger.info({ ...ctx, step: 'chmod' }, 'Setting permissions');
            await DeploymentService.setPermissions(deployPath);

            const durationMs = Date.now() - startedAt;
            const url = `https://${domain}`;

            Logger.info(
                {
                    ...ctx,
                    step: 'deploy_success',
                    url,
                    durationMs,
                },
                'Deployment finished successfully'
            );

            return url;
        } catch (err) {
            Logger.error(
                {
                    ...ctx,
                    step: 'deploy_error',
                    error: err.stack,
                    durationMs: Date.now() - startedAt,
                },
                'Deployment failed'
            );

            throw err;
        }
    }

    static async remove(prelanding) {

        Logger.info('[CleanUpSubscriptionCron] prelanding', {
            prelandingId: prelanding.id,
            subdomain: prelanding.subdomain,
        });

        try {
            // delete DNS - optional, as it will be needed for future deployments with the same subdomain
            // try {
            //     await HostingApi.deleteSubdomain(prelanding.subdomain);
            // } catch (err) {
            //     Logger.warn('[CleanUpSubscriptionCron] dns_missing', {
            //         subdomain: prelanding.subdomain,
            //     });
            // }

            // delete directory
            const deployPath = buildUrl(prelanding.subdomain, process.env.DEPLOY_PATH_PATTERN);

            if (deployPath?.startsWith(process.env.DEPLOY_PATH_PATTERN)) {
                throw new Error('Unsafe path');
            }

            try {
                await fs.rm(deployPath, { recursive: true, force: true, });
            } catch (err) {
                Logger.warn('[CleanUpSubscriptionCron] dir_missing', {
                    path: deployPath,
                });
            }

            // update database record
            await prelanding.update({
                status: 'deleted_due_to_subscription',
                isActive: false,
            });

            Logger.info('[CleanUpSubscriptionCron] success', {
                prelandingId: prelanding.id,
            });

        } catch (err) {

            Logger.error('[CleanUpSubscriptionCron] error', {
                prelandingId: prelanding.id,
                error: err.message,
            });

            throw err;
        }

    }

    // ---------- helpers ----------

    static async ensureTemplateExists(templatePath) {
        try {
            await fs.access(templatePath);
        } catch {
            throw new Error(`Template not found: ${templatePath}`);
        }
    }

    static async copyRecursive(src, dest) {
        await fs.mkdir(dest, { recursive: true });

        const entries = await fs.readdir(src, { withFileTypes: true });

        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            if (entry.isDirectory()) {
                await DeploymentService.copyRecursive(srcPath, destPath);
            } else {
                await fs.copyFile(srcPath, destPath);
            }
        }
    }

    static async setPermissions(targetPath) {
        // nginx usually runs from www-data
        await DeploymentService.execSafe(`chown -R www-data:www-data ${targetPath}`);
        await DeploymentService.execSafe(`chmod -R 755 ${targetPath}`);
    }

    static async execSafe(command) {
        const { exec } = require('child_process');

        return new Promise((resolve, reject) => {
            exec(command, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = DeploymentService;
