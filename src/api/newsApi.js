// src/api/newsApi.js
import axiosClient from "./axios-instance";

// Tạo tin tức mới
export const createNews = async (newsData) => {
  try {
    const response = await axiosClient.post("news", newsData);
    return response.result;
  } catch (error) {
    throw error;
  }
};

// Lấy tin tức theo ID
export const getNewsById = async (newsId) => {
  try {
    const response = await axiosClient.get(`news/${newsId}`);
    return response.result;
  } catch (error) {
    throw error;
  }
};

// Lấy tất cả tin tức với phân trang
export const getAllNews = async (page = 0, size = 10) => {
  try {
    const response = await axiosClient.get("news", {
      params: { page, size },
    });
    return response.result;
  } catch (error) {
    throw error;
  }
};

// Lấy tin tức mới nhất
export const getNewestNews = async (limit = 5) => {
  try {
    const response = await axiosClient.get("news/latest", {
      params: { limit },
    });
    return response.result;
  } catch (error) {
    throw error;
  }
};

// Lấy tin tức nổi bật (theo lượt interactUseful)
export const getFeaturedNews = async (limit = 5) => {
  try {
    const response = await axiosClient.get("news/featured", {
      params: { limit },
    });
    return response.result;
  } catch (error) {
    throw error;
  }
};

// Lấy tin tức theo danh mục với phân trang
export const getNewsByCategory = async (category, page = 0, size = 10) => {
  try {
    const response = await axiosClient.get(`news/category/${category}`, {
      params: { page, size },
    });
    return response.result;
  } catch (error) {
    throw error;
  }
};

// Tìm tin tức theo từ khóa với phân trang
export const searchNews = async (keyword, page = 0, size = 10) => {
  try {
    const response = await axiosClient.get("news/search", {
      params: { keyword, page, size },
    });
    return response.result;
  } catch (error) {
    throw error;
  }
};

// Cập nhật tin tức (dành cho tin nháp)
export const updateNews = async (newsId, updateData) => {
  try {
    const response = await axiosClient.put(`news/${newsId}`, updateData);
    return response.result;
  } catch (error) {
    throw error;
  }
};

// Xóa tin tức; backend sẽ kiểm tra quyền dựa trên JWT
export const deleteNews = async (newsId) => {
  try {
    await axiosClient.delete(`news/${newsId}`);
  } catch (error) {
    throw error;
  }
};

// Duyệt tin tức (hoặc hủy duyệt nếu approve=false)
export const approveNews = async (newsId, approve = true) => {
  try {
    const response = await axiosClient.post(`news/${newsId}`, null, {
      params: { approve },
    });
    return response.result;
  } catch (error) {
    throw error;
  }
};

// Phân công tin tức cho bác sĩ duyệt (dành cho admin)
export const assignNewsToDoctor = async (newsId, doctorId) => {
  try {
    const response = await axiosClient.post(
      `news/${newsId}/assign/${doctorId}`
    );
    return response.result;
  } catch (error) {
    throw error;
  }
};

// Tương tác với tin tức: tăng lượt useful hoặc useless
export const interactWithNews = async (newsId, isUseful) => {
  try {
    await axiosClient.post(`news/${newsId}/interact`, null, {
      params: { isUseful },
    });
  } catch (error) {
    throw error;
  }
};

// Lưu tin tức vào mục yêu thích (toggle: nếu chưa lưu thì lưu, nếu đã lưu thì hủy lưu)
export const toggleFavoriteNews = async (newsId) => {
  try {
    await axiosClient.post(`news/${newsId}/favorite`);
  } catch (error) {
    throw error;
  }
};

// Xóa tin tức khỏi mục yêu thích (backend có thể sử dụng phương thức DELETE)
export const deleteFavoriteNews = async (newsId) => {
  try {
    await axiosClient.delete(`news/${newsId}/favorite`);
  } catch (error) {
    throw error;
  }
};

// Lấy danh sách tin tức đã lưu vào mục yêu thích của người dùng với phân trang
export const getAllFavoriteNews = async (page = 0, size = 10) => {
  try {
    const response = await axiosClient.get("news/favorites", {
      params: { page, size },
    });
    return response.result;
  } catch (error) {
    throw error;
  }
};

// Lấy tin tức theo bác sĩ và trạng thái (draft, approved, rejected, review)
export const getNewsByDoctorAndStatus = async (status, page = 0, size = 10) => {
  try {
    const response = await axiosClient.get("news/doctor", {
      params: { status, page, size },
    });
    return response.result;
  } catch (error) {
    throw error;
  }
};

// Lấy tin tức đã được phê duyệt bởi một bác sĩ cụ thể
export const getNewsByDoctorId = async (doctorId, page = 0, size = 10) => {
  try {
    const response = await axiosClient.get(`news/doctor/${doctorId}`, {
      params: { page, size },
    });
    return response.result;
  } catch (error) {
    throw error;
  }
};

// Lấy danh sách tin tức được giao cho bác sĩ hiện tại để duyệt
export const getAssignedNewsToDoctor = async (page = 0, size = 10) => {
  try {
    const response = await axiosClient.get("news/doctor/assigned", {
      params: { page, size },
    });
    return response.result;
  } catch (error) {
    throw error;
  }
};

// Lấy danh sách tin tức đã được bác sĩ hiện tại duyệt (đã chấp nhận hoặc từ chối)
export const getNewsReviewedByDoctor = async (
  approved,
  page = 0,
  size = 10
) => {
  try {
    const response = await axiosClient.get("news/doctor/reviewed", {
      params: { approved, page, size },
    });
    return response.result;
  } catch (error) {
    throw error;
  }
};

// Lấy danh sách tin tức đang chờ duyệt (dành cho admin)
export const getPendingNews = async (page = 0, size = 10) => {
  try {
    const response = await axiosClient.get("news/pending", {
      params: { page, size },
    });
    return response.result;
  } catch (error) {
    throw error;
  }
};
