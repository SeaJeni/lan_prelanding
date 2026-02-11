const db = require('../db/models');
const Logger = require('../helpers/logger');
const { Op } = require('sequelize');
const sendPush = require('./push/sendPush');


class PushTaskService {
  static async runNextTask() {
    const task = await db.PushNotificationTask.findOne({
      where: { status: 'pending' },
      order: [['createdAt', 'ASC']],
    });

    if (!task) {
      return null;
    }

    const updated = await db.PushNotificationTask.update(
      { status: 'processing' },
      {
        where: {
           id: task.id,
          status: 'pending',
        },
      }
    );

    if (updated[0] === 0) {
      return null;
    }

    try {
      await this.execute(task);
      await task.update({ status: 'done' });

      return {
        taskId: task.id,
        status: 'done',
      };
    } catch (err) {
      await task.update({
        status: 'failed',
        error: err.message,
      });
    
      throw err;
    }
  }

  static async execute(task) {
    Logger.info('[PushTaskService] start', { taskId: task.id });

    const prelandings = await db.Prelanding.findAll({
      where: {
        ...(task.prelandingName && { subdomain: task.prelandingName }),
        ...(task.geo && { geo: task.geo }),
        ...(task.vertical && { vertical: task.vertical }),
      },
      attributes: ['id'],
    });

    if (!prelandings.length) {
      Logger.info('[PushTaskService] no prelandings', { taskId: task.id });
      return;
    } else {
      Logger.info('[PushTaskService] prelandings found', {
        taskId: task.id,
        count: prelandings.length,
      });
    }

    const prelandingIds = prelandings.map(p => p.id);
    const ageCondition = this.buildAgeCondition(task.subscriptionAge);
    
    const where = {
      prelandingId: { [Op.in]: prelandingIds },
      ...(ageCondition || {}),
    };

    const subscriptions = await db.PushSubscription.findAll({ where });
   
    Logger.info('[PushTaskService] subscriptions loaded', {
      taskId: task.id,
      count: subscriptions.length,
    });

    const filtered = subscriptions.filter(sub => {
      if (!task.device) return true;
      return PushTaskService.detectBrowser(sub.endpoint) === task.device;
    });

    Logger.info('[PushTaskService] subscriptions filtered', {
      taskId: task.id,
      device: task.device ?? 'any',
      count: filtered.length,
    });

    const batchSize = Number(process.env.PUSH_SEND_BATCH_SIZE) || 50;

    for (let i = 0; i < filtered.length; i += batchSize) {
      const batch = filtered.slice(i, i + batchSize);

      Logger.info('[PushTaskService] sending batch', {
        taskId: task.id,
        batch: `${i}-${i + batch.length}`,
      });

      await Promise.all(
        batch.map(sub => sendPush(sub, task))
      );

      await this.delay(200);
    }

    Logger.info('[PushTaskService] finished', { taskId: task.id });
  }

  static detectBrowser(endpoint) {
  if (!endpoint) return null; 

    if (endpoint.includes('fcm.googleapis.com')) return 'chrome';
    if (endpoint.includes('push.services.mozilla.com')) return 'firefox';
    if (endpoint.includes('web.push.apple.com')) return 'safari';

    return null;
  }

  static buildAgeCondition(age) {
    if (!age || age === 'all') {
      return null;
    }

    const [from, to] = age.split('-').map(Number);

    if (Number.isNaN(from) || Number.isNaN(to)) {
      throw new Error(`Invalid subscriptionAge: ${age}`);
    }

    const now = new Date();
    const fromDate = new Date(now);
    fromDate.setDate(now.getDate() - to);
    const toDate = new Date(now);
    toDate.setDate(now.getDate() - from);

    return {
      createdAt: {
        [Op.between]: [fromDate, toDate],
      },
    };
  }

  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = PushTaskService;