import axiosClient from "./axios-instance";

// API tạo bài post mới
export const createPost = async (postData) => {
  try {
    const response = await axiosClient.post("social/posts", postData);
    return response.result;
  } catch (error) {
    throw error;
  }
};

// API kiểm tra xem user có chế độ riêng tư hay không
export const checkUserPrivate = async (userId) => {
  try {
    const response = await axiosClient.get(
      `social/users/check-private/${userId}`
    );
    return response.result; // Returns true if private, false if not private
  } catch (error) {
    throw error;
  }
};

// API cập nhật bài post
export const updatePost = async (postId, updateData) => {
  try {
    const response = await axiosClient.put(
      `social/posts/${postId}`,
      updateData
    );
    return response.result;
  } catch (error) {
    throw error;
  }
};

// API lấy bài post theo ID
export const getPostById = async (postId) => {
  try {
    const response = await axiosClient.get(`social/posts/${postId}`);
    return response.result;
  } catch (error) {
    throw error;
  }
};

// API lấy danh sách bài post của user hiện tại (userId lấy từ JWT ở backend)
export const getAllPostsByUser = async (page = 0, size = 10, userId) => {
  try {
    const response = await axiosClient.get(`social/users/${userId}/posts`, {
      params: { page, size },
    });
    return response.result;
  } catch (error) {
    throw error;
  }
};

// API xóa bài post
export const deletePost = async (postId) => {
  try {
    // Backend lấy userId từ JWT nên chỉ cần postId
    await axiosClient.delete(`social/posts/${postId}`);
  } catch (error) {
    throw error;
  }
};

// API tương tác với bài post (like/unlike)
export const interactPost = async (postId) => {
  try {
    await axiosClient.post(`social/posts/${postId}/interact`);
  } catch (error) {
    throw error;
  }
};

// API comment vào bài post
export const commentOnPost = async (postId, commentData) => {
  try {
    // Note: Backend lấy postId từ URL
    const response = await axiosClient.post(
      `social/posts/${postId}/comments`,
      commentData
    );
    return response.result;
  } catch (error) {
    throw error;
  }
};

// API cập nhật comment
export const updateComment = async (commentId, updateData) => {
  try {
    const response = await axiosClient.put(
      `social/comments/${commentId}`,
      updateData
    );
    return response.result;
  } catch (error) {
    throw error;
  }
};

// API xóa comment
export const deleteComment = async (commentId) => {
  try {
    await axiosClient.delete(`social/comments/${commentId}`);
  } catch (error) {
    throw error;
  }
};

// API lấy danh sách comment của bài post có phân trang
export const getAllCommentsByPost = async (postId, page = 0, size = 10) => {
  try {
    const response = await axiosClient.get(`social/posts/${postId}/comments`, {
      params: { page, size },
    });
    return response.result;
  } catch (error) {
    throw error;
  }
};

// API toggle lưu bài post (save/unsave)
export const toggleSavePost = async (postId) => {
  try {
    await axiosClient.post(`social/posts/${postId}/save`);
  } catch (error) {
    throw error;
  }
};

// API lấy danh sách bài post đã lưu (phân trang)
export const getAllSavedPosts = async (page = 0, size = 10) => {
  try {
    const response = await axiosClient.get(`social/posts/saved`, {
      params: { page, size },
    });
    return response.result;
  } catch (error) {
    throw error;
  }
};

// API follow/unfollow user (backend lấy userId từ JWT)
export const followUser = async (targetUserId) => {
  try {
    await axiosClient.post("social/users/follow", null, {
      params: { targetUserId },
    });
  } catch (error) {
    throw error;
  }
};

// API lấy danh sách user đang theo dõi (following) của người dùng hiện tại
export const getAllFollowingUsers = async (page = 0, size = 10, userId) => {
  try {
    const response = await axiosClient.get(`social/users/${userId}/following`, {
      params: { page, size },
    });
    return response.result;
  } catch (error) {
    throw error;
  }
};

// API lấy danh sách user theo dõi (followers) của người dùng hiện tại
export const getAllFollowers = async (page = 0, size = 10, userId) => {
  try {
    const response = await axiosClient.get(`social/users/${userId}/followers`, {
      params: { page, size },
    });
    return response.result;
  } catch (error) {
    throw error;
  }
};

// API chấp nhận yêu cầu follow
export const acceptFollowRequest = async (followRequestId) => {
  try {
    await axiosClient.post("social/users/accept-follow", null, {
      params: { followRequestId },
    });
  } catch (error) {
    throw error;
  }
};

// API từ chối yêu cầu follow
export const rejectFollowRequest = async (followRequestId) => {
  try {
    await axiosClient.delete("social/users/reject-follow", {
      params: { followRequestId },
    });
  } catch (error) {
    throw error;
  }
};

// API lấy danh sách follow requests (phân trang)
export const getAllFollowRequests = async (page = 0, size = 10) => {
  try {
    const response = await axiosClient.get("social/users/follow-requests", {
      params: { page, size },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// API lấy số lượng follow requests
export const countFollowRequests = async () => {
  try {
    const response = await axiosClient.get(
      "social/users/count-follow-requests"
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// API lấy danh sách follow requests đã gửi (phân trang)
export const getSentFollowRequests = async (page = 0, size = 10) => {
  try {
    const response = await axiosClient.get("social/users/send-follow-request", {
      params: { page, size },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// API lấy số lượng follow requests đã gửi
export const countSentFollowRequests = async () => {
  try {
    const response = await axiosClient.get(
      "social/users/count-send-follow-requests"
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// API lấy số lượng bài post của user
export const getCountPosts = async (userId) => {
  try {
    const response = await axiosClient.get(
      `social/users/count-posts/${userId}`
    );
    return response.result;
  } catch (error) {
    throw error;
  }
};

// API xóa yêu cầu theo dõi đã gửi
export const deleteFollowRequest = async (targetUserId) => {
  try {
    const response = await axiosClient.delete(
      `social/users/delete-follow-request/${targetUserId}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// API bật/tắt chế độ riêng tư
export const setPrivate = async () => {
  try {
    await axiosClient.post("social/users/private");
  } catch (error) {
    throw error;
  }
};

// API lấy danh sách bài post khám phá (phân trang)
export const discoverPosts = async (page = 0, size = 10) => {
  try {
    const response = await axiosClient.get(`social/posts/discover`, {
      params: { page, size },
    });
    return response.result;
  } catch (error) {
    throw error;
  }
};

// API lấy danh sách bài post mới nhất (phân trang)
export const getLatestPosts = async (page = 0, size = 10) => {
  try {
    const response = await axiosClient.get(`social/posts/latest`, {
      params: { page, size },
    });
    return response.result;
  } catch (error) {
    throw error;
  }
};

// API lấy danh sách bài post từ người theo dõi (phân trang)
export const getPostsFromFollowers = async (page = 0, size = 10) => {
  try {
    const response = await axiosClient.get(`social/posts/from-following`, {
      params: { page, size },
    });
    return response.result;
  } catch (error) {
    throw error;
  }
};

// API lấy danh sách người dùng đề xuất theo dõi (phân trang)
export const suggestUsersToFollow = async (page = 0, size = 10) => {
  try {
    const response = await axiosClient.get(`social/users/suggest-follow`, {
      params: { page, size },
    });
    return response.result;
  } catch (error) {
    throw error;
  }
};

// API tìm kiếm bài viết theo từ khóa (phân trang)
export const searchPosts = async (keyword, page = 0, size = 10) => {
  try {
    const response = await axiosClient.get(`social/posts/search`, {
      params: { keyword, page, size },
    });
    return response.result;
  } catch (error) {
    throw error;
  }
};
