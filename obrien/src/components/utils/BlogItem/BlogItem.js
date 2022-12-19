import React from 'react';

const BlogItem = ({blog,list}) => {
    return (
        <a href={`/blog/detail/${blog.id}`}>
            <div className={`blog_card ${list ? 'blog_list' : ''}`}>
                <img alt='' src={blog.attachment} />
                <div className='blog_content'>
                    <div className='blog_time'>
                        <h4>{blog.createdAt.getDate()}</h4>
                        <h4>{blog.createdAt.getMonth()+1}</h4>
                    </div>
                    <div className='blog_info'>
                        <p>Author: {blog.author}</p>
                        <h4>{blog.title}</h4>
                        <p>{blog.description}</p>
                    </div>
                </div>
            </div>
        </a>
    );
}

export default BlogItem;
