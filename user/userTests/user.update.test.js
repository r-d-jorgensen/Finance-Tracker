import { randomInt } from "crypto";
import supertest from "supertest";
import connectionPool from '../../_utilities/connection.js';
import app from "../../server.js";

async function getUserData(testUser) {
    const sqlquery = `SELECT * FROM users WHERE user_id = ?`;
    const user = (await connectionPool.execute(sqlquery, [testUser.user_id]))[0];
    expect(user.length).toEqual(1);
    return user;
}

describe('Update User - /user/updateUser', () => {
    const username = "TestUser" + randomInt(1000000000);
    const password = "testPassword" + randomInt(1000000000);
    const email = "bigstuff" + randomInt(1000000000) + "@gmail.com";
    let token = "Bearer ";
    let user_id = -1;
    let testUser = {};

    beforeAll(async () => {
        const res = await supertest(app)
            .post('/user/createUser')
            .set('Accept', 'application/json')
            .send({
                username,
                password,
                email
            });
        user_id = res.body.user_id;
        token += res.body.token;
    });

    beforeEach(() => {
        testUser = {
            user_id: user_id,
            username: username,
            password: password,
            email: email
        }
    });
  
    it('should return success message', async () => {
        const res = await supertest(app)
            .post('/user/updateUser')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(testUser);

        expect(res.statusCode).toEqual(200);
        expect(res.headers['content-type']).toContain('application/json');
        expect(res.body).toEqual(
            expect.objectContaining({
                message: "Password and Email Updated Successfully"
            }),
        );

        const user = await getUserData(testUser);
        expect(user[0].password).toEqual(testUser.password);
        expect(user[0].email).toEqual(testUser.email);
    });

    it('should return error of bad user_id', async () => {
        testUser.user_id = -1;
        const res = await supertest(app)
            .post('/user/updateUser')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(testUser);

        expect(res.statusCode).toEqual(400);
        expect(res.headers['content-type']).toContain('application/json');
        expect(res.body).toEqual(
            expect.objectContaining({
                name: 'ValidationError',
                message: 'Data did not match allowed structure',
                inValidEntries: [ 'user_id must be greater than or equal to 1' ]
            }),
        );

        const sqlquery = `SELECT * FROM users WHERE user_id = ?`;
        const user = (await connectionPool.execute(sqlquery, [testUser.user_id]))[0];
        expect(user.length).toEqual(0);
    });

    it('should return error of not enough characters for username', async () => {
        testUser.username = "fs";
        const res = await supertest(app)
            .post('/user/updateUser')
            .set('Accept', 'application/json')
            .set('Authorization', token)
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

        const user = await getUserData(testUser);
        expect(user[0].password).toEqual(testUser.password);
        expect(user[0].email).toEqual(testUser.email);
    });

    it('should return error of bad characters for username', async () => {
        testUser.username = "fs|=";
        const res = await supertest(app)
            .post('/user/updateUser')
            .set('Accept', 'application/json')
            .set('Authorization', token)
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

        const user = await getUserData(testUser);
        expect(user[0].password).toEqual(testUser.password);
        expect(user[0].email).toEqual(testUser.email);
    });

    it('should return error of not enough characters for password', async () => {
        testUser.password = "fs";
        const res = await supertest(app)
            .post('/user/updateUser')
            .set('Accept', 'application/json')
            .set('Authorization', token)
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

        const user = await getUserData(testUser);
        expect(user[0].password).not.toEqual(testUser.password);
        expect(user[0].email).toEqual(testUser.email);
    });

    it('should return error of bad characters for password', async () => {
        testUser.password = "fs|=";
        const res = await supertest(app)
            .post('/user/updateUser')
            .set('Accept', 'application/json')
            .set('Authorization', token)
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

        const user = await getUserData(testUser);
        expect(user[0].password).not.toEqual(testUser.password);
        expect(user[0].email).toEqual(testUser.email);
    });

    it('should return error of not valid email', async () => {
        testUser.email = "fdsafa";
        const res = await supertest(app)
            .post('/user/updateUser')
            .set('Accept', 'application/json')
            .set('Authorization', token)
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

        const user = await getUserData(testUser);
        expect(user[0].password).toEqual(testUser.password);
        expect(user[0].email).not.toEqual(testUser.email);
    });
});

