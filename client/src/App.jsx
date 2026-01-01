import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import Layout from './components/Layout';
import Home from './pages/Home';
import Test from './pages/Test';
import Login from './pages/Login';
import Register from './pages/Register';
import Incidents from './pages/Incidents';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route 
                path="incidents" 
                element={
                  <ProtectedRoute>
                    <Incidents />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="test" 
                element={
                  <ProtectedRoute>
                    <Test />
                  </ProtectedRoute>
                } 
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
