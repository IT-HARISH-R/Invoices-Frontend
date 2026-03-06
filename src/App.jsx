import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Invoices from './pages/Invoices';
import CreateInvoice from './pages/CreateInvoice';
import ViewInvoice from './pages/ViewInvoice';
import Register from './pages/Register';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes with Layout */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/customers" element={
          <ProtectedRoute>
            <MainLayout>
              <Customers />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/products" element={
          <ProtectedRoute>
            <MainLayout>
              <Products />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/invoices" element={
          <ProtectedRoute>
            <MainLayout>
              <Invoices />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/invoices/create" element={
          <ProtectedRoute>
            <MainLayout>
              <CreateInvoice />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/invoices/:id" element={
          <ProtectedRoute>
            <MainLayout>
              <ViewInvoice />
            </MainLayout>
          </ProtectedRoute>
        } />

        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
  );
}

export default App;