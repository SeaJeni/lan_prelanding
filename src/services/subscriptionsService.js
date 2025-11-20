const db = require("../db/models");

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

module.exports = {
  async createEmailSubscription(data) {
    const { email } = data;

    if (!email || typeof email  !== "string") {
        throw { type: "validation", message: "Email is required and must be a string" };
    }

    if (!isValidEmail(email)) {
        throw { type: "validation", message: "Invalid email format" };
    }

    const exists = await db.EmailSubscription.findOne({ where: { email } });
    if (exists) {
        throw { type: "conflict", message: "Email already exists" };
    }

    const item = await db.EmailSubscription.create({ email });

    return item;
  }
};