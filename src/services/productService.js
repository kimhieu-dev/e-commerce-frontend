import axiosInstance from '../api/axiosInstance';

export const getProductsApi = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/api/v1/products', { params });
    return response.data; // Trả về BaseResponse<List<ProductRes>>
  } catch (error) {
    throw error.response?.data || "Không thể lấy danh sách sản phẩm";
  }
};

export const getProductByIdApi = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/v1/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Không thể lấy thông tin sản phẩm";
  }
};
