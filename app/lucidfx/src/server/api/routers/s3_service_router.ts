import { S3Service } from '../../services/s3_service';
import { createTRPCRouter, protectedProcedure } from '../trpc';

const s3Service = new S3Service();

export const s3ServiceRouter = createTRPCRouter({
  getSignedPutUrlPromise: protectedProcedure
    .mutation(async ({ }) => {
      return s3Service.getSignedPutUrlPromise();
    }),
});
