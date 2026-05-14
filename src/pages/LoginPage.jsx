import { useState } from 'react';
import RoleSelector from '../components/Login/RoleSelector';
import LoginForm from '../components/Login/LoginForm';

const LoginPage = () => {
  const [activeRole, setActiveRole] = useState('USER');

  return (
    <div className="min-h-screen flex font-sans">
      {/* Bên trái: Branding & Stats (Chỉ hiện trên Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-800 text-white p-16 flex-col justify-between overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="p-2 bg-white rounded-lg">
              <div className="w-6 h-6 bg-blue-800 rounded-sm flex items-center justify-center font-bold">L</div>
            </div>
            <span className="text-2xl font-bold tracking-tight">LogisticsPro</span>
          </div>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            Chuyên nghiệp hóa <br /> mọi điểm chạm giao vận.
          </h1>
          <p className="text-blue-100 text-lg max-w-md">
            Hệ thống quản lý chuỗi cung ứng tối ưu, kết nối liền mạch giữa Khách hàng, Shipper và Đội ngũ Admin.
          </p>
        </div>

        <div className="relative z-10 flex gap-12 border-t border-blue-700 pt-12">
          <div>
            <div className="text-3xl font-bold">1.2M+</div>
            <div className="text-sm text-blue-200 uppercase">Đơn hàng/Tháng</div>
          </div>
          <div>
            <div className="text-3xl font-bold">99.9%</div>
            <div className="text-sm text-blue-200 uppercase">Tỷ lệ chính xác</div>
          </div>
        </div>
      </div>

      {/* Bên phải: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <header className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Chào mừng trở lại</h2>
            <p className="text-gray-500">Vui lòng chọn vai trò và đăng nhập vào hệ thống</p>
          </header>

          <RoleSelector activeRole={activeRole} setActiveRole={setActiveRole} />
          
          <LoginForm activeRole={activeRole} />

          <footer className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Chưa có tài khoản? <span className="text-blue-700 font-semibold cursor-pointer hover:underline">Đăng ký ngay</span>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;