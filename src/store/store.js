import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import loggerMiddleware from "./loggerMiddleware";
import { thunk } from "redux-thunk";
const store  = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(loggerMiddleware),
})

export default store