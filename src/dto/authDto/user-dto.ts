export interface UserDto {
    /**
     * Id del record del DB
     */
    userID?: number,
    name: string,
    lastName: string,
    userName: string,
    email: string,
    password: string,
    profilePicture?: string,
    userTypeID: number
}
