import { render, screen, fireEvent } from "@testing-library/react";
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import FileUploader from './s3_file_uploader';
import { QueryClient, QueryClientProvider } from 'react-query';

const server = setupServer(
  rest.get('/api/signed-url', (req, res, ctx) => {
    return res(ctx.json({ url: 'testUrl' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('FileUploader', () => {
  const queryClient = new QueryClient();

  test('renders without crashing', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <FileUploader />
      </QueryClientProvider>
    );
    const fileUploader = screen.getByTestId('file-uploader');
    expect(fileUploader).toBeInTheDocument();
  });

  test('has a "Choose File" button', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <FileUploader />
      </QueryClientProvider>
    );
    const chooseFileButton = screen.getByText('Choose File');
    expect(chooseFileButton).toBeInTheDocument();
  });

  test('has a "Upload" button', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <FileUploader />
      </QueryClientProvider>
    );
    const uploadButton = screen.getByText('Upload');
    expect(uploadButton).toBeInTheDocument();
  });

  // Mock FileReader
  const mockReader = {
    readAsDataURL: jest.fn(),
    addEventListener: jest.fn((_, evtHandler) => { evtHandler(); }),
    result: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
  };
  window.FileReader = jest.fn(() => mockReader);

  test('file upload', async () => {
    const file = new File(['hello'], 'hello.png', {type: 'image/png'});
    render(
      <QueryClientProvider client={queryClient}>
        <FileUploader />
      </QueryClientProvider>
    );

    const input = screen.getByLabelText('Choose File');
    fireEvent.change(input, { target: { files: [file] } });

    // Add expectation for upload process
  });
});

