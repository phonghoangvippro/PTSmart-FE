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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
