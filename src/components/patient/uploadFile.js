import { Avatar, LinearProgress } from "@mui/material";
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

      fileInfos: [],
    };
  }

  selectFile = (event) => {
    this.setState(
      {
        selectedFiles: Array.from(event.target.files),
      },
      () => {
        if (this.state.selectedFiles.length > 0) {
          console.log("Selected files: ", this.state.selectedFiles);
          this.upload();
        }
      }
    );
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
        console.log(response.result);
        return response.result; //test 
      })
        .then((response) => {
          this.setState({
            message: response.message,
          });
          return response.result;
        })
        .then((files) => {
          this.setState((prevState) => ({
            fileInfos: [...prevState.fileInfos, ...files],
          }));
          console.log(files.length)
          if (files.length > 1)
            this.props.askUrl(files);
          else
          {
            this.props.askUrl(files[0])
            console.log("result : " + files[0])
          }
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
      });

    this.setState({
      selectedFiles: [],
    });
  };

  render() {
    const { selectedFiles, currentFiles, progress, message, fileInfos } =
      this.state;
    const { allowAvatarUpload } = this.props;
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
          {allowAvatarUpload ? (
            <Avatar
              src={fileInfos.length > 0 ? fileInfos[0] : getImg()}
              sx={{ width: 140, height: 140, marginRight: 10 }}
            />
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
            <div style={{ marginLeft: -175 }}>{progress}%</div>
          </div>
        )}
      </div>
    );
  }
}
