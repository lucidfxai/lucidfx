// src/pages/FileUpload.tsx
import { Uploader } from 'uploader';
import { UploadDropzone } from 'react-uploader';

const uploader = Uploader({ apiKey: "public_W142i1DENNrZY6RSN39Ciy5rMCc5" }); // Your real API key.
const uploaderOptions = {
  maxFileCount: 1,
  multi: false,
  showFinishButton: true,
  styles: {
    colors: {
      primary: "#377dff"
    }
  }
}

const FileUpload = () => (
  <UploadDropzone uploader={uploader}
                  options={uploaderOptions}
                  onUpdate={files => console.log(files.map(x => x.fileUrl).join("\n"))}
                  onComplete={files => alert(files.map(x => x.fileUrl).join("\n"))}
                  width="600px"
                  height="375px" />
)

export default FileUpload;
