import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AnecdotesPage from './components/AnecdotesPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

function AppContent() {
  const { currentUser } = useAuth();

  return (
    <div>
      <Navbar />
      <Container className="mt-4">
        <Routes>
          <Route path="/login" element={!currentUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/register" element={!currentUser ? <RegisterPage /> : <Navigate to="/" />} />
          <Route path="/" element={currentUser ? <AnecdotesPage /> : <Navigate to="/login" />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;