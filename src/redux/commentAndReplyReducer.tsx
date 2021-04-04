export const COMMENT_AND_REPLY_TYPES = {
    UPDATE_COMMENT_AND_REPLY_CONDITION: "UPDATE_COMMENT_AND_REPLY_CONDITION",
    INIT_COMMENT_AND_REPLY_CONDITION: "INIT_COMMENT_AND_REPLY_CONDITION"
}

export const initTitle = {
    replyToCommentId: 0,
    replyName: ""
}

export const commentAndReplyReducer = (
    state = initTitle,
    action: { type: string, load: object }
) => {
    const {load, type} = action
    switch (type) {
        case COMMENT_AND_REPLY_TYPES.UPDATE_COMMENT_AND_REPLY_CONDITION:
            return {...state, ...load}
        case COMMENT_AND_REPLY_TYPES.INIT_COMMENT_AND_REPLY_CONDITION:
            return initTitle
        default:
            return state
    }
}

export const updateCommentAndReply = (conditionObj: Object) => ({
    type: COMMENT_AND_REPLY_TYPES.UPDATE_COMMENT_AND_REPLY_CONDITION,
    load: conditionObj
})