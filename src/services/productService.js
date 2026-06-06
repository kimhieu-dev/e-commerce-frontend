import axiosInstance from '../api/axiosInstance';

/**
 * Lấy danh sách sản phẩm với bộ lọc và phân trang
 * @param {Object} params - Các tham số lọc (name, sku, minPrice, maxPrice, page, size, sort)
 */
export const getProductsApi = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/api/v1/products', { 
      params: {
        ...params,
        size: params.size || 12, // Mặc định size là 12 theo controller
        page: params.page || 0
      } 
    });
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
