import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FileUploader from './s3_file_uploader';
import { s3Service } from '../server/services/s3_service';  // Adjust this path

jest.mock('../server/services/s3_service', () => {
  return {
    s3Service: {
      getSignedUrlPromise: jest.fn(),
    },
  };
});

// jest.mock('../utils/api', () => {
//   return {
//     api: {
//       s3_service_router: {
//         getSignedUrlPromise: {
//           useQuery: () => ({
//             data: 'mockUrl',
//             isLoading: false,
//             isError: false,
//             error: null,
//           }),
//         },
//       },
//     },
//   };
// });
//
// describe('FileUploader', () => {
//   beforeEach(() => {
//     // Reset the mock implementation before each test
//     (s3Service.getSignedUrlPromise as jest.Mock).mockReset();
//   });
//
//   it('should render upload form correctly', async () => {
//     (s3Service.getSignedUrlPromise as jest.Mock).mockResolvedValue('https://mock-s3-url.com');
//     render(<FileUploader />);
//     const uploadButton = screen.getByText('Upload');
//     expect(uploadButton).toBeEnabled();
//   });
// });
//
jest.mock('../utils/api', () => {
  return {
    api: {
      s3_service_router: {
        getSignedUrlPromise: {
          useQuery: () => ({
            data: 'mockUrl',
            isLoading: false,
            isError: true,
            error: new Error('Network error'),
          }),
        },
      },
    },
  };
});

describe('FileUploader', () => {
  it('should render an error message if an error occurred while fetching the signed URL', async () => {
    (s3Service.getSignedUrlPromise as jest.Mock).mockRejectedValue(new Error('Network error'));
    render(<FileUploader />);
    await waitFor(() => {
      expect(screen.getByText('Error: Network error')).toBeInTheDocument();
    });
  });
  //
  // it('can select a file', async () => {
  //   const file = new File(['test'], 'test.png', { type: 'image/png' });
  //   (s3Service.getSignedUrlPromise as jest.Mock).mockResolvedValue('https://mock-s3-url.com');
  //   render(<FileUploader />);
  //   const input = screen.getByLabelText('Choose File');
  //   fireEvent.change(input, { target: { files: [file] } });
  //   await waitFor(() => {
  //     expect(s3Service.getSignedUrlPromise).toHaveBeenCalledWith('putObject', expect.objectContaining({
  //       Bucket: 'testBucket',
  //       Key: 'testKey',
  //       Expires: 60,
  //     }));
  //   });
  // });
  //
  // it('should trigger uploading state when a file is selected', async () => {
  //   const file = new File(['test'], 'test.png', { type: 'image/png' });
  //   (s3Service.getSignedUrlPromise as jest.Mock).mockResolvedValue('https://mock-s3-url.com');
  //   render(<FileUploader />);
  //   const input = screen.getByLabelText('Choose File');
  //   fireEvent.change(input, { target: { files: [file] } });
  //   await waitFor(() => {
  //     const uploadButton = screen.getByText('Uploading...');
  //     expect(uploadButton).toBeInTheDocument();
  //   });
  // });
});


