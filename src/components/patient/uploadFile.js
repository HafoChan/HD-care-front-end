import { Avatar, LinearProgress, Snackbar } from "@mui/material";
import { Component } from "react";
import UploadFilesService from "../../service/otherService/upload";
import { getImg } from "../../service/otherService/localStorage";

export default class UploadFiles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedFiles: [],
      currentFiles: [],
      progress: 0,
      message: "",
      openSnackbar: false,

      fileInfos: [],
    };
  }

  componentDidMount() {
    // Kiểm tra có initialImage hay không
    if (this.props.initialImage && this.props.coverImageUpload) {
      // Thêm initialImage vào fileInfos nếu có
      this.setState({
        fileInfos: [this.props.initialImage],
      });
    }
  }

  componentDidUpdate(prevProps) {
    // Kiểm tra khi initialImage thay đổi
    if (
      this.props.initialImage !== prevProps.initialImage &&
      this.props.coverImageUpload
    ) {
      this.setState({
        fileInfos: this.props.initialImage ? [this.props.initialImage] : [],
      });
    }
  }

  selectFile = (event) => {
    const files = Array.from(event.target.files);

    // Kiểm tra số lượng file
    if (files.length > 4) {
      this.setState({
        message: "Bạn chỉ được chọn tối đa 4 ảnh!",
        openSnackbar: true,
      });
      // Reset input file
      this.fileInput.value = "";
      return;
    }

    this.setState(
      {
        selectedFiles: files,
      },
      () => {
        if (this.state.selectedFiles.length > 0) {
          this.upload();
        }
      }
    );
  };

  handleCloseSnackbar = () => {
    this.setState({ openSnackbar: false });
  };

  upload = () => {
    const { selectedFiles } = this.state;

    this.setState({
      progress: 0,
      currentFiles: selectedFiles,
    });

    UploadFilesService.upload(selectedFiles, (event) => {
      this.setState({
        progress: Math.round((100 * event.loaded) / event.total),
      });
    })
      .then((response) => {
        this.setState({
          message: response.message,
        });
        console.log("Result is : " + response);
        return response.result; //test
      })
      .then((files) => {
        this.setState((prevState) => ({
          fileInfos: [...prevState.fileInfos, ...files],
        }));
        console.log("Files uploaded successfully:", files);
        this.props.askUrl(files);
        setTimeout(() => {
          this.setState({ progress: 101 });
        }, 1000);
      })
      .catch(() => {
        this.setState({
          progress: 0,
          message: "Could not upload the file!",
          currentFiles: [],
        });
      });

    this.setState({
      selectedFiles: [],
    });
  };

  render() {
    const {
      selectedFiles,
      currentFiles,
      progress,
      message,
      fileInfos,
      openSnackbar,
    } = this.state;
    const { allowAvatarUpload, coverImageUpload } = this.props;

    return (
      <div>
        <label className="btn btn-default">
          <input
            type="file"
            onChange={this.selectFile}
            multiple={!allowAvatarUpload && !coverImageUpload}
            ref={(ref) => (this.fileInput = ref)}
            style={{ display: "none" }}
          />
          {allowAvatarUpload ? (
            <Avatar
              src={fileInfos.length > 0 ? fileInfos[0] : getImg()}
              sx={{ width: 140, height: 140, marginRight: 10 }}
            />
          ) : coverImageUpload ? (
            <div style={{ width: "100%", textAlign: "center" }}>
              {fileInfos.length > 0 ? (
                <img
                  src={fileInfos[0]}
                  alt="Cover"
                  style={{
                    width: "100%",
                    maxWidth: 400,
                    height: 200,
                    objectFit: "cover",
                    borderRadius: "8px",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 600,
                    maxWidth: 800,
                    height: 200,
                    border: "2px dashed #ccc",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    backgroundColor: "#f5f5f5",
                    margin: "0 auto",
                  }}
                >
                  <span style={{ color: "#666" }}>Click để chọn ảnh bìa</span>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {fileInfos.length > 0 &&
                  fileInfos.map((file, index) => (
                    <img
                      key={index}
                      src={file}
                      style={{ width: "45%", height: "auto", margin: "2.5%" }} // Adjust width and margin for 2 images per row
                    />
                  ))}
              </div>
              <button
                onClick={() => this.fileInput.click()}
                className="btn btn-upload"
                style={{
                  backgroundColor: "#4CAF50", // Green background
                  border: "none", // Remove border
                  color: "white", // White text
                  padding: "15px 32px", // Padding
                  textAlign: "center", // Centered text
                  textDecoration: "none", // Remove underline
                  display: "inline-block", // Inline-block display
                  fontSize: "16px", // Font size
                  margin: "4px 2px", // Margin
                  cursor: "pointer", // Pointer cursor on hover
                  borderRadius: "8px", // Rounded corners
                  transition: "background-color 0.3s", // Smooth transition
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#45a049")
                } // Darker green on hover
                onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")} // Original color on mouse out
              >
                Upload
              </button>
            </div>
          )}
        </label>

        {currentFiles.length > 0 && progress < 101 && (
          <div
            style={{ marginTop: 10, marginLeft: allowAvatarUpload ? -50 : 150 }}
          >
            <LinearProgress
              variant="determinate"
              value={progress}
              style={{ width: 180 }}
            />
            <div style={{ marginLeft: -120 }}>{progress}%</div>
          </div>
        )}

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={this.handleCloseSnackbar}
          message="Bạn chỉ được chọn tối đa 4 ảnh!"
        />
      </div>
    );
  }
}
