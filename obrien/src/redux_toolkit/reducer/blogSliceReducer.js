import {createSlice} from '@reduxjs/toolkit';
import blog1 from '../../components/image/blog1.jpg'
import blog2 from '../../components/image/blog2.jpg'
import blog3 from '../../components/image/blog3.jpg'
import blog4 from '../../components/image/blog4.jpg'
const blogSliceReducer = createSlice({
    name:'blogs',
    initialState:[
        // {
        //     id:0,
        //     title:'There Are Many Variation of Passages of Lorem Ipsum Available',
        //     attachment: blog1,
        //     author:'Sinha',
        //     description:'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making...',
        //     createdAt:new Date()
        // },
        // {
        //     id:1,
        //     title:'There Are Many Variation of Passages of Lorem Ipsum Available',
        //     attachment: blog2,
        //     author:'Willy Hampston',
        //     description:'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making...',
        //     createdAt:new Date()
        // },
        // {
        //     id:2,
        //     title:'There Are Many Variation of Passages of Lorem Ipsum Available',
        //     attachment: blog3,
        //     author:'Pham Quang',
        //     description:'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making...',
        //     createdAt:new Date()
        // },
        // {
        //     id:3,
        //     title:'There Are Many Variation of Passages of Lorem Ipsum Available',
        //     attachment: blog4,
        //     author:'Pham Quang',
        //     description:'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making...',
        //     createdAt:new Date()
        // }
    ],
    reducers:{

    }
})
export default blogSliceReducer;