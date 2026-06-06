import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { loginApi } from '../../services/authService';

const LoginForm = ({ activeRole }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Gọi API đăng nhập qua service
      const data = await loginApi(formData.username, formData.password);

      if (data.code === 200) {
        const token = data.data.token;
        
        // Giải mã token để kiểm tra Role
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        const userRoles = decodedPayload.scope ? decodedPayload.scope.split(' ') : [];
        const requiredRole = `ROLE_${activeRole}`;

        if (!userRoles.includes(requiredRole)) {
          alert(`Tài khoản của bạn không có quyền truy cập với vai trò ${activeRole}`);
          setLoading(false);
          return;
        }

        // Lưu token JWT vào localStorage
        localStorage.setItem('authHeader', `Bearer ${token}`);
        
        // Chuyển hướng về trang chủ
        navigate('/');
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      alert(error.message || 'Đăng nhập thất bại. Hãy kiểm tra lại tài khoản.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
          Email hoặc Số điện thoại
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <Mail size={18} />
          </span>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-indigo-50 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="name@company.com"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
          Mật khẩu
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <Lock size={18} />
          </span>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg bg-indigo-50 focus:ring-blue-500 focus:border-blue-500 text-sm"
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

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-900 text-white font-semibold py-3 rounded-lg transition-all shadow-md active:scale-95"
      >
        {loading ? 'Đang xử lý...' : 'Đăng nhập vào hệ thống'}
        {!loading && <ArrowRight size={18} />}
      </button>
    </form>
  );
};

export default LoginForm;