import {Request, Response} from "express";
import {UserItem} from "../models/user";

const bcrypt = require('bcryptjs');
const User = require('../models/user');

export class AuthController {
    static login = async (req: Request, res: Response) => {
        const user = req.body;

        User.findOne({
            //raw: false,
            where: {email: user.email}
        }).then((u: UserItem) => {
            if (!u) {
                throw new Error('user not found!');
            }
            bcrypt.compare(user.password, u.Password).then((result: boolean) => {
                if (!result) {
                    throw new Error('wrong password!');
                }
                res.json({message: 'user found', user: {id: u.UserID, name: u.Name, lastName: u.LastName}});
            });
        })
            .catch((err: Error) => {
                res.json({message: err.message});
                console.log(err);
            })
    }

    static signup = async (req: Request, res: Response) => {
        const user = req.body;
        user.password = await bcrypt.hash(user.password, 12);

        User.findOne({where: {email: user.email}})
            .then((u: typeof User) => {
                if (u) {
                    throw new Error('user already exists!');
                } else {
                    User.create({
                        Name: user.name,
                        LastName: user.lastName,
                        Email: user.email,
                        Password: user.password,
                        PhoneNumber: user.phone,
                        Country: user.country,
                        Region: user.region,
                        City: user.city,
                        Address: user.address,
                        CAP: user.cap
                    }).then(() => {
                        res.json({message: 'user created successfully!'});
                    })
                }
            })
            .catch((err: Error) => {
                console.log(err);
                res.json({message: err.message});
            });
    }
}