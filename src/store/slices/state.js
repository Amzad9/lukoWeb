import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    sideNavigation: false
}
const stateSlice = createSlice({
    name:"commonState",
    initialState,
    reducers:{
      setSideNavigation : (state) => {
         state.sideNavigation = !state.sideNavigation
      },
      closeNavigation : (state) => {
        state.sideNavigation = false
     }
    }
})
export const {setSideNavigation, closeNavigation} = stateSlice.actions
export default stateSlice.reducer