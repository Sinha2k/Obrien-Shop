import React from 'react';

const NotFound = () => {
    return (
        <div className='notfound_page'>
            <h1>404</h1>
            <h3>OOPS! PAGE NOT BE FOUND</h3>
            <p>Sorry but the page you are looking for does not exist, have been
            <br/>removed, name changed or is temporarily unavailable.</p>
            <a href='/'>BACK TO HOME PAGE</a>
        </div>
    );
}

export default NotFound;
