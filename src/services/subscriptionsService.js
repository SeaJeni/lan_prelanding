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
    const item = await db.EmailSubscription.create({ email, prelanding_id: prelanding.id });
    return item;
  },
   async createPushSubscription(data, subdomain) {
    const {  endpoint, keys } = data;
    
    isValidString(endpoint);
    isValidObject(keys);

    const { p256dh, auth } = keys;
   
    isValidString(p256dh);
    isValidString(auth);
    await isDuplicate("PushSubscription", "endpoint", endpoint);
    const prelanding = await PrelandingService.getPrelandingBySubdomain(subdomain);

    const item = await db.PushSubscription.create({ endpoint, p256dh, auth, prelanding_id: prelanding.id });
    return item;
  },
};