import {Request, Response} from "express";

const bcrypt = require('bcryptjs');

const User = require('../models/user');

// region actions
exports.login = async (req: Request, res: Response) => {
    const user = req.body;

    User.findOne({where: {email: user.email}})
        .then((u: typeof User) => {
            if (!u) {
                throw new Error('user not found!');
            }
            bcrypt.compare(user.password, u.password).then((result: boolean) => {
                if (!result) {
                    throw new Error('wrong password!');
                }
                res.json({message: 'user found', user: {id: u.id, name: u.name, lastName: u.lastName}});
            });
        })
        .catch((err: Error) => {
            res.json({message: err.message});
            console.log(err);
        })
}

exports.signup = async (req: Request, res: Response) => {
    const user = req.body;
    user.password = await bcrypt.hash(user.password, 12);

    User.findOne({where: {email: user.email}})
        .then((u: typeof User) => {
            if (u) {
                throw new Error('user already exists!');
            } else {
                User.create({
                    name: user.name,
                    lastName: user.lastName,
                    email: user.email,
                    password: user.password,
                    phoneNumber: user.phone,
                    country: user.country,
                    region: user.region,
                    city: user.city,
                    address: user.address,
                    cap: user.cap
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
// endregion
