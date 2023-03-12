import {db} from "../database";
import {TokenItem} from "../interfaces/tokenItem-interface";

export class TokenDao {
    // region Public Methods
    static async create(token: TokenItem): Promise<any> {
        // insert token
        return;
    }

    static async delete(UserID: number): Promise<boolean> {
        await db('Token')
            .where('UserID', '=', UserID)
            .delete();
        return true;
    }

    static async getValidRefreshToken(UserID: number): Promise<TokenItem> {
        const refreshToken: TokenItem[] = await db('Token')
            .where({'UserID': UserID, 'TokenTypeID': 2})
            .orderBy(['issuedAt']);
        return refreshToken.reverse()[0];
    }

    //endregion
}
