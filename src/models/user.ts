export interface UserItem {
    /**
     * Id in inserimento è un campo nullo.
     */
    UserID?: number,
    Name: string,
    LastName: string,
    UserName: string,
    Email: string,
    Password: string,
    ProfilePicture?: string,
    createdAt?: Date,
    updatedAt?: Date
}


export {}
