const validateTitle = (req, res, next) => {
    const body = req.body ?? {};

    if (body.title === undefined) {
        return res.status(400).json({ message: "The field 'title' is required" });
    }

    if (typeof body.title !== "string" || body.title.trim() === "") {
        return res.status(400).json({ message: "The title cannot be empty" });
    }
    next();
};

const validateStatus = (req, res, next) => {
    const body = req.body ?? {};

    if (body.status === undefined) {
        return res.status(400).json({ message: "The field 'status' is required" });
    }

    if (typeof body.status !== "string" || body.status.trim() === "") {
        return res.status(400).json({ message: "The status cannot be empty" });
    }
    next();
};

module.exports = {
    validateTitle,
    validateStatus
};
