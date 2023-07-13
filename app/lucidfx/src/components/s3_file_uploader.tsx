import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import React from 'react';
import 'dotenv/config';

const FileUploader = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [url, setUrl] = useState<string | null>(null);

    const getSignedPutUrlPromiseMutation = api.s3_service_router.getSignedPutUrlPromise.useMutation({
      onSuccess: (data) => {
        setUrl(data.url);
      },
      onError: (error) => {
        console.error('Error during the upload', error);
      }
    });

    useEffect(() => {
      if (file) {
        setUploading(true);
        getSignedPutUrlPromiseMutation.mutate();
      }
    }, [file]);

    useEffect(() => {
      if (url && file) {
        console.log('url', url);
        uploadFile(url, file);
      }
    }, [url, file]);

    const uploadFile = async (signedUrl: string, file: File) => {
      // Your logic to upload the file goes here
      // You can use 'url' and 'file' here
      const options = {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      };

      try {
        const response = await fetch(signedUrl, options);
        console.log('response', response);
        if (response.status !== 200) {
          throw new Error(`Could not upload file: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        setFile(event.target.files[0]);
      }
    };

  return (
  <div data-testid="file-uploader">
      <div>
        <input id="fileInput" type="file" onChange={onFileChange} className="hidden" />
        <label htmlFor="fileInput" className="cursor-pointer inline-block px-4 py-2 bg-blue-500 text-white rounded">
          Choose File to Upload 
        </label>
      </div>
    </div>
  );
};

export default FileUploader;
