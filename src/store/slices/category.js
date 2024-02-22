import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    catForm: {
      catId: "",
      catName: "",
      description: "",
      updateButton: false,
      drawerId: "my-drawer-4",
    }
}
const subCategorySlice = createSlice({
    name:"subcategoty",
    initialState,
    reducers:{
      setCatForm: (state, action) => {
       state.catForm = action.payload
      },
      resetcatForm : (state) => {
        state.catForm = initialState.catForm;
      }
    }
})

export const {setCatForm, resetcatForm} = subCategorySlice.actions
export default subCategorySlice.reducer