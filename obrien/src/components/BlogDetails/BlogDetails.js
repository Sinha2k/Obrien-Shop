import React, { useState,useEffect,useRef } from 'react';
import { useParams } from 'react-router';
import BlogData from '../Data/blogData';
import Picker from "emoji-picker-react";
const BlogDetails = () => {
    const params = useParams()
    const [detailBlog,setDetailBlog] = useState([])
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const input = useRef(null)
    const focusInput = ()=>{
        input.current.focus()
    }
    useEffect(()=>{
        if(params){
            BlogData.forEach(blog => {
                if(blog.id == params.id){
                    setDetailBlog(blog)                   
                }
            })
        }
    },[params])
    return (
        <div className='blog_details'>
            <img alt='' src={detailBlog.attachment} />
            <h4>{detailBlog.title}</h4>
            <p>{detailBlog.description}</p>
            <h5><em>By: {detailBlog.author}</em></h5>
            <div className='prev_next'>
                <span><i className="fa fa-long-arrow-left" aria-hidden="true"></i> Older Blog</span>
                <span>Newer Blog <i className="fa fa-long-arrow-right" aria-hidden="true"></i></span>
            </div>
            <div className='line'></div>
            <div className='icons_story'>
                <i className={`fa fa-heart`} ></i>
                <i onClick={focusInput} className="fa fa-comment-o" ></i>
                <i className={`fa fa-bookmark`}></i>
            </div>
            <div style={{marginBottom:"7px"}} className='user_like'>
                <h6 style={{fontWeight:'400'}}>
                    100 người thích
                </h6>
            </div>
            <span className='show_comment' style={{cursor:"pointer",fontStyle:'italic',fontSize:"0.8rem",marginTop:"-1.5rem",textAlign:'left'}} >Xem thêm 0 bình luận</span>
            <div className='comment_input'>
                <input ref={input}  placeholder='Viết bình luận của bạn ...' />
                <h5>Đăng</h5>
            </div>
            <div className='emoji_cmt'>
                <i onClick={()=>setShowEmojiPicker(!showEmojiPicker)} className="fa fa-meh-o"></i>
                {showEmojiPicker && <Picker/>}
            </div>
        </div>
    );
}

export default BlogDetails;
