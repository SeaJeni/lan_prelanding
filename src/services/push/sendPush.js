const webpush = require('./webPush');
const Logger = require('../../helpers/logger');

async function sendPush(subscription, task) {
  const payload = JSON.stringify({
    title: task.title,
    body: task.text,
    icon: task.icon,
    image: task.image,
    url: task.url,
  });

  const pushSubscription = {
    endpoint: subscription.endpoint,
    keys: {
      auth: subscription.auth_key,
      p256dh: subscription.p256dh_key,
    },
  };

  try {
    await webpush.sendNotification(pushSubscription, payload);
  } catch (err) {
    Logger.error('[sendPush] failed', {
      endpoint: subscription.endpoint,
      error: err.message,
    });

    throw err;
  }
}

module.exports = sendPush;
