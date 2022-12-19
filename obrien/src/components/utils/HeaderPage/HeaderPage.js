import React from 'react';

const HeaderPage = ({content}) => {
    return (
        <div className='header_page'>
            <h5>{content}</h5>
            <ul>
                <li><a href='/'>Home</a></li>
                <li><i style={{fontWeight:'700'}} className="fa fa-angle-right" aria-hidden="true"></i></li>
                <li>{content}</li>
            </ul>
            <div className='layout'></div>
        </div>
    );
}

export default HeaderPage;
