import { Avatar, LinearProgress } from "@mui/material";
import { Component } from "react";
import UploadFilesService from "../../service/otherService/upload";
import {getImg} from "../../service/otherService/localStorage"

export default class UploadFiles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedFiles: undefined,
      currentFile: undefined,
      progress: 0,
      message: "",

      fileInfos: [],
    };
  }

  selectFile = (event) => {
    this.setState(
      {
        selectedFiles: event.target.files,
      },
      () => {
        if (this.state.selectedFiles) {
          this.upload();
        }
      }
    );
  };

  upload = () => {
    // Hoặc, bạn có thể định nghĩa nó như một hàm mũi tên
    let currentFile = this.state.selectedFiles[0];

    this.setState({
      progress: 0,
      currentFile: currentFile,
    });

    UploadFilesService.upload(currentFile, (event) => {
      this.setState({
        progress: Math.round((100 * event.loaded) / event.total),
      });
    })
      .then((response) => {
        this.setState({
          message: response.message,
        });
        return response.result;
      })
      .then((files) => {
        this.setState({
          fileInfos: [...this.state.fileInfos, files],
        });
        console.log("file " + files)
        this.props.askUrl(files);

        setTimeout(() => {
          this.setState({ progress: 101 });
        }, 1000);
      })
      .catch(() => {
        this.setState({
          progress: 0,
          message: "Could not upload the file!",
          currentFile: undefined,
        });
      });

    this.setState({
      selectedFiles: undefined,
    });
  };

  render() {
    const { selectedFiles, currentFile, progress, message, fileInfos } =
      this.state;
    return (
      <div>
        <label className="btn btn-default">
          <input
            type="file"
            onChange={this.selectFile}
            multiple
            ref={(ref) => (this.fileInput = ref)}
            style={{ display: "none" }}
          />
            <Avatar
              src={
                this.state.fileInfos.length > 0 ? this.state.fileInfos[0] : getImg()
              }
              sx={{ width: 180, height: 180, marginRight: 10 }}
            />
        </label>
        {currentFile && progress < 101 && (
          <div style={{ marginTop: 10 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              style={{ width: 180 }}
            />
            <div>{progress}%</div>
          </div>
        )}
      </div>
    );
  }
}
