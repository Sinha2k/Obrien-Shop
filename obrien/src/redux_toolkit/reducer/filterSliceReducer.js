import {createSlice} from '@reduxjs/toolkit';

const filterSliceReducer = createSlice({
    name:'filter',
    initialState:{
        searchText:'',
        category:'',
        sort:''
    },
    reducers:{
     searchProducts: (state,action)=>{
        state.searchText = action.payload
     },
     filterByCategory: (state,action)=>{
        state.category = action.payload
     }
   }
})
export default filterSliceReducer;