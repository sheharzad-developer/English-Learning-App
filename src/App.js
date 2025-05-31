import { Routes, Route } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import Home from './pages/Home';
import Login from './components/Auth/LoginForm';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import AdminDashboard from './components/Dashboard/AdminDashboard';

function App() {
  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute requiredRole={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
