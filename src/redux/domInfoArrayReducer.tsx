export const DOM_INFO_ARRAY_TYPES = {
    UPDATE_DOM_INFO_ARRAY: "UPDATE_DOM_INFO_ARRAY",
    INIT_DOM_INFO_ARRAY: "INIT_DOM_INFO_ARRAY"
}

export const initDomInfoArray = {
    domInfoArray: [] as Array<any>
}

export const domInfoArrayReducer = (state = initDomInfoArray, action: { type: string, load: object }) => {
    const {load, type} = action
    switch (type) {
        case DOM_INFO_ARRAY_TYPES.UPDATE_DOM_INFO_ARRAY:
            return {...state, ...load}
        case DOM_INFO_ARRAY_TYPES.INIT_DOM_INFO_ARRAY:
            return state
        default:
            return state
    }
}

export const updateDomInfoArray = (obj: Object) => ({
    type: DOM_INFO_ARRAY_TYPES.UPDATE_DOM_INFO_ARRAY,
    load: obj
})