import  { useState } from 'react';
import CartData from '../Data/cartData';
const UserApi = () => {
    const [cart,setCart] = useState(CartData)
    const addCart = (product)=>{
        const check = cart.every(item =>{
            return item.id !== product.id
        })
        if(check){
            setCart([...cart,{...product}])
            // await axios.patch('/user/addCart', {cart : [...cart,{...product,quantity:1,size:size, sizePrice: sizePrice}]},{
            //     headers: {Authorization:token}
            // })
            // toast.success("Thêm vào giỏ hàng thành công")
        }else{
            return null
        }
    }
    return {
        addCart: addCart,
        cart: [cart,setCart]
    };
}

export default UserApi;
