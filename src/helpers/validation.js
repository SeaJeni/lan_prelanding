const db = require("../db/models");

module.exports = {
    isValidString(str) {
        if (!str || typeof str !== "string" || str.trim() === "") {
            throw { type: "validation"};
        } 
    },   
    isValidObject(obj) {
        if (!obj || typeof obj !== "object") {
            throw { type: "validation" };
        }
    }, 
    async isDuplicate(modelName, field, value) {
        console.log(modelName, field, value);
        const model = db[modelName];
        console.log(model);
        if (!model) {
            throw new Error(`Model '${modelName}' not found`);
        }
        
        const exists = await model.findOne({ where: { [field]: value } });
        console.log(exists);
        if (exists) {
            throw { type: "conflict" };
        }
    },
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!regex.test(email)) {
            throw { type: "validation" };
        }
    }
};  