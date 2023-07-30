export interface UserInfoDto {
    name: string,
    lastName: string,
    userName: string,
    email: string,
    profilePicture?: string
}


export interface UserDto {
    /**
     * Id del record del DB
     */
    userID?: number,
    userTypeID: number,
    name: string,
    lastName: string,
    userName: string,
    email: string,
    password: string,
    profilePicture?: string
}
