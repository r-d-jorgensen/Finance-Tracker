import { randomInt } from "crypto";
import createUser from "../user.create";

describe('validateEmail function', () => {
    const testUser = {
        "username": "TestUser" + randomInt(1000000000),
        "password": "testPassword" + randomInt(1000000000),
        "email": "richard.david.jorgensen@gmail.com"
    };
  
    it('should create and return a new user', async () => {
        const result = await createUser(testUser);
        
        expect(result && typeof result === 'object').toBe(true)
        expect(typeof result.user_id).toBe("number");
        expect(typeof result.username).toBe("string");
        expect(result.username).toBe(testUser.username);
        expect(typeof result.token).toBe("string");
    });
});

