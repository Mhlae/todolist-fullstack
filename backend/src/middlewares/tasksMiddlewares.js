const validateTitle = (req, res, next) => {
    const body = req.body ?? {};

    if (body.title === undefined) {
        return res.status(400).json({ message: "The field 'title' is required" });
    }

    if (typeof body.title !== "string" || body.title.trim() === "") {
        return res.status(400).json({ message: "The title cannot be empty" });
    }
    body.title = body.title.trim();
    next();
};

const validateStatus = (req, res, next) => {
    const body = req.body ?? {};
    const validStatuses = ["pendente", "em andamento", "concluida"];

    if (body.status === undefined) {
        return res.status(400).json({ message: "The field 'status' is required" });
    }

    if (typeof body.status !== "string" || !validStatuses.includes(body.status)) {
        return res.status(400).json({ message: "The status is invalid" });
    }
    next();
};

module.exports = {
    validateTitle,
    validateStatus
};
