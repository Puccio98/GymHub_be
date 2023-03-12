import {db} from "../database";
import {TokenItem} from "../interfaces/tokenItem-interface";
import {TokenType} from "../enums/token-type.enum";

export class TokenDao {
    // region Public Methods
    static async create(token: TokenItem): Promise<any> {
        // insert token
        try {
            await db('Token')
                .insert(token);
            return true;
        } catch (e) {
            return e;
        }
    }

    static async delete(UserID: number): Promise<any> {
        try {
            await db('Token')
                .where({'UserID': UserID})
                .delete();
            return true;
        } catch (e) {
            return e;
        }
    }

    static async getValidToken(UserID: number, tokenType: TokenType = TokenType.REFRESH): Promise<TokenItem> {
        const refreshToken: TokenItem[] = await db('Token')
            .where({'UserID': UserID, 'TokenTypeID': tokenType})
            .orderBy(['issuedAt']);
        return refreshToken.reverse()[0];
    }

    //endregion
}
