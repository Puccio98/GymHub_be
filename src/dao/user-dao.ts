import {db} from "../database";
import {UserItem} from "../models/user";

export class UserDao {
    // region Public Methods
    static async findUserByEmail(email: string): Promise<UserItem> {
        const res: UserItem[] = await db('User').where({email: email}).select('*');
        return res[0];
    }

    static async createUser(userItem: UserItem): Promise<UserItem> {
        await db('User').insert(userItem);
        // Ritorno il record appena creato
        return await this.findUserByEmail(userItem.Email);
    }

    //endregion
}