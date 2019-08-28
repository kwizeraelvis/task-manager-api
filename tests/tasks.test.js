const request = require('supertest');
const Task = require('../src/modals/task');
const app = require('../src/app');
const { userOneId, userTwoId, userOne, userTwo, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);


test('Should create Task for user', () => {
    
});