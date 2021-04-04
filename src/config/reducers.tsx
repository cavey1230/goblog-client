import {combineReducers} from "redux";

import {titleReducer} from "@/redux/titleReducer";
import {domInfoArrayReducer} from "@/redux/domInfoArrayReducer";
import {commentAndReplyReducer} from "@/redux/commentAndReplyReducer";

export const com = combineReducers({
    titleReducer,domInfoArrayReducer,commentAndReplyReducer
})

export type ReduxRootType = ReturnType<typeof com>