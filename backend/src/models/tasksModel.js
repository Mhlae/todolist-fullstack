const connection = require("./connection");

const getAll = async () => {
    const [tasks] = await connection.execute(
        "SELECT id, tittle AS title, status, created_at FROM tasks"
    );
    return tasks;
};

const createTask = async (task) => {
    const { title } = task;
    const createdAt = new Date().toISOString().slice(0, 19).replace("T", " ");

    const query = "INSERT INTO tasks (tittle, status, created_at) VALUES (?, ?, ?)";

    const [createdTask] = await connection.execute(query, [title, "pendente", createdAt]);
    return {insertId: createdTask.insertId};
};

const deleteTask = async (id) => {
    const [removedTask] = await connection.execute("DELETE FROM tasks WHERE id = ?", [id]);
    return removedTask;
};

const updateTask = async (id, task) => {
    const { title, status } = task;
    
    const query = "UPDATE tasks SET tittle = ?, status = ? WHERE id = ?";

    const [updatedTask] = await connection.execute(query, [title, status, id]);
    return updatedTask;
};

module.exports = {
    getAll,
    createTask,
    deleteTask,
    updateTask
};