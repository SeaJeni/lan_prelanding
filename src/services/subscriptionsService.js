const db = require("../db/models");
const { isValidString, isDuplicate, isValidEmail, isValidObject } = require("../helpers/validation");

module.exports = {
  async createEmailSubscription(data) {
    const { email } = data;
     
    isValidString(email);
    isValidEmail(email);
    await isDuplicate("EmailSubscription", "email", email);
    
    const item = await db.EmailSubscription.create({ email });
    return item;
  },
   async crearePushSubscription(data) {
    const {  endpoint, keys } = data;
    
    isValidString(endpoint);
    isValidObject(keys);

    const { p256dh, auth } = keys;
   
    isValidString(p256dh);
    isValidString(auth);
    await isDuplicate("PushSubscription", "endpoint", endpoint);
    
    const item = await db.PushSubscription.create({ endpoint, p256dh, auth });
    return item;
  },
};