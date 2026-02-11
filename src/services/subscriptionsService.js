const db = require("../db/models");
const { isValidString, isDuplicate, isValidEmail, isValidObject } = require("../helpers/validation");
const PrelandingService = require("../services/prelandingService");

module.exports = {
  async createEmailSubscription(data, subdomain) {
    const { email } = data;
     
    isValidString(email);
    isValidEmail(email);
    await isDuplicate("EmailSubscription", "email", email);
    const prelanding = await PrelandingService.getPrelandingBySubdomain(subdomain);
    if (!prelanding) {
      throw new Error('Prelanding not found');
    }
    const item = await db.EmailSubscription.create({ email, prelandingId: prelanding.id });
    return item;
  },
   async createPushSubscription(data, subdomain) {
    const { endpoint, keys } = data;
    
    isValidString(endpoint);
    isValidObject(keys);

    const { p256dh, auth } = keys;
   
    isValidString(p256dh);
    isValidString(auth);
    await isDuplicate("PushSubscription", "endpoint", endpoint);
    const prelanding = await PrelandingService.getPrelandingBySubdomain(subdomain);

    const item = await db.PushSubscription.create({ endpoint, p256dh, auth, prelandingId: prelanding.id });
    return item;
  },

  async createPushTask(data, files) {
    const { prelandingName, geo, vertical, title, text, url } = data;
    !!prelandingName ?? isValidString(prelandingName);
    !!geo ?? isValidString(geo);
    !!vertical ?? isValidString(vertical);
    isValidString(title);
    isValidString(text);
    isValidString(url);

    const iconPath = files?.icon ? `/upload/push/icons/${files.icon.filename}` : null;
    const imagePath = files?.image ? `/upload/push/images/${files.image.filename}` : null;

    const item = await db.PushNotificationTask.create({
      userId: data.userId,
      prelandingName,
      geo,
      vertical,
      device: data.device,
      title,
      text,
      url,
      icon: iconPath,
      image: imagePath,
      status: 'pending',
      subscriptionAge: data.subscriptionAge,
    });

    return item;
  },

   async getUserTasks({ userId, page, limit }) {

    const offset = (page - 1) * limit;

    const { rows, count } = await db.PushNotificationTask.findAndCountAll({
      where: { userId: userId },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }
};