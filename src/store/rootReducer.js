import { combineReducers } from "@reduxjs/toolkit";
import loaderSlice from "./slices/loaderSlice";
import subcategory from "./slices/subcategory";
import category from "./slices/category";

const rootReducer  = combineReducers({
    loader: loaderSlice,
    subcategory: subcategory,
    category: category
})

export default rootReducer