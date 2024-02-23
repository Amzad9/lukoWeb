import { combineReducers } from "@reduxjs/toolkit";
import loaderSlice from "./slices/loaderSlice";
import subcategory from "./slices/subcategory";
import category from "./slices/category";
import product from "./slices/product";
import state from "./slices/state";

const rootReducer  = combineReducers({
    loader: loaderSlice,
    subcategory: subcategory,
    category: category,
    product: product,
    commonState: state
})

export default rootReducer