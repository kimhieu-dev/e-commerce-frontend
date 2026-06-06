import axiosInstance from '../api/axiosInstance'; // Đã đổi sang dùng axiosInstance để đúng convention

const API_URL = '/api/v1/auth';

export const loginApi = async (username, password) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/login`, {
            username,
            password
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || "Đăng nhập thất bại";
    }
};

export const logoutApi = async (token) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/logout`, {
            token
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || "Đăng xuất thất bại";
    }
};

export const registerApi = async (registerData) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/register`, registerData);
        return response.data;
    } catch (error) {
        throw error.response?.data || "Đăng ký thất bại";
    }
};