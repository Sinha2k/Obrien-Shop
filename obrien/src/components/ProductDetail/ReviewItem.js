import React from 'react';
import moment from 'moment'
import Rating from '../utils/ProductItem/Rating';

const ReviewItem = ({review}) => {
    return (
        <div className='review_item'>
            <img alt='' src={review.avatar}/>
            <div className='review_content'>
                <Rating value={review.rate}/>
                <p style={{marginTop:'10px',marginBottom:'10px'}}><strong>{review.name} - </strong>{moment(review.createdAt).format('LL')}</p>
                <p>{review.comment}</p>
            </div>
        </div>
    );
}

export default ReviewItem;
