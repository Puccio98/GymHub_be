export interface UserItem {
    /**
     * Id in inserimento è un campo nullo.
     */
    UserID?: number,
    Name: string,
    LastName: string,
    Email: string,
    Password: string,
    PhoneNumber: string,
    Country: string,
    Region: string,
    City: string,
    Address: string,
    CAP: number,
    ProfilePicture?: string,
    createdAt?: Date,
    updatedAt?: Date
}


export {}
