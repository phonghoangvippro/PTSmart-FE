import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './features/auth/AdminLogin';
import ProtectedRoute from './shared/components/ProtectedRoute';
import Dashboard from './features/dashboard/Dashboard';
import ProductList from './features/products/ProductList';
import ProductEdit from './features/products/ProductEdit';
import OrderList from './features/orders/OrderList';
import CategoryList from './features/categories/CategoryList';
import UserList from './features/users/UserList';
import Settings from './features/settings/Settings';
import BrandList from './features/brands/BrandList';
import DiscountList from './features/discounts/DiscountList';
import FlashSaleList from './features/flashsales/FlashSaleList';
import ArticleList from './features/articles/ArticleList';
import ContactList from './features/contacts/ContactList';
import PromotionList from './features/promotions/PromotionList';
import BranchList from './features/branches/BranchList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
          <Route path="/admin/products/new" element={<ProtectedRoute><ProductEdit /></ProtectedRoute>} />
          <Route path="/admin/products/:id/edit" element={<ProtectedRoute><ProductEdit /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute><OrderList /></ProtectedRoute>} />
          <Route path="/admin/categories" element={<ProtectedRoute><CategoryList /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/admin/brands" element={<ProtectedRoute><BrandList /></ProtectedRoute>} />
          <Route path="/admin/discounts" element={<ProtectedRoute><DiscountList /></ProtectedRoute>} />
          <Route path="/admin/flash-sales" element={<ProtectedRoute><FlashSaleList /></ProtectedRoute>} />
          <Route path="/admin/articles" element={<ProtectedRoute><ArticleList /></ProtectedRoute>} />
          <Route path="/admin/contacts" element={<ProtectedRoute><ContactList /></ProtectedRoute>} />
          <Route path="/admin/promotions" element={<ProtectedRoute><PromotionList /></ProtectedRoute>} />
          <Route path="/admin/branches" element={<ProtectedRoute><BranchList /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

