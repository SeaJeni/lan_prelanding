const cron = require('node-cron');
const PushTaskService = require('../services/PushTaskService');
const Logger = require('../helpers/logger');

module.exports = function startPushTaskCron() {
  const interval = process.env.PUSH_TASK_CRON_INTERVAL || '*/60 * * * *'; 

  if (!interval) {
    Logger.error('[PushTaskCron] PUSH_TASK_CRON_INTERVAL is not set');
    return;
  }

  Logger.info('[PushTaskCron] started', {
    interval,
  });

  cron.schedule(interval, async () => {
    const startedAt = Date.now();

    Logger.info('[PushTaskCron] tick started');

    try {
      const result = await PushTaskService.runNextTask();

      Logger.info('[PushTaskCron] tick finished', {
        durationMs: Date.now() - startedAt,
        result: result || 'no pending tasks',
      });
    } catch (err) {
      Logger.error('[PushTaskCron] tick failed', {
        message: err.message,
        stack: err.stack,
        durationMs: Date.now() - startedAt,
      });
    }
  });
};
