import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './shared/components/ProtectedRoute';
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/laptops" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="/account/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path="/account/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/account/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/account/promotions" element={<ProtectedRoute><MyPromotions /></ProtectedRoute>} />
          <Route path="/account/address" element={<ProtectedRoute><Address /></ProtectedRoute>} />
          <Route path="/account/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/khuyen-mai" element={<ProtectedRoute><PromotionsPage /></ProtectedRoute>} />
          <Route path="/lien-he" element={<ProtectedRoute><ContactPage /></ProtectedRoute>} />
          <Route path="/flash-sale" element={<ProtectedRoute><FlashSalePage /></ProtectedRoute>} />
          <Route path="/tin-tuc" element={<ProtectedRoute><NewsPage /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


