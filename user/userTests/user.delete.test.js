import { randomInt } from "crypto";
import supertest from "supertest";
import connectionPool from '../../_utilities/connection.js';
import app from "../../server.js";

describe('Delete User - /user/deleteUser', () => {
    async function getUserData() {
        const sqlquery = `SELECT * FROM users WHERE user_id = ?`;
        return (await connectionPool.execute(sqlquery, [user_id]))[0];
    }

    let token = "";
    let user_id = -1;
    let testUser = {};

    beforeEach(async () => {
        testUser = {
            username: "TestUser" + randomInt(1000000000),
            password: "testPassword" + randomInt(1000000000),
            email: "bigstuff" + randomInt(1000000000) + "@gmail.com"
        };
        const res = await supertest(app)
            .post('/user/createUser')
            .set('Accept', 'application/json')
            .send(testUser)
            .expect(200);

        user_id = res.body.user_id;
        token = "Bearer " + res.body.token;
        testUser.user_id = user_id
    });

    afterEach(async () => {
        const sqlquery = `DELETE FROM users WHERE user_id = ?`;
        await connectionPool.execute(sqlquery, [user_id]);
    });
  
    it('should return success message', async () => {
        const res = await supertest(app)
            .post('/user/deleteUser')
            .set('Accept', 'application/json')
            .set('Authorization', token)
            .send(testUser);

        expect(res.statusCode).toEqual(200);
        expect(res.headers['content-type']).toContain('application/json');
        expect(res.body).toEqual(
            expect.objectContaining({
                message: "User was deleted successfully"
            }),
        );

        const user = await getUserData(testUser);
        expect(user.length).toEqual(0);
    });

    it('should return error of bad user_id', async () => {
        testUser.user_id = -1;
        const res = await supertest(app)
            .post('/user/deleteUser')
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

        const user = await getUserData();
        expect(user.length).toEqual(1);
    });

    it('should return error of not enough characters for username', async () => {
        testUser.username = "fs";
        const res = await supertest(app)
            .post('/user/deleteUser')
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

        const user = await getUserData();
        expect(user.length).toEqual(1);
    });

    it('should return error of bad characters for username', async () => {
        testUser.username = "fs|=";
        const res = await supertest(app)
            .post('/user/deleteUser')
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

        const user = await getUserData();
        expect(user.length).toEqual(1);
    });

    it('should return error of not enough characters for password', async () => {
        testUser.password = "fs";
        const res = await supertest(app)
            .post('/user/deleteUser')
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

        const user = await getUserData();
        expect(user.length).toEqual(1);
    });

    it('should return error of bad characters for password', async () => {
        testUser.password = "fs|=";
        const res = await supertest(app)
            .post('/user/deleteUser')
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

        const user = await getUserData();
        expect(user.length).toEqual(1);
    });
});

