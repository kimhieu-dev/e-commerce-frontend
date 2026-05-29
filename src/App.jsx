import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

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

// Component bọc dành cho trang Login để tránh việc đã đăng nhập rồi lại quay lại Login
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
        
        {/* Route Trang chủ (Đã được bảo vệ) */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <HomePage />
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