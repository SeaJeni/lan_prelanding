const db = require("../db/models");
const { isValidString, isDuplicate, isValidObject } = require("../helpers/validation");

module.exports = {
  async createPrelanding(data, userId) {
    const { templateName, subdomain, templateData } = data;

    isValidString(templateName);
    isValidString(subdomain);
    isValidObject(templateData);
    await isDuplicate("Prelanding", "subdomain", subdomain);
  
    const item = await db.Prelanding.create({
      templateName,
      subdomain,
      templateData,  
      user_id: userId,
      status: "pending"   
    });
    
    return item; 
  },
  async getPrelandingBySubdomain(subdomain) {
   return await db.Prelanding.findOne({
     where: { subdomain }
   });
  }  
};
