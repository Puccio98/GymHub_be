import {db} from "../database";
import {TokenItem} from "../interfaces/token-item.interface";
import {TokenTypeEnum} from "../enums/token-type.enum";

export class TokenDao {
    // region Public Methods
    static async create(token: TokenItem): Promise<any> {
        // insert token
        await db('Token')
            .insert(token);
        return true;
    }

    static async delete(UserID: number): Promise<any> {
        try {
            await db('Token')
                .where({UserID: UserID})
                .delete();
            return true;
        } catch (e) {
            return e;
        }
    }

    static async getValidToken(UserID: number, tokenType: TokenTypeEnum = TokenTypeEnum.REFRESH): Promise<TokenItem> {
        const refreshToken: TokenItem[] = await db('Token')
            .where({UserID: UserID, TokenTypeID: tokenType})
            .orderBy('issuedAt', 'desc');
        return refreshToken[0];
    }

    //endregion
}
