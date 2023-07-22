import {db} from "../database";
import {UserItem} from "../models/user";
import {UserType} from "../enums/user-type.enum";

export class UserDao {
    // region Public Methods
    static async findByEmail(email: string): Promise<UserItem> {
        const res: UserItem[] = await db('User')
            .where({Email: email})
            .select('*');
        return res[0];
    }

    static async findByUserName(userName: string): Promise<UserItem> {
        const res: UserItem[] = await db('User')
            .where({UserName: userName})
            .select('*');
        return res[0];
    }

    static async create(userItem: UserItem): Promise<UserItem> {
        await db('User').insert(userItem);
        // Ritorno il record appena creato
        return await this.findByEmail(userItem.Email);
    }

    static async get(userTypeID: UserType | null, userDescription: string | null): Promise<UserItem[]> {
        return db('User')
            .where((builder: any) => {
                if (userTypeID)
                    builder.where('UserTypeID', userTypeID);

                if (userDescription != null && userDescription.length > 2)
                    builder.where((bd: any) =>
                        bd.whereILike('Name', `%${userDescription}%`)
                            .orWhereILike('LastName', `%${userDescription}%`)
                            .orWhereILike('UserName', `%${userDescription}%`));
            })
            .select('*');
    }

    //endregion
}
