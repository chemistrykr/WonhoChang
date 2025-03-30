import { defineConfig } from '@tinacms/core';

export default defineConfig({
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID, // 생성한 클라이언트 ID
  token: process.env.TINA_TOKEN, // GitHub Personal Access Token
  branch: process.env.GITHUB_BRANCH || 'main', // 사용하려는 GitHub 브랜치
  build: {
    outputFolder: 'admin', // TinaCMS Admin UI가 생성될 폴더
    publicFolder: 'public', // 공개 폴더
  },
  media: {
    tina: {
      mediaRoot: '', // 미디어 루트 경로
      publicFolder: 'public', // 공개 폴더 경로
    },
  },
  schema: {
    collections: [
      {
        name: 'post', // 콜렉션 이름
        label: 'Posts', // Admin UI에서 보이는 이름
        path: 'content/posts', // 포스트가 저장될 경로
        fields: [
          {
            type: 'string',
            name: 'title', // 포스트 제목
            label: 'Title',
            isTitle: true,
            required: true,
          },
          {
            type: 'rich-text',
            name: 'body', // 포스트 본문
            label: 'Body',
            isBody: true,
          },
        ],
        ui: {
          router: ({ document }) => `/demo/blog/${document._sys.filename}`, // 라우팅 설정
        },
      },
    ],
  },
});
