import { defineConfig } from "tinacms";
import nextConfig from '../next.config'

import Post from "./collection/post";
import Global from "./collection/global";
import Author from "./collection/author";
import Page from "./collection/page";

const config = defineConfig({
  clientId: "ca101170-a52f-4cb8-9bf2-dd951d0f98d0",
  branch: "main",
  token: "9a933c2a1a33df4fb33fb8d1e60dcedd96cc1a1d",
  media: {
    // If you wanted cloudinary do this
    // loadCustomStore: async () => {
    //   const pack = await import("next-tinacms-cloudinary");
    //   return pack.TinaCloudCloudinaryMediaStore;
    // },
    // this is the config for the tina cloud media store
    tina: {
      publicFolder: "public",
      mediaRoot: "uploads",
    },
  },
  build: {
    publicFolder: "public", // The public asset folder for your framework
    outputFolder: "admin", // within the public folder
    basePath: nextConfig.basePath?.replace(/^\//, '') || '', // The base path of the app (could be /blog)
  },
  schema: {
    collections: [Page, Post, Author, Global],
  },
});

export default config;
