import {UserDto} from "../dto/authDto/user.dto";
import {UserItem} from "../models/user";
import {SignupDto} from "../dto/authDto/signup.dto";

export class AuthLib {
    static UserItemToUserDto(userItem: UserItem): UserDto {
        return {
            userID: userItem.UserID,
            userTypeID: userItem.UserTypeID,
            name: userItem.Name,
            lastName: userItem.LastName,
            userName: userItem.UserName,
            email: userItem.Email,
            password: userItem.Password,
            profilePicture: userItem.ProfilePicture
        } as UserDto;
    }

    static SignupDtoToUserItem(signupDto: SignupDto): UserItem {
        return {
            Name: signupDto.name,
            LastName: signupDto.lastName,
            UserName: signupDto.userName,
            UserTypeID: signupDto.userTypeID,
            Email: signupDto.email,
            Password: signupDto.password,
            createdAt: signupDto.createdAt,
            updatedAt: signupDto.updatedAt
        } as UserItem;
    }
}
