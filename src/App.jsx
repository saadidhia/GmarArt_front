import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import Login from './Login';
import AdminDashboard from './Dashboard';
import PaintingDetail from './PaintingDetail';
import CartPage from './CartPage';
import About from './About';
import Commission from './Commission';
import LimitedEditionPrints from './LimitedEditionPrints';
import { CartProvider } from './CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/commission" element={<Commission />} />
          <Route path="/limited-edition-prints" element={<LimitedEditionPrints />} />
          <Route path="/admin/ferouk/login" element={<Login />} />
          <Route path="/admin/ferouk/dashboard" element={<AdminDashboard />} />
          <Route path="/:slug/:id" element={<PaintingDetail />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;