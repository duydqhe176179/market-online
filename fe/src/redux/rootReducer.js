import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./Slice/auth"
const rootReducer = combineReducers({

    auth: authReducer,

});
export default rootReducer;