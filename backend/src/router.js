const express = require("express");
const tasksController = require("./controllers/tasksController.js");

const router = express.Router();
const tasksMiddleware = require("./middlewares/tasksMiddlewares.js");

router.get("/tasks", tasksController.getAll);
router.post("/tasks", tasksMiddleware.validateTitle, tasksController.createTask);
router.delete("/tasks/:id", tasksController.deleteTask);
router.put("/tasks/:id",
    tasksMiddleware.validateTitle,
    tasksMiddleware.validateStatus,
    tasksController.updateTask
);

module.exports = router; 