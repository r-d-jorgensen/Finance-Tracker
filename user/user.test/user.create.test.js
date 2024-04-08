import createUser from "../user.create";

describe('validateEmail function', () => {
    const testUser = {
        "username": "David2131",
        "password": "stuff",
        "email": "richard.david.jorgensen@gmail.com"
    };
  
    beforeEach(() => {
      
    });
  
    afterEach(() => {
      
    });
  
    it('should create and return a new user', async () => {
        const result = await createUser(testUser);
    
        expect(result && typeof result === 'object').toBe(true)
        expect(typeof result.user_id).toBe("number");
        expect(typeof result.username).toBe("token");
        expect(result.username).toBe(testUser.username);
        expect(typeof result.token).toBe("string");
    });
});

