import axios from 'axios';

const API_URL = 'http://localhost:8022/api/v1/auth'; // Port theo api-docs.json

export const loginApi = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            username,
            password
        });
        return response.data; // Trả về BaseResponseLoginRes
    } catch (error) {
        throw error.response?.data || "Đăng nhập thất bại";
    }
};