import React,{useState,useEffect} from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import OutlinedInput from '@mui/material/OutlinedInput';
import BlogData from '../Data/blogData';
import FruitData from '../Data/fruitsData';
import BlogItem from '../utils/BlogItem/BlogItem'
import ProductItem from '../utils/ProductItem/productItem';
const Blog = () => {
    const [count,setCount] = useState(0)
    const [page,setPage] = useState(1)
    const handleChangePage = (event,value) =>{
        setPage(value)
    }
    useEffect(()=>{
        const all = BlogData.length
        if(all % 3 === 0){
            setCount(all/3)
        }else{
            setCount((all - (all % 3))/3 + 1)
        }
    },[])
    return (
        <div className='shop_page'>
            <div className='left_sidebar'>
                <h5>Search</h5>
                <div className='line'></div>
                <div className='search_field'>
                    <OutlinedInput style={{width:'100%'}} placeholder='Search Our Store' type='text' />
                    <i className="fa fa-search" aria-hidden="true"></i>
                </div>
                <h5>Menu Categories</h5>
                <div className='line'></div>
                <p>Breads</p>
                <p>Fruits</p>
                <p>Vegestables</p>
                <p>Organic Food</p>
                <h5>Categories</h5>
                <div className='line'></div>
                <p>All Products</p>
                <p>Best Seller</p>
                <p>Featured</p>
                <p>New Products</p>
                <h5>Recents Products</h5>
                <div className='line'></div>
                <div className='recent_list'>
                    {
                        FruitData.slice(0,3).map(item =>{
                            return <ProductItem key={item.id} fruit={item} recent/>
                        })
                    }
                </div>
            </div>
            <div className='shop_list'>
                <div className='fruits_list'>
                    {
                        BlogData.slice((page-1)*3,page*3).map(item => {
                            return <BlogItem key={item.id} blog={item} list/>
                        })
                    }
                </div>
                <div style={{height:'50px',marginTop:'2rem',justifyContent:'space-between'}} className='nav_option results'>
                    <Stack style={{marginLeft:'1rem'}} spacing={2}>
                        <Pagination count={count} variant="outlined" shape="rounded" color='primary' page={page} onChange={handleChangePage} />
                    </Stack>
                    <p>Showing {(page - 1)*3 + 1} - {page === count ? BlogData.length : page*3 } of {BlogData.length} results</p>
                </div>
            </div>
        </div>
    );
}

export default Blog;
