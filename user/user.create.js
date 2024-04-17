import jwt from 'jsonwebtoken';
import { hash } from 'bcrypt';
import { object, string } from 'yup';
// import nodemailer from 'nodemailer';
import connectionPool from '../_utilities/connection.js';
import APIError from '../_utilities/apiError.js';

export default createUser;

let userSchema = object({
    username: string().matches(/^[a-zA-Z0-9!@#$%^&*?]+$/).min(5).required(),
    password: string().matches(/^[a-zA-Z0-9!@#$%^&*?]+$/).min(3).required(),
    email: string().email().required()
});

async function createUser(newUser) {
    newUser = await userSchema.validate(newUser);

    // TODO - password should be sent in encrypted from server side then decrypted and hashed here for storage
    const hashedPassword = await hash(newUser.password, Number(process.env.SALT_ROUNDS));
    const sql = `INSERT INTO users (username, password, email, isVerified) VALUES (?, ?, ?, 0)`;
    const user = (await connectionPool.execute(sql, [newUser.username, hashedPassword, newUser.email]))[0];
    if (!user) throw new APIError('Database connection Error', 500, 'Unable to get response from Database');

    // generate and send email for verification
    // const transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         type: 'OAuth2',
    //         user: process.env.MAIL_USERNAME,
    //         pass: process.env.MAIL_PASSWORD,
    //         clientId: process.env.OAUTH_CLIENTID,
    //         clientSecret: process.env.OAUTH_CLIENT_SECRET,
    //         refreshToken: process.env.OAUTH_REFRESH_TOKEN
    //     }
    // });
    
    // // TODO - Add URL link and verification 
    // const mailOptions = {
    //     from: process.env.APPLICATION_EMAIL,
    //     to: newUser.email,
    //     subject: 'Email Verification for Finace Tracker',
    //     text: `URL Link to verify  for user - ${newUser.username}`
    // };
    
    // transporter.sendMail(mailOptions, function(error, info) {
    //     if (error) {
    //         console.log("Email Failed to send");
    //         console.log(error);
    //     }
    // });

    // return user data with a jwt token that is valid for 7 days
    return {
        success: true,
        message: 'registration success',
        user_id: user.insertId,
        username: newUser.username,
        token: jwt.sign({ sub: 0 }, process.env.TOKEN_SECRET, { expiresIn: '7d' })
    };
}