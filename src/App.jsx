import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/layout/ErrorBoundary';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminEntry from './components/layout/AdminEntry';
import Home from './pages/public/Home';
import Services from './pages/public/Services';
import Book from './pages/public/Book';
import Contact from './pages/public/Contact';
import About from './pages/public/About';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminBookings from './pages/admin/Bookings';
import AdminCustomers from './pages/admin/Customers';
import AdminEmails from './pages/admin/Emails';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/book" element={<Book />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
            </Route>
            <Route path="/admin" element={<AdminEntry />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/bookings" element={<ProtectedRoute><AdminBookings /></ProtectedRoute>} />
            <Route path="/admin/customers" element={<ProtectedRoute><AdminCustomers /></ProtectedRoute>} />
            <Route path="/admin/emails" element={<ProtectedRoute><AdminEmails /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
