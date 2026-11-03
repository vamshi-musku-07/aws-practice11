const express = require("express");
const Todo = require("../models/Todo");

const router = express.Router();

// GET /api/todos
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/todos
router.post("/", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    const todo = await Todo.create({ title: title.trim() });
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/todos/:id
router.put("/:id", async (req, res) => {
  try {
    const { title, completed } = req.body;
    const updates = {};

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ message: "Title cannot be empty" });
      }
      updates.title = title.trim();
    }
    if (completed !== undefined) {
      updates.completed = Boolean(completed);
    }

    const todo = await Todo.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/todos/:id
router.delete("/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json({ message: "Todo deleted", id: todo._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
