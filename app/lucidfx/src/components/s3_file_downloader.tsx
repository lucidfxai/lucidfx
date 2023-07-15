import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import React from 'react';
import 'dotenv/config';

const FileDownloader = () => {
    const [filekey, setFileKey] = useState<string | null>(null);
    const [downloading, setDownloading] = useState(false);
    const [url, setDownloadUrl] = useState<string | null>(null);

    const getSignedGetUrlPromiseMutation = api.s3_service_router.getSignedGetUrlPromise.useMutation({
      onSuccess: (data) => {
        setDownloadUrl(data);
      },
      onError: (error) => {
        console.error('Error during the upload', error);
      }
    });

    useEffect(() => {
      if (filekey) {
        setDownloading(true);
        getSignedGetUrlPromiseMutation.mutate(filekey);
      }
    }, [filekey]);

    useEffect(() => {
      if (url && filekey) {
        console.log('url', url);
        downloadFile(url, filekey);
      }
    }, [url, filekey]);

    const downloadFile = async (signedUrl: string, filekey: string) => {
      // Your logic to upload the file goes here
      // You can use 'url' and 'filekey' here
      const options = {
        method: 'GET',
        body: filekey,
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

export default FileDownloader;
