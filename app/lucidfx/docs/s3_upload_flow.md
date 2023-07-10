s3 notes:
--------
To summarize, in the flow where the frontend uploads the file to S3 using a
signed URL:

Your frontend makes a request to your server for a signed URL. This request
would include necessary information like the file name, file type, etc.

Your server-side S3Service uses this information to generate a signed URL using
the getSignedUrlPromise method.

This signed URL is sent back to the frontend in the server's response.

The frontend then uses this signed URL to upload the file directly to S3.

In this flow, the server never handles the file directly. It only generates and
provides the signed URL for the frontend to use. This can help save bandwidth
and reduce load on your server, as the file data goes directly from the client
to S3, not via your server.
