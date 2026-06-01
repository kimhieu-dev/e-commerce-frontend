import axiosInstance from '../api/axiosInstance';

export const getCategoriesApi = async () => {
  try {
    const response = await axiosInstance.get('/api/v1/categories');
    return response.data; // Trả về BaseResponse<List<CategoryRes>>
  } catch (error) {
    throw error.response?.data || "Không thể lấy danh sách danh mục";
  }
};
