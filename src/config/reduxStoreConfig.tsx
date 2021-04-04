import thunk from "redux-thunk";
import {applyMiddleware, createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import {com} from "@/config/reducers";

export default () => {
    const middlewares = [thunk]
    const enhancers = applyMiddleware(...middlewares)
    const composedEnhancers = composeWithDevTools(...[enhancers])
    const store = createStore(com,composedEnhancers)
    return store
}