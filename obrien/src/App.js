import './App.css';
import { DataProvider } from './GlobalState';
import {Provider} from 'react-redux'
import HomePage from './components/Homepage/HomePage';
import Navbar from './components/Navbar/Navbar';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Footer from './components/Footer/Footer';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Login from './components/Auth/Login/Login';
import HeaderPage from './components/utils/HeaderPage/HeaderPage';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Register from './components/Auth/Register/Register';
import Shop from './components/Shop/Shop';
import Blog from './components/Blog/Blog';
import ProductDetail from './components/ProductDetail/ProductDetail';
import BlogDetails from './components/BlogDetails/BlogDetails';
import Cart from './components/Cart/cart';
import CheckOut from './components/Cart/CheckOut';
import MyAccount from './components/MyAccount/MyAccount';
import store from './redux_toolkit/store';
import WishList from './components/WishList/WishList';
import NotFound from './components/utils/NotFound/NotFound';

const theme = createTheme({
  palette: {
    primary:{
      main: '#e98c81',
    },
  },
})
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <DataProvider>
          <Router>
            <Routes>
              <Route path='/' element={
                <div className="App">
                    <Navbar />
                    <HomePage />
                    <Footer/>
                </div>
              }/>
              <Route path='/login' element={
                <div className="App">
                    <Navbar />
                    <HeaderPage content={'Login - Register'} />
                    <Login />
                    <Footer/>
                </div>
              }/>
              <Route path='/register' element={
                <div className="App">
                    <Navbar />
                    <HeaderPage content={'Login - Register'} />
                    <Register/>
                    <Footer/>
                </div>
              }/>
              <Route path='/shop' element={
                <div className="App">
                    <Navbar />
                    <HeaderPage content={'Shop'} />
                    <Shop />
                    <Footer/>
                </div>
              }/>
              <Route path='/blogs' element={
                <div className="App">
                    <Navbar />
                    <HeaderPage content={'Blog'} />
                    <Blog />
                    <Footer/>
                </div>
              }/>
              <Route path='/product/detail/:id' element={
                <div className="App">
                    <Navbar />
                    <HeaderPage content={'Product Details'} />
                    <ProductDetail />
                    <Footer/>
                </div>
              }/>
              <Route path='/blog/detail/:id' element={
                <div className="App">
                    <Navbar />
                    <HeaderPage content={'Blog Details'} />
                    <BlogDetails />
                    <Footer/>
                </div>
              }/>
              <Route path='/cart' element={
                <div className="App">
                    <Navbar />
                    <HeaderPage content={'Shopping Cart'} />
                    <Cart />
                    <Footer/>
                </div>
              }/>
              <Route path='/wish-list' element={
                <div className="App">
                    <Navbar />
                    <HeaderPage content={'Wish List'} />
                    <WishList />
                    <Footer/>
                </div>
              }/>
              <Route path='/checkout' element={
                <div className="App">
                    <Navbar />
                    <HeaderPage content={'Checkout'} />
                    <CheckOut />
                    <Footer/>
                </div>
              }/>
              <Route path='/my-account' element={
                <div className="App">
                    <Navbar />
                    <HeaderPage content={'My Account'} />
                    <MyAccount/>
                    <Footer/>
                </div>
              }/>
              <Route path='/error' element={
                <div className="App">
                    <Navbar />
                    <HeaderPage content={'Error 404'} />
                    <NotFound />
                    <Footer/>
                </div>
              }/>
            </Routes>
          </Router>
        </DataProvider>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
