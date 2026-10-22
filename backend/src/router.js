const express = require("express");
const tasksController = require("./controllers/tasksController.js");

const router = express.Router();

router.get("/tasks", tasksController.getAll);

module.exports = router;