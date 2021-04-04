export const TITLE_TYPES = {
    UPDATE_TITLE_OBJ: "UPDATE_TITLE_OBJ",
    INIT_TITLE_OBJ: "INIT_TITLE_OBJ"
}

export const initTitle = {
    title: "踩坑日报",
    type: "老刘出品",
    date: "power by react typescript",
    span: "兼博客"
}

export const titleReducer = (state = initTitle, action: { type: string, load: object }) => {
    const {load, type} = action
    switch (type) {
        case TITLE_TYPES.UPDATE_TITLE_OBJ:
            return {...state, ...load}
        case TITLE_TYPES.INIT_TITLE_OBJ:
            return initTitle
        default:
            return state
    }
}

export const updateTitle = (titleObj: Object) => ({
    type: TITLE_TYPES.UPDATE_TITLE_OBJ,
    load: titleObj
})