import { randomInt } from "crypto";
import supertest from "supertest";
import connectionPool from '../../_utilities/connection.js';
import app from "../../server.js";

describe('Login User - /user/loginUser', () => {
    const baseUser = {
        username: "TestUser" + randomInt(1000000000),
        password: "testPassword" + randomInt(1000000000),
        email: "bigstuff" + randomInt(1000000000) + "@gmail.com",
    }
    const testUser = {...baseUser};

    beforeAll(async () => {
        const res = await supertest(app)
        .post('/user/createUser')
        .set('Accept', 'application/json')
        .send(baseUser)
        .expect(200);

        baseUser.token = "Bearer " + res.body.token;
        baseUser.user_id = res.body.user_id;
    });

    afterAll(async () => {
        const res = await supertest(app)
            .post('/user/deleteUser')
            .set('Accept', 'application/json')
            .set('Authorization', baseUser.token)
            .send(baseUser)
            .expect(200);
    });
  
    it('should return new user id and auth token', async () => {
        const res = await supertest(app)
            .post('/user/loginUser')
            .set('Accept', 'application/json')
            .send(testUser);

        expect(res.statusCode).toEqual(200);
        expect(res.headers['content-type']).toContain('application/json');
        expect(res.body).toEqual(
            expect.objectContaining({
                user_id: expect.any(Number),
                username: testUser.username,
                token: expect.any(String),
            }),
        );

        const sqlquery = `SELECT * FROM users WHERE user_id = ?`;
        const user = (await connectionPool.execute(sqlquery, [res.body.user_id]))[0];
        expect(user.length).toEqual(1);
        expect(user[0].username).toEqual(testUser.username);
    });

    it('should return error of not enough characters for username', async () => {
        testUser.username = "fs";
        const res = await supertest(app)
            .post('/user/loginUser')
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
    });

    it('should return error of bad characters for username', async () => {
        testUser.username = "fs|=";
        const res = await supertest(app)
            .post('/user/loginUser')
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
    });

    it('should return error of not enough characters for password', async () => {
        testUser.password = "fs";
        const res = await supertest(app)
            .post('/user/loginUser')
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
    });

    it('should return error of bad characters for password', async () => {
        testUser.password = "fs|=";
        const res = await supertest(app)
            .post('/user/loginUser')
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
    });
});

