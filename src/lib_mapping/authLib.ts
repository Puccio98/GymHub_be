import {UserDto} from "../dto/authDto/userDto";
import {UserItem} from "../models/user";

export class AuthLib {
    static UserItemToUserDto(userItem: UserItem): UserDto {
        return {
            userID: userItem.UserID,
            name: userItem.Name,
            lastName: userItem.LastName,
            email: userItem.Email,
            password: userItem.Password,
            phoneNumber: userItem.PhoneNumber,
            country: userItem.Country,
            region: userItem.Region,
            city: userItem.City,
            address: userItem.Address,
            CAP: userItem.CAP,
            profilePicture: userItem.ProfilePicture
        } as UserDto;

    }
}