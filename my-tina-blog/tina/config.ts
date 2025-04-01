import { defineConfig } from '@tinacms/core';

export default defineConfig({
  clientId: 6fb18bdd-7084-4ad4-9c06-35e038fd93f7, // 생성한 클라이언트 ID
  token: 94f5ff3e750d4404c41723c53a2a332de51eaea1, // GitHub Personal Access Token
  branch: "main", // 사용하려는 GitHub 브랜치
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
