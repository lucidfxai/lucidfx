import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import React from 'react';
import 'dotenv/config';
import { uploadFile } from '../services/s3_file_uploader_service';
import {TRPCClientErrorLike} from '@trpc/client';

type SignedUrlResponse = {
  url: string;
  uniqueKey: string;
};

type FileUploadResponse = any; // Replace with your actual response type

const useGetSignedUrl = (file: File | null, onError: (error: TRPCClientErrorLike<any>) => void) => {
  const getSignedUrl = api.s3_service_router.getSignedPutUrlPromise.useMutation<SignedUrlResponse>({
    onError,
  });

  useEffect(() => {
    if (file) {
      getSignedUrl.mutate();
    }
  }, [file]);

  return { getSignedUrl };
};

const useAddFile = (url: string | null, file: File | null, uniqueKey: string, onError: (error: TRPCClientErrorLike<any>) => void) => {
  const addFile = api.s3_service_router.addFileToFilesTableDbPromise.useMutation<FileUploadResponse>({
    onError,
  });

  useEffect(() => {
    const uploadAndMutate = async () => {
      if (url && file && uniqueKey) {
        const uploadResult = await uploadFile(url, file);
        if (uploadResult) {
          addFile.mutate(uniqueKey);
        }
      }
    };
    uploadAndMutate();
  }, [url, file, uniqueKey]);

  return { addFile };
};

interface FileUploaderProps {
  onUploadError: (error: TRPCClientErrorLike<any>) => void;
}

const FileUploader = ({ onUploadError }: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [uniqueKey, setUniqueKey] = useState<string>('UniqueKey not found');

  const { getSignedUrl } = useGetSignedUrl(file, onUploadError);
  const { addFile } = useAddFile(url, file, uniqueKey, onUploadError);

  useEffect(() => {
    if (getSignedUrl.data) {
      setUrl(getSignedUrl.data.url);
      setUniqueKey(getSignedUrl.data.uniqueKey);
    }
  }, [getSignedUrl.data]);

  useEffect(() => {
    if (addFile.data) {
      console.log('onsuccess file db data', addFile.data);
    }
  }, [addFile.data]);

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
