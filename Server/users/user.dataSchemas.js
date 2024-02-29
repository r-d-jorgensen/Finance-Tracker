import { object, string } from 'yup';

export {
    userSchema,
};

let userSchema = object({
    username: string().matches('^[a-zA-Z0-9!@#$%^&*?]').min(5).required(),
    password: string().matches('^[a-zA-Z0-9!@#$%^&*?]').min(3).required()
});