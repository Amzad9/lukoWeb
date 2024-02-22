import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    subForm: {
        category_id: "",
        subCatName: "",
        description: "",    
        updateButton: false,
        drawerId: "drawer-4"
    }
}
const subCategorySlice = createSlice({
    name:"subcategoty",
    initialState,
    reducers:{
      setSubForm: (state, action) => {
       state.subForm = action.payload
      },
      resetSubForm : (state) => {
        state.subForm = initialState.subForm;
      }
    }
})

export const {setSubForm, resetSubForm} = subCategorySlice.actions
export default subCategorySlice.reducer