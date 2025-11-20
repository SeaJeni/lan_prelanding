const SubscriptionsService = require("../services/subscriptionsService");

module.exports = {
    async email(req, res) {
        try {
            await SubscriptionsService.createEmailSubscription(req.body);

            return res.status(201).json({
                status: "success",
                message: "Email subscribed successfully"
            });
        } catch (error) {
            if (error.type === "validation") {
                return res.status(400).json({ 
                    status: "error",
                    message: "Invalid email" 
                });
            }
            if (error.type === "conflict") {
                return res.status(409).json({ 
                    status: "error",
                    message: "Duplicate email" 
                });
            }
            console.error(error);

            return res.status(500).json({ 
                status: "error",
                message: "Internal server error" 
            });
        }
    },
    async push(req, res) { 
        
    }
};