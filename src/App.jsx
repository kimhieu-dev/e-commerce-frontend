import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';

// Component bọc bảo vệ Route - Tự động kiểm tra trạng thái thời gian thực
const ProtectedRoute = ({ children }) => {
  const hasAuth = !!localStorage.getItem('authHeader');
  
  if (!hasAuth) {
    // Nếu chưa đăng nhập, ép buộc chuyển hướng về trang login
    return <Navigate to="/login" replace />;
  }
  
  // Nếu đã có thông tin đăng nhập, cho phép hiển thị trang bên trong (HomePage)
  return children;
};

// Component bọc dành cho trang Login/Register để tránh việc đã đăng nhập rồi lại quay lại
const PublicRoute = ({ children }) => {
  const hasAuth = !!localStorage.getItem('authHeader');
  
  if (hasAuth) {
    // Nếu đã đăng nhập thành công trước đó, đẩy thẳng vào trang chủ
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route Đăng nhập */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />

        {/* Route Đăng ký */}
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } 
        />
        
        {/* Route Trang chủ (Đã được bảo vệ) */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/product/:id" 
          element={
            <ProtectedRoute>
              <ProductDetailPage />
            </ProtectedRoute>
          } 
        />

        {/* Bất kỳ đường dẫn lạ nào đều điều hướng về trang chủ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;