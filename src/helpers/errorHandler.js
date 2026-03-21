module.exports = function handleError(res, error) {
    if (error.type === "validation") {
        return res.status(400).json({
            status: "error",
            message: "Validation error"
        });
    }

    if (error.type === "conflict") {
        return res.status(409).json({
            status: "error",
            message: "Duplicate entry"
        });
    }

    console.error("Unhandled error:", error);

    return res.status(500).json({
        status: "error",
        message: "Internal server error"
    });
};