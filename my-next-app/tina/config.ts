import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
   //process.env.GITHUB_BRANCH ||
   //process.env.VERCEL_GIT_COMMIT_REF ||
   //process.env.HEAD ||
  "main";

export default defineConfig({
  branch:"main",

  // Get this from tina.io
  clientId: "78269263-6720-41ba-ae5d-cf09ba20b4f2",
  // Get this from tina.io
  token: "cc0251e34b35ad3c3a46c16ea1cdf6726d4efc2b",

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "content/posts",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
        ui: {
          // This is an DEMO router. You can remove this to fit your site
          router: ({ document }) => `/demo/blog/${document._sys.filename}`,
        },
      },
    ],
  },
});
