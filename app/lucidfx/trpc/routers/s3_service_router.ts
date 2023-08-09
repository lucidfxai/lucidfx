import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { s3Service, filesService } from 'server/services/services_index';


export const s3ServiceRouter = createTRPCRouter({
  getSignedPutUrlPromise: protectedProcedure
    .mutation(async ({ }) => {
      return s3Service.getSignedPutUrlPromise();
    }),
  addFileToFilesTableDbPromise: protectedProcedure
    .input(
      z.string().nonempty('s3 uniqueKey is required'),
    )
    .mutation(async ({ ctx, input }) => {
      return filesService.insertFileToFilesTablePromise(ctx.auth.userId, input);
    }),
  // getSignedGetUrlPromise: protectedProcedure
  //   .input(
  //     z.string().nonempty('s3Key is required'),
  //   )
  //   .mutation(async ({ input }) => {
  //     return s3Service.getSignedGetUrlPromise(input);
  //   }),
  // getAllFilesForCurrentUserInFilesDbTable: protectedProcedure
  //   .mutation(async ({ ctx }) => {
  //     const currentUserId = ctx.auth.userId;
  //     return s3Service.getAllFilesForCurrentUserInFilesDbTable(currentUserId);
  //   }),
  // deleteFileFromFilesDbTable: protectedProcedure
  //   .input(
  //     z.string().nonempty('s3Key is required'),
  //   )
  //   .mutation(async ({ input }) => {
  //     return s3Service.saveFileKeyToUserDbTable(input);
  //   }),
});
