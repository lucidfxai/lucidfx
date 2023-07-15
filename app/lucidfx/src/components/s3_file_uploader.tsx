import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import React from 'react';
import 'dotenv/config';
import { uploadFile } from '../services/file_upload_service';

const FileUploader = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploadingtos3, setUploadingToS3] = useState(false);
    const [url, setUrl] = useState<string | null>(null);
    const [uniqueKey, setUniqueKey] = useState<string>('UniqueKey not found');
    const [uploadSuccessful, setUploadSuccessful] = useState<true | false>(false);


    const getSignedPutUrlPromiseMutation = api.s3_service_router.getSignedPutUrlPromise.useMutation({
      onSuccess: (data) => {
        setUrl(data.url);
        setUniqueKey(data.uniqueKey);
      },
      onError: (error) => {
        console.error('Error during the upload', error);
      }
    });

    const addFileToFilesTableDbPromiseMutation = api.s3_service_router.addFileToFilesTableDbPromise.useMutation({
      onSuccess: (data: any) => {
        console.log('onsuccess file db data', data);
        setUploadSuccessful(true);
      },
      onError: (error) => {
        console.error('Error during the upload', error);
      }
    });

    useEffect(() => {
      if(uploadSuccessful) {
        console.log('uploadSuccessful', uploadSuccessful);
      }
    }, [uploadSuccessful]);

    useEffect(() => {
      if (url && file && uniqueKey) {
        console.log('use effect called!');
          const uploadAndMutate = async () => {
              const uploadResult = await uploadFile(url, file);
              console.log('uploadResult', uploadResult);
              if (uploadResult) {
                  addFileToFilesTableDbPromiseMutation.mutate(uniqueKey);
              }
          };
          uploadAndMutate();
      }
    }, [url, file, uniqueKey]);

    useEffect(() => {
      if (file) {
        setUploadingToS3(true);
        getSignedPutUrlPromiseMutation.mutate();
      }
    }, [file]);

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
