import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    productForm: {
      product_id: "",
      name: "",
      category_id: "",
      subcategory_id: "",
      brand: "",
      price: "",
      description: "",
      image_url: "",
      stock_quantity: "",
      is_active: "",
      updateButton: false,
      drawerId: "my-drawer-4",
    }
}
const productSlice = createSlice({
    name:"products",
    initialState,
    reducers:{
      setProductForm: (state, action) => {
       state.productForm = action.payload
      },
      resetProductForm : (state) => {
        state.productForm = initialState.productForm;
      }
    }
})

export const {setProductForm, resetProductForm} = productSlice.actions
export default productSlice.reducer