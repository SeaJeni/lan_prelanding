const { PushNotificationTask } = require('../db/models');

class PushTaskService {
  static async runNextTask() {
    const task = await PushNotificationTask.findOne({
      where: { status: 'pending' },
      order: [['createdAt', 'ASC']],
    });

    if (!task) {
      return null;
    }

    const updated = await PushNotificationTask.update(
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
      await this.executeTask(task);
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

  static async executeTask(task) {
    const where = {};

    if (task.prelandingId) where.prelandingId = task.prelandingId;
    if (task.geo) where.geo = task.geo;
    if (task.vertical) where.vertical = task.vertical;
    if (task.browser) where.browser_name = task.browser;

    const subscriptions = await PushNotificationTask.findAll({ where });

    await this.sendInBatches(subscriptions, task);
  }

  static async sendInBatches(subscriptions, task) {
    const batchSize = Number(process.env.PUSH_SEND_BATCH_SIZE || 50);

    for (let i = 0; i < subscriptions.length; i += batchSize) {
      const batch = subscriptions.slice(i, i + batchSize);

      await Promise.all(
        batch.map((sub) => this.sendPush(sub, task))
      );

      // optional delay
      await this.delay(300);
    }
  }
  static async sendPush(subscription, task) {
    // тут будет реальный push provider
    console.log(
      `[PUSH] to ${subscription.endpoint} task=${task.id}`
    );

    // имитация
    return true;
  }

  static delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
}

module.exports = PushTaskService;