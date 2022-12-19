import React from 'react';
import logo from '../image/logo.png'

const Footer = () => {
    return (
        <div className='footer'>
            <div className='footer_item'>
               <img alt='' src={logo} />
               <p>Obrien is the best parts shop of your daily nutritions. What kind of nutrition do you need you can get here soluta nobis</p>
               <div className='icon_social'>
                    <i title='Facebook' class="fa fa-facebook" aria-hidden="true"></i>
                    <i title='Twitter' class="fa fa-twitter" aria-hidden="true"></i>
                    <i title='Linkedin' class="fa fa-linkedin" aria-hidden="true"></i>
                    <i title='Youtube' class="fa fa-youtube" aria-hidden="true"></i>
                    <i title='Vimeo' class="fa fa-vimeo" aria-hidden="true"></i>
               </div>
            </div>
            <div className='footer_item'>
                <h5>Information</h5>
                <p>Our Company</p>
                <p>Contact Us</p>
                <p>Our Services</p>
                <p>Careers</p>
            </div>
            <div className='footer_item'>
                <h5>Quicklink</h5>
                <p>About</p>
                <p>Blog</p>
                <p>Shop</p>
                <p>Contact</p>
            </div>
            <div className='footer_item'>
                <h5>Support</h5>
                <p>Online Support</p>
                <p>Shipping Policy</p>
                <p>Return Policy</p>
                <p>Private Policy</p>
            </div>
            <div className='footer_item'>
                <h5>See Information</h5>
                <p>Phone: 0343414908</p>
                <p>Email: phamq720@gmail.com</p>
            </div>
        </div>
    );
}

export default Footer;
