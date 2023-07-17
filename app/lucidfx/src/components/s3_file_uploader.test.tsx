import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileUploader from './s3_file_uploader';
import React from 'react';
import { TRPCClientErrorLike } from '@trpc/client';

const mockGetSignedPutUrlPromiseMutation = {
  mutate: jest.fn(),
  data: { url: 'http://example.com', uniqueKey: 'UniqueKey123' },  // Add a mock response
};

const mockAddFileToFilesTableDbPromiseMutation = {
  mutate: jest.fn(),
};

jest.mock('../services/s3_file_uploader_service', () => ({
  uploadFile: jest.fn().mockResolvedValue(true),
}));

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

    render(<FileUploader onUploadError={(error: TRPCClientErrorLike<any>): void => {
        throw new Error('Function not implemented.');
    } } />);

    const fileInput = screen.getByLabelText(/choose file to upload/i);
    userEvent.upload(fileInput, MOCK_FILE);

    // Wait for getSignedUrlPromiseMutation.mutate to be called
    await waitFor(() => expect(mockGetSignedPutUrlPromiseMutation.mutate).toHaveBeenCalled());

    // Then check if addFileToFilesTableDbPromiseMutation.mutate was called
    await waitFor(() => expect(mockAddFileToFilesTableDbPromiseMutation.mutate).toHaveBeenCalled());

  });
});

