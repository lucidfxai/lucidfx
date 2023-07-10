import { z } from "zod";
import { S3Service } from '../../services/s3_service';
import { createTRPCRouter, protectedProcedure } from '../trpc';

const s3Service = new S3Service();

// Define the Zod schema for the input parameters of `getSignedUrlPromise`
const GetSignedUrlInput = z.object({
  operation: z.string(),
  parameters: z.object({
    ACL: z.string().optional(),
    Body: z.instanceof(Buffer).optional(),
    Bucket: z.string(),
    Key: z.string(),
    Expires: z.number(),
  }),
});

export const s3ServiceRouter = createTRPCRouter({
  getSignedUrlPromise: protectedProcedure
    .input(GetSignedUrlInput)
    .query(async ({ input }) => {
      const { operation, parameters } = input;
      return s3Service.getSignedUrlPromise(operation, parameters);
    }),
});
