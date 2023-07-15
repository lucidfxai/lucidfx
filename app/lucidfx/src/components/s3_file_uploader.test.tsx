import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileUploader from './s3_file_uploader';
import React from 'react';
import { TRPCClientErrorLike } from '@trpc/client';


const mockGetSignedPutUrlPromiseMutation = {
  mutate: jest.fn(),
};

const mockAddFileToFilesTableDbPromiseMutation = {
  mutate: jest.fn(),
};

jest.mock('../utils/api', () => {
  const actual = jest.requireActual('../utils/api');

  const apiMock = {
    ...actual.api,
    s3_service_router: {
      ...actual.api.s3_service_router,
      getSignedPutUrlPromise: {
        ...actual.api.s3_service_router.getSignedPutUrlPromise,
        useMutation: () => ({
          ...mockGetSignedPutUrlPromiseMutation,
        }),
      },
      addFileToFilesTableDbPromise: {
        ...actual.api.s3_service_router.addFileToFilesTableDbPromise,
        useMutation: () => ({
          ...mockAddFileToFilesTableDbPromiseMutation,
        }),
      },
    },
  };

  return {
    ...actual,
    api: apiMock,
  };
});

global.fetch = jest.fn(() =>
  Promise.resolve(
    new Response(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-type': 'application/json' },
    }),
  ),
);

describe('FileUploader', () => {
  it('uploads a file when selected', async () => {
    const MOCK_FILE = new File(['hello'], 'hello.png', { type: 'image/png' });

    render(<FileUploader onUploadError={function(error: TRPCClientErrorLike<any>): void {
        throw new Error('Function not implemented.');
    } } />);

    const fileInput = screen.getByLabelText(/choose file to upload/i);
    userEvent.upload(fileInput, MOCK_FILE);

    await waitFor(() => expect(mockGetSignedPutUrlPromiseMutation.mutate).toHaveBeenCalled());

  });

  // it('saves the uniqueKey to the database after uploading', async () => {
  //
  //   await waitFor(() => expect(mockAddFileToFilesTableDbPromiseMutation.mutate).toHaveBeenCalled());
  // });

  it('saves the uniqueKey to the database after uploading', async () => {
    // Your previous setup code...
    const MOCK_FILE = new File(['hello'], 'hello.png', { type: 'image/png' });
    render(<FileUploader onUploadError={function(error: TRPCClientErrorLike<any>): void {
        throw new Error('Function not implemented.');
    } } />);

    // get the file input and upload the mock file
    const fileInput = screen.getByLabelText(/choose file to upload/i);
    userEvent.upload(fileInput, MOCK_FILE);

    // wait for the getSignedPutUrlPromiseMutation to be called
    await waitFor(() => expect(mockGetSignedPutUrlPromiseMutation.mutate).toHaveBeenCalled());

    // Log the mutate calls
    console.log("getSignedPutUrlPromiseMutation called with: ", mockGetSignedPutUrlPromiseMutation.mutate.mock.calls);

    // The uniqueKey is updated as a side effect of the first mutation, then the file is uploaded
    // We need to delay a bit for these side effects to occur
    await new Promise((r) => setTimeout(r, 100));

    // Here, instead of just checking if the function has been called, 
    // wait until an expected condition is met in the component.
    // Replace `CONDITION` with a condition that indicates the file upload was successful.
    // await waitFor(() => );

    // Now check that addFileToFilesTableDbPromiseMutation has been called after the file has been uploaded
    expect(mockAddFileToFilesTableDbPromiseMutation.mutate).toHaveBeenCalled();
  });

});

// import { render, fireEvent, waitFor, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import FileUploader from '../components/s3_file_uploader';
// import { api } from '../utils/api';
// import { uploadFile } from '../services/file_upload_service';
// import React from 'react';
//
// jest.mock('../utils/api', () => ({
//   s3_service_router: {
//     getSignedPutUrlPromise: {
//       useMutation: () => ({
//         mutate: jest.fn(),
//         data: null,
//       }),
//     },
//     addFileToFilesTableDbPromise: {
//       useMutation: () => ({
//         mutate: jest.fn(),
//         data: null,
//       }),
//     },
//   },
// }));
//
// jest.mock('../services/file_upload_service', () => ({
//   uploadFile: jest.fn().mockResolvedValue(true),
// }));
//
// describe('FileUploader component', () => {
//   it('renders without crashing', () => {
//     render(<FileUploader onUploadError={jest.fn()} />);
//     expect(screen.getByTestId('file-uploader')).toBeInTheDocument();
//   });
//
//   it('should call the onFileChange function when a file is selected', async () => {
//     const { container } = render(<FileUploader n()} />);
//     const file = new File(['hello'], 'hello.png', { type: 'image/png' });
//     const input = container.querySelector('input[type="file"]');
//     
//     if(api && api.s3_service_router && api.s3_service_router.getSignedPutUrlPromise) {
//       if(input instanceof HTMLElement){
//         userEvent.upload(input, file);
//         await waitFor(() => expect(api.s3_service_router.getSignedPutUrlPromise.useMutation().mutate).toHaveBeenCalledTimes(1));
//       } else {
//         throw new Error('Input element not found');
//       }
//     } else {
//       throw new Error('API or required function is not defined');
//     }
//   });
//
//   // More tests can be added to check other behaviors of your component
// });
//
