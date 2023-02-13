import {Request, Response} from "express";
import {UserItem} from "../models/user";
import {LoginDto} from "../dto/authDto/loginDto";
import {AuthLib} from "../lib_mapping/authLib";
import {SignupDto} from "../dto/authDto/signupDto";

const bcrypt = require('bcryptjs');
const User = require('../models/user');

export class AuthController {
    static login = async (req: Request, res: Response) => {
        const user: LoginDto = req.body;
        User.findOne({where: {email: user.email}}).then((u: UserItem) => {
            if (!u) {
                throw new Error('user not found!');
            }
            bcrypt.compare(user.password, u.Password).then((result: boolean) => {
                if (!result) {
                    throw new Error('wrong password!');
                }
                res.json(AuthLib.UserItemToUserDto(u));
            });
        }).catch((err: Error) => {
            res.json({message: err.message});
            console.log(err);
        })
    }

    static signup = async (req: Request, res: Response) => {
        const user: SignupDto = req.body;
        user.password = await bcrypt.hash(user.password, 12);
        User.findOne({where: {email: user.email}})
            .then((u: UserItem) => {
                if (u) {
                    throw new Error('user already exists!');
                } else {
                    User.create({
                        Name: user.name,
                        LastName: user.lastName,
                        Email: user.email,
                        Password: user.password,
                        PhoneNumber: user.phoneNumber,
                        Country: user.country,
                        Region: user.region,
                        City: user.city,
                        Address: user.address,
                        CAP: user.cap
                    }).then((user: any) => {
                        res.json(AuthLib.UserItemToUserDto(user.get({plain: true})));
                    })
                }
            })
            .catch((err: Error) => {
                console.log(err);
                res.json({message: err.message});
            });
    }
}