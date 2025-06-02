import axiosClient from "../../api/axios-instance";

class UploadFilesService {
  upload(file, onUploadProgress) {
    let formData = new FormData();
    file.forEach((file) => {
      formData.append("file", file); // Ensure the key matches what the backend expects
    });

    return axiosClient.post("/patient/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  // Upload single image for news cover
  uploadSingleImage(file, onUploadProgress) {
    let formData = new FormData();
    formData.append("file", file);

    return axiosClient.post("/patient/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }
}

export default new UploadFilesService();
