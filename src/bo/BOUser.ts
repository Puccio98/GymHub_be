import {UserItem} from "../models/user";

const User = require('../models/user');

export class BOUser {
    // region Properties
    UserID: number;
    Name: string;
    LastName: string;
    Email: string;
    Password: string;
    PhoneNumber: string;
    Country: string;
    Region: string;
    City: string;
    Address: string;
    CAP: number;
    ProfilePicture?: string;
    // endregion

    // region Constructor

    // Costruisce l'oggetto BOUser dall'entità se presente altrimenti tramite userID
    constructor(u: { userID?: number, userItem?: UserItem }) {
        if (u.userItem) {
            this.initByEntity(u.userItem);
        } else if (u.userItem) {
            User.findOne({where: {userID: u.userID}}).then((userItem: UserItem) => {
                if (!userItem) {
                    throw  new Error('User not found');
                }
                return this.initByEntity(userItem);
            }).catch((err: Error) => {
                throw  new Error(err.message);
            })
        }
        throw  new Error('Se non ho l\'ID e non ho l\'entity come pensi che io possa creare l\'utente?');
    }

    // Inizializza l'oggetto BO attraverso l'entità del DB che è rappresentata da UserItem
    private initByEntity(userItem: UserItem) {
        this.UserID = userItem.UserID;
        this.Name = userItem.Name;
        this.LastName = userItem.LastName;
        this.Email = userItem.Email;
        this.Password = userItem.Password;
        this.PhoneNumber = userItem.PhoneNumber;
        this.Country = userItem.Country;
        this.Region = userItem.Region;
        this.City = userItem.City;
        this.Address = userItem.Address;
        this.CAP = userItem.CAP;
        this.ProfilePicture = userItem.ProfilePicture;
    }

    // endregion


    // region Metodi Pubblici

    // endregion

    // region Metodi Privati

    // endregion
}