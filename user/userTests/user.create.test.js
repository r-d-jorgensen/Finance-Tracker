import { randomInt } from "crypto";
import supertest from "supertest";
import connectionPool from '../../_utilities/connection.js';
import app from "../../server.js"

async function userExistsInDB(username) {
    const sqlquery = `SELECT * FROM users WHERE username = ?`;
    const user = (await connectionPool.execute(sqlquery, [username]))[0];
    return (user.length == 1);
}

describe('Create New User - /user/createUser', () => {
    var testUser = {};

    beforeEach(() => {
        testUser = {
            username: "TestUser" + randomInt(1000000000),
            password: "testPassword" + randomInt(1000000000),
            email: "richard.david.jorgensen@gmail.com"
        };
    });
  
    it('should return new user id and auth token', async () => {
        const res = await supertest(app)
            .post('/user/createUser')
            .set('Accept', 'application/json')
            .send(testUser);

        expect(res.statusCode).toEqual(200);
        expect(res.headers['content-type']).toContain('application/json');
        expect(res.body).toEqual(
            expect.objectContaining({
                message: 'registration success',
                user_id: expect.any(Number),
                username: testUser.username,
                token: expect.any(String),
            }),
        );

        const sqlquery = `SELECT * FROM users WHERE user_id = ?`;
        const user = (await connectionPool.execute(sqlquery, [res.body.user_id]))[0];
        expect(user.length).toEqual(1);
        expect(user[0].username).toEqual(testUser.username);
        expect(await userExistsInDB(testUser.username, testUser.password)).toEqual(true);
    });

    it('should return error of not enough characters for username', async () => {
        testUser.username = "fs";
        const res = await supertest(app)
            .post('/user/createUser')
            .set('Accept', 'application/json')
            .send(testUser);

        expect(res.statusCode).toEqual(400);
        expect(res.headers['content-type']).toContain('application/json');
        expect(res.body).toEqual(
            expect.objectContaining({
                name: 'ValidationError',
                message: 'Data did not match allowed structure',
                inValidEntries: [ 'username must be at least 5 characters' ]
            }),
        );

        expect(await userExistsInDB(testUser.username, testUser.password)).toEqual(false);
    });

    it('should return error of bad characters for username', async () => {
        testUser.username = "fs|=";
        const res = await supertest(app)
            .post('/user/createUser')
            .set('Accept', 'application/json')
            .send(testUser);

        expect(res.statusCode).toEqual(400);
        expect(res.headers['content-type']).toContain('application/json');
        expect(res.body).toEqual(
            expect.objectContaining({
                name: 'ValidationError',
                message: 'Data did not match allowed structure',
                inValidEntries: [ "username must match the following: \"/^[a-zA-Z0-9!@#$%^&*?]+$/\"" ]
            }),
        );

        expect(await userExistsInDB(testUser.username, testUser.password)).toEqual(false);
    });

    it('should return error of not enough characters for password', async () => {
        testUser.password = "fs";
        const res = await supertest(app)
            .post('/user/createUser')
            .set('Accept', 'application/json')
            .send(testUser);

        expect(res.statusCode).toEqual(400);
        expect(res.headers['content-type']).toContain('application/json');
        expect(res.body).toEqual(
            expect.objectContaining({
                name: 'ValidationError',
                message: 'Data did not match allowed structure',
                inValidEntries: [ 'password must be at least 5 characters' ]
            }),
        );

        expect(await userExistsInDB(testUser.username, testUser.password)).toEqual(false);
    });

    it('should return error of bad characters for password', async () => {
        testUser.password = "fs|=";
        const res = await supertest(app)
            .post('/user/createUser')
            .set('Accept', 'application/json')
            .send(testUser);

        expect(res.statusCode).toEqual(400);
        expect(res.headers['content-type']).toContain('application/json');
        expect(res.body).toEqual(
            expect.objectContaining({
                name: 'ValidationError',
                message: 'Data did not match allowed structure',
                inValidEntries: [ "password must match the following: \"/^[a-zA-Z0-9!@#$%^&*?]+$/\"" ]
            }),
        );

        expect(await userExistsInDB(testUser.username, testUser.password)).toEqual(false);
    });

    it('should return error of not evalid email', async () => {
        testUser.email = "fdsafa";
        const res = await supertest(app)
            .post('/user/createUser')
            .set('Accept', 'application/json')
            .send(testUser);

        expect(res.statusCode).toEqual(400);
        expect(res.headers['content-type']).toContain('application/json');
        expect(res.body).toEqual(
            expect.objectContaining({
                name: 'ValidationError',
                message: 'Data did not match allowed structure',
                inValidEntries: [ 'email must be a valid email' ]
            }),
        );

        expect(await userExistsInDB(testUser.username, testUser.password)).toEqual(false);
    });
});

