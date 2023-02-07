import {Request, Response} from "express";

const User = require('../models/user');

// region actions
exports.login = (req: Request, res: Response) => {
    const form = req.body.form;
    const email = form.email;
    const password = form.password;

    User.findOne({where: {email: email}})
        .then((u: typeof User) => {
        console.log(u);
        res.send('user found!');
    })
        .catch((err: Error) => {
            console.log(err);
        })
    console.log(email + ' ' + password);
}

exports.signUp = (req: Request, res: Response) => {
    const form = req.body.form;
    /*const email = form.email;
    const password = form.password;
    const name = form.name;
    const lastName = form.lastName;
    const phoneNumber = form.phone;
    const country = form.country;
    const region = form.region;
    const city = form.city;
    const address = form.address;
    const cap = form.cap;
    const profilePicture = form.profilePicture;*/

    console.log(form);
    res.send('user created');
}
// endregion
