const request = require('supertest');
const Task = require('../src/modals/task');
const app = require('../src/app');
const { 
    userOneId, 
    userTwoId, 
    userOne, 
    userTwo, 
    taskOne, 
    taskTwo, 
    taskThree, 
    setupDatabase 
} = require('./fixtures/db');

beforeEach(setupDatabase);


test('Should create Task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my Test'
        })
        .expect(200)
        const task = await Task.findById(response.body._id)
        expect(task).not.toBeNull();
        expect(task.completed).toEqual(false)
});

test('Should get all tasks for a user', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
        expect(response.body).toHaveLength(2)
});

test('Should not delete other users task', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
        const task = await Task.findById(taskOne._id);
        expect(task).not.toBeNull();
});