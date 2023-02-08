import {Request, Response} from "express";

const User = require('../models/user');

// region actions
exports.login = (req: Request, res: Response) => {
    const user = req.body.form;

    User.findOne({where: {email: user.email}})
        .then((u: typeof User) => {
            if(!u) {
                throw new Error('user not found!');
            }
            if(u.password !== user.password) {
                throw new Error('wrong password!');
            } else {
                res.json({message: 'user found', user: {id: u.id, name: u.name, lasName: u.lastName}});
            }
    })
        .catch((err: Error) => {
            res.json({message: err.message});
            console.log(err);
        })
}

exports.signup = (req: Request, res: Response) => {
    const user = req.body.form;

    User.findOne({where: {email: user.email}})
        .then((u: typeof User) => {
            if(u) {
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
