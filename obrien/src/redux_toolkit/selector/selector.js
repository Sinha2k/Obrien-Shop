import { createSelector } from "@reduxjs/toolkit"

export const loadingSelector = (state) => state.products.status
export const loadingUserSelector = (state) => state.user.status
export const productsSelector = (state) => state.products.fruits
export const blogsSelector = (state) => state.blogs
export const cartSelector = (state) => state.cart
export const filterSelector = (state) => state.filter
export const userSelector = (state) => state.user

export const productsCurrentList = createSelector(
    productsSelector,filterSelector,(productsList,filter)=>{
        if(filter.searchText && filter.category){
            return productsList.filter(item => item.name.toLowerCase().includes(filter.searchText) && item.category === filter.category)
        }else if(filter.searchText){
            return productsList.filter(item => item.name.toLowerCase().includes(filter.searchText))
        }else if(filter.category){
            return productsList.filter(item => item.category === filter.category)
        }
        return productsList
    }
)