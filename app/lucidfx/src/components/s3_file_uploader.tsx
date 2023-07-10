import { useEffect, useState } from 'react';
import { api } from '../utils/api';

const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const parameters = {
    Bucket: 'testBucket',
    Key: 'testKey',
    Expires: 60,
  };

  const { data: url, isLoading, isError, error } = api.s3_service_router.getSignedUrlPromise.useQuery({ operation: 'putObject', parameters });

  useEffect(() => {
    const onUpload = async () => {
      setUploading(true);
      try {
        // Use `url` to upload the file
        // ...
      } catch (error) {
        console.error('Error during the upload', error);
      } finally {
        setUploading(false);
      }
    };
    if (file && url) {
      onUpload();
    }
  }, [file, url]);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError && error) {
    return <div>Error: {error.message}</div>;
  }

  return (
  <div data-testid="file-uploader">
      <div>
        <input id="fileInput" type="file" onChange={onFileChange} className="hidden" />
        <label htmlFor="fileInput" className="cursor-pointer inline-block px-4 py-2 bg-blue-500 text-white rounded">
          Choose File
        </label>
        <button disabled={isLoading || !file} className={`ml-2 inline-block px-4 py-2 rounded ${isLoading || !file ? 'bg-gray-500' : 'bg-blue-500'} text-white`}>
          {isLoading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  );
};

export default FileUploader;
