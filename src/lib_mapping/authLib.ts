import {UserDto} from "../dto/authDto/userDto";
import {UserItem} from "../models/user";
import {SignupDto} from "../dto/authDto/signupDto";

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

    static SignupDtoToUserItem(signupDto: SignupDto): UserItem {
        return {
            Name: signupDto.name,
            LastName: signupDto.lastName,
            Email: signupDto.email,
            Password: signupDto.password,
            PhoneNumber: signupDto.phoneNumber,
            Country: signupDto.country,
            Region: signupDto.region,
            City: signupDto.city,
            Address: signupDto.address,
            CAP: signupDto.cap,
            createdAt: signupDto.createdAt,
            updatedAt: signupDto.updatedAt
        } as UserItem;
    }
}