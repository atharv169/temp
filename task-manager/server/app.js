const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://atharv:atharv16@cluster0.axyvvns.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  
});

// Task schema
const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    deadline: Date,
    completed: { type: Boolean, default: false },
});

// Task model
const Task = mongoose.model('Task', taskSchema);

// Routes

// Get all tasks
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// Create a new task
app.post('/tasks', async (req, res) => {
    const newTask = new Task(req.body);
    await newTask.save();
    res.json(newTask);
});

// Update a task
app.put('/tasks/:id', async (req, res) => {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
});

// Mark a task as completed
app.patch('/tasks/:id/complete', async (req, res) => {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, { completed: true }, { new: true });
    res.json(updatedTask);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, Task };