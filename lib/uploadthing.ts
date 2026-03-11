import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "1MB",
      maxFileCount: 1,
    },
  })
    .middleware(() => {
      return {};
    })
    .onUploadComplete(({ file }) => {
      return { url: file.ufsUrl };
    }),

  galleryUploader: f({
    image: {
      maxFileSize: "1MB",
      maxFileCount: 10,
    },
  })
    .middleware(() => {
      return {};
    })
    .onUploadComplete(({ file }) => {
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
