export interface UserDto {
    /**
     * Id del record del DB
     */
    userID?: number,
    name: string,
    lastName: string,
    email: string,
    password: string,
    phoneNumber: string,
    country: string,
    region: string,
    city: string,
    address: string,
    CAP: string,
    profilePicture?: string
}
