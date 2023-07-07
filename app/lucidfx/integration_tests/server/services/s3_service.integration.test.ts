import { S3Service } from '../../../src/server/services/s3_service';
import fs from 'fs';
import path from 'path';

describe('S3Service Integration Test', () => {
  let s3Service: S3Service;
  
  beforeEach(() => {
    s3Service = new S3Service();
  });

  it('should upload file to S3 bucket correctly', async () => {
    const filePath = path.resolve(__dirname, './test_file.txt'); // replace with your actual file path
    const buffer = fs.readFileSync(filePath);
    
    const response = await s3Service.upload('test_file.txt', buffer);
    
    // Here you should have your own logic to verify the file upload.
    // It could be checking response, or you might need to perform a separate S3 GET operation to ensure the file is there and correct.

    // This is a very simplified example where we only check if the response has the expected properties.
    expect(response).toHaveProperty('Location');
    expect(response).toHaveProperty('ETag');
    expect(response).toHaveProperty('Bucket');
    expect(response).toHaveProperty('Key');

    console.log(response);
  });
});
