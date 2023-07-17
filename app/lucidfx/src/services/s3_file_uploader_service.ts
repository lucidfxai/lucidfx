export async function uploadFile(signedUrl: string, file: File) {
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
      // console.log('response', response);
      if (response.status !== 200) {
        throw new Error(`Could not upload file: ${response.statusText}`);
      }
      if (response.ok) {
        console.log('response ok!');
        return true
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
}

