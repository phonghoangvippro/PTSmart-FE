import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './features/home/HomePage';
import LoginPage from './features/auth/LoginPage';
import ProductList from './features/product/ProductList';
import ProductDetail from './features/product/ProductDetail';
import Cart from './features/cart/Cart';
import Checkout from './features/checkout/Checkout';
import Account from './features/account/Account';
import MyOrders from './features/account/MyOrders';
import Profile from './features/account/Profile';
import Payment from './features/account/Payment';
import MyPromotions from './features/account/MyPromotions';
import Address from './features/account/Address';
import Favorites from './features/account/Favorites';
import PromotionsPage from './features/promotions/PromotionsPage';
import ContactPage from './features/contact/ContactPage';
import FlashSalePage from './features/flashsale/FlashSalePage';
import NewsPage from './features/news/NewsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/laptops" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account/orders" element={<MyOrders />} />
          <Route path="/account/profile" element={<Profile />} />
          <Route path="/account/payment" element={<Payment />} />
          <Route path="/account/promotions" element={<MyPromotions />} />
          <Route path="/account/address" element={<Address />} />
          <Route path="/account/favorites" element={<Favorites />} />
          <Route path="/khuyen-mai" element={<PromotionsPage />} />
          <Route path="/lien-he" element={<ContactPage />} />
          <Route path="/flash-sale" element={<FlashSalePage />} />
          <Route path="/tin-tuc" element={<NewsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

