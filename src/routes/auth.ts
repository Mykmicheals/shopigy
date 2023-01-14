
import { Token, User } from '../Schemas/models';
import { Request, Response } from 'express';
import express from 'express'
import { generateToken } from '../utils';
import md5 from 'md5'
import { userInfo } from 'os';
import nodemailer from 'nodemailer'
import * as dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

interface user {
    lastname: string;
    firstname: string
    email: string;
    password: string;
    phoneNumber: string;
    isVerified: boolean;
    userToken: string;
}

interface token {
    _userId: string;
    token: string
}

const namePattern = /^[a-zA-Z0-9_]{4,}$/;




const registerUser = (req: Request, res: Response) => {
    var firstname = req.body.firstname
    var lastname = req.body.lastname
    var email = req.body.email
    var password = (req.body.password)
    var phoneNumber = req.body.phoneNumber

    User.findOne({ email: email }, (err: string, foundUser: user) => {
        if (!foundUser) {
            var user = new User({
                firstname: firstname,
                lastname: lastname,
                email: email,
                isVerified: false,
                phoneNumber: phoneNumber,
                password: md5(password),
            })

            if (!namePattern.test(firstname && lastname)) {
                return res.status(400).send({ error: 'Invalid firstname or lastname' });
            } else if (password.length < 6) {
                return res.status(400).send({ error: 'Password must be greater than 5 characters' });
            }

            user.userToken = `Bearer ${generateToken() + user._id}`

            user.save((err) => {
                if (err) {
                    return res.status(500).send({ msg: err.message });
                }

                var token = new Token({
                    _userId: user._id,
                    token: generateToken(),
                    expireAfterSeconds: 10
                })
                token.save()
                sendVerificationMail(token.token, email, firstname, req.headers.host)
                res.send('user registration successfull check your email for verification link')
            })

        } else {
            res.send('user email already exists, pls login with this email')
        }
    })
}


const login = (req: Request, res: Response) => {
    var email = req.body.email
    var password = md5(req.body.password)

    User.findOne({ email: email, password: password }, (err: string, user: user) => {
        if (user) {
            res.send({ sucess: `Welcome back ${user.firstname}`, token: user.userToken })
        } else {
            res.send({ error: 'invalid email and password combination' })
        }

    })
}


const sendForgotPasswordMail = async (req: Request, res: Response) => {
    var email = req.body.email

    var user = await User.findOne({ email: email })

    if (user) {

        var token = generateToken

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        var mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Change your password',
            text: 'hello please copy the token below' + token
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log(`Email sent: ${info.response}`);
            }
        });

    } else {
        res.status(400).send({ error: 'user with this email does not exists' })
    }




}


const validateForgotPasswordPin = async (req: Request, res: Response) => {
    var pin = req.body.pin
    var email = req.body.email

    var user = await User.findOne({ email: email, forgotpasswordpin: pin })

    if (user) {
        res.status(200).send({ sucess: 'correct pin' })
    } else {
        res.status(400).send({ error: 'invalid pin' })
    }
}


const changeForgotPasswor = async (req: Request, res: Response) => {


}

const passwordChange = async (req: Request, res: Response) => {
    var oldpassword = md5(req.body.oldpassword)
    var newpassword = req.body.newpassword
    var token = req.headers.authorization

    const user = await User.findOne({ userToken: token, password: oldpassword })


    if (newpassword.lenght < 6) {
        res.status(400).send({ error: 'password lenght must be more than 6' })
    }

    if (user) {
        user.password = md5(newpassword)
        res.status(200).send({ suceess: 'password has been successfully changed' })
        user.save()
    } else {
        return res.status(400).send({ error: 'invalid old password' })
    }
}


const sendVerificationMail = (token: string, email: string, userName: string, host: string) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Verify you email your email',
        text: 'Hello ' + userName + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + host + '\/auth/confirmation\/' + email + '\/' + token + '\n\nThank You!\n'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log(`Email sent: ${info.response}`);
        }
    });


}





router.post('/register', (req, res) => {
    registerUser(req, res)

})

router.get('/confirmation/:email/:token', async (req, res) => {

    var token = await Token.findOne({ token: req.params.token })
    if (!token) {
        return res.status(400).send({ msg: 'Your verification link may have expired. Please click on resend for verify your Email.' });
    } else {
        var user = await User.findOne({ _id: token._userId })
        if (user) {
            res.send({ sucess: 'user verified' })
            user.isVerified = true
            token.delete()
            user.save()
        } else {
            res.send('user does not exists')
        }

    }

})


router.post('/login', (req, res) => {
    login(req, res)
})


router.post('/passwordchange', (req, res) => {
    passwordChange(req, res)
})

router.get('/good', (req, res) => {
    res.send('good boy')
})

export default router


