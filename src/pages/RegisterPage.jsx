import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, Calendar, ArrowRight, Eye, EyeOff, UserCircle } from 'lucide-react';
import { registerApi } from '../services/authService';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phoneNumber: '',
    fullName: '',
    gender: 'MALE',
    dateBirth: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await registerApi(formData);
      if (response.code === 200) {
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      alert(error.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* Left side: Information (visible on large screens) */}
      <div className="hidden lg:flex lg:w-1/3 relative bg-blue-800 text-white p-12 flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-6">Tham gia cùng LogisticsPro</h2>
          <p className="text-blue-100 text-lg mb-8">
            Trải nghiệm hệ thống quản lý giao vận thông minh và hiện đại nhất hiện nay.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center text-xs">✓</div>
              Theo dõi đơn hàng thời gian thực
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center text-xs">✓</div>
              Ưu đãi dành riêng cho thành viên
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center text-xs">✓</div>
              Hỗ trợ khách hàng 24/7
            </li>
          </ul>
        </div>
      </div>

      {/* Right side: Registration Form */}
      <div className="w-full lg:w-2/3 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-2xl">
          <header className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Tạo tài khoản mới</h2>
            <p className="text-gray-500">Điền thông tin bên dưới để bắt đầu</p>
          </header>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Họ và tên */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Họ và tên</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <UserCircle size={18} />
                </span>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>
            </div>

            {/* Tên đăng nhập */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tên đăng nhập (8-12 ký tự)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="username123"
                  minLength={8}
                  maxLength={12}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="example@mail.com"
                  required
                />
              </div>
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Số điện thoại</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Phone size={18} />
                </span>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="0123456789"
                  pattern="^[0-9]{10}$"
                  required
                />
              </div>
            </div>

            {/* Ngày sinh */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ngày sinh</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Calendar size={18} />
                </span>
                <input
                  type="date"
                  name="dateBirth"
                  value={formData.dateBirth}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
              </div>
            </div>

            {/* Mật khẩu */}
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mật khẩu</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Giới tính */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Giới tính</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="MALE"
                    checked={formData.gender === 'MALE'}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Nam</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="FEMALE"
                    checked={formData.gender === 'FEMALE'}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Nữ</span>
                </label>
              </div>
            </div>

            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-900 text-white font-semibold py-3 rounded-lg transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang đăng ký...' : 'Tạo tài khoản ngay'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </div>
          </form>

          <footer className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-blue-700 font-semibold hover:underline">
                Đăng nhập ngay
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
