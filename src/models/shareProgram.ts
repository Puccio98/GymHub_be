export interface ShareProgram {
    ShareProgramID?: number,
    FromUserID: number,
    ToUserID: number,
    OriginalProgramID: number,
    ClonedProgramID: number,
    createdAt: Date,
    updatedAt: Date
}