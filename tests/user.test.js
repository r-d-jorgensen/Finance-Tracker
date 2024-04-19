import { randomInt } from "crypto";
import supertest from "supertest";
import app from "../server.js"

describe('Create New User - /user/createUser', () => {
    const testUser = {
        username: "TestUser" + randomInt(1000000000),
        password: "testPassword" + randomInt(1000000000),
        email: "richard.david.jorgensen@gmail.com"
    };
  
    it('should return new user id and auth token', async () => {
        const res = await supertest(app)
            .post('/user/createUser')
            .set('Accept', 'application/json')
            .send(testUser)
            .expect(200);

        expect(res.statusCode).toEqual(200);
        expect(res.headers['content-type']).toContain('application/json');
        expect(res.body).toEqual(
            expect.objectContaining({
                success: true,
                message: 'registration success',
                user_id: expect.any(Number),
                username: testUser.username,
                token: expect.any(String),
            }),
        );
    });
});

