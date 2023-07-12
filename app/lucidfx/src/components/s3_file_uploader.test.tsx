import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileUploader from './s3_file_uploader';
import React from 'react';

const mockMutation = {
  mutate: jest.fn(),
  data: null,
  error: null,
  isError: false,
  isIdle: false,
  isLoading: false,
  isSuccess: false,
  status: 'idle',
  reset: jest.fn(),
  mutateAsync: jest.fn(),
  errorMutation: null,
  resetMutationState: jest.fn(),
};

jest.mock('../utils/api', () => {
  const actual = jest.requireActual('../utils/api');

  const apiMock = {
    ...actual.api,
    s3_service_router: {
      ...actual.api.s3_service_router,
      getSignedUrlPromise: {
        ...actual.api.s3_service_router.getSignedUrlPromise,
        useMutation: () => mockMutation,
      },
    },
  };

  return {
    ...actual,
    api: apiMock,
  };
});

describe('FileUploader', () => {
  it('uploads a file when selected', async () => {
    const MOCK_FILE = new File(['hello'], 'hello.png', { type: 'image/png' });
    
    render(<FileUploader />);

    const fileInput = screen.getByLabelText(/choose file to upload/i);
    userEvent.upload(fileInput, MOCK_FILE);

    await waitFor(() => expect(mockMutation.mutate).toHaveBeenCalled());
  });
});

