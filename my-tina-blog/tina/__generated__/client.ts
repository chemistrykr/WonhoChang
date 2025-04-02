import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: '9a933c2a1a33df4fb33fb8d1e60dcedd96cc1a1d', queries,  });
export default client;
  