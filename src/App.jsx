import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import Login from './Login';
import AdminDashboard from './Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route 
            path="/admin/dashboard" 
            element={
            
                <AdminDashboard />
             
            } 
          />
      </Routes>
    </Router>
  );
}

export default App;