const request = require('supertest');
const app = require('../src/app');
const User = require('../src/modals/user');
const { userOneId, userTwoId, userOne, userTwo, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should Signup a new User', async () => {
    const response = await request(app).post('/users').send({
        name:"Andrew",
        email:"andrew@example.com",
        password:"mypass777"
    }).expect(200);


    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    expect(response.body).toMatchObject({
        user: {
            name: 'Andrew',
            email: 'andrew@example.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('mypass777')
});

test('should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token);
});

test('should not login nonexisent user', async () => {
    await request(app).post('/users/login').send({
        email: userTwo.email,
        password: 'Thisisnotmypassword'
    }).expect(400);
});

test('should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}` )
        .send()
        .expect(200)
});

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
});

test('Should delete account for user', async () => {
        await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
        const user = await User.findById(userOneId);
        expect(user).toBeNull();
});

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
});

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)
    
        const user = await User.findById(userOneId)
        expect(user.avatar).toEqual(expect.any(Buffer));
})

test('Should update valid user fields', async () =>  {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ name: 'Kwizera Aime Elvis'})
        .expect(200)

        const user = await User.findById(userOneId)
        expect(user.name).not.toBe(userOne.name)
})

test('should not update invalid user fields ', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ location: 'Philadephia' })
        .expect(400)
});