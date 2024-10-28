const request = require('supertest');
const { app, Task } = require('./app'); // Correct import
const mongoose = require('mongoose');

beforeAll(async () => {
    await mongoose.connect('mongodb+srv://atharv:atharv16@cluster0.axyvvns.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});

beforeEach(async () => {
    // Clear the tasks collection to prevent duplicates
    await Task.deleteMany({});
});

describe('Task API', () => {
    let taskId; // Store task ID for later use

    it('should create a new task', async () => {
        const res = await request(app)
            .post('/tasks')
            .send({
                title: 'Test Task',
                description: 'Test Description',
                deadline: new Date('2024-12-31'),
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.title).toBe('Test Task');
        taskId = res.body._id; // Store the created task ID
    });

    it('should fetch all tasks', async () => {
        // Create a task to ensure there is at least one to fetch
        const task = await Task.create({
            title: 'Fetch Test Task',
            description: 'Test Description',
            deadline: new Date('2024-11-30'),
        });

        const res = await request(app).get('/tasks');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should delete a hardcoded task', async () => {
        // Create a task to delete
        const task = await Task.create({
            _id: new mongoose.Types.ObjectId(), // Generate a unique ObjectId
            title: 'Delete Test Task',
            description: 'Task to be deleted',
            deadline: new Date('2024-12-01'),
        });

        const res = await request(app).delete(`/tasks/${task._id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Task deleted');
    });
});