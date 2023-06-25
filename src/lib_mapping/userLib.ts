import {UserItem} from "../models/user";
import {UserDto} from "../dto/authDto/user-dto";

export class UserLib {
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
        } as UserDto
    }

    static UserDtoToUserItem(userDto: UserDto): UserItem {
        return {
            UserID: userDto.userID,
            UserTypeID: userDto.userTypeID,
            Name: userDto.name,
            LastName: userDto.lastName,
            UserName: userDto.userName,
            Email: userDto.email,
            Password: userDto.password,
            ProfilePicture: userDto.profilePicture
        } as UserItem
    }

    static UserItemListToUserDtoList (userList: UserItem[]): UserDto[] {
        let res: UserDto[] = [];
        for (const u of userList) {
            res.push(this.UserItemToUserDto(u));
        }
        return res;
    }
}