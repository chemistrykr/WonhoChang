import React from 'react';
import { TinaProvider, TinaCMS } from '@tinacms/core';
import { TinaCloudProvider } from 'tinacms';

const cms = new TinaCMS({
  enabled: true,
  sidebar: true,
  toolbar: true,
  media: {
    tina: {
      publicFolder: 'public', // 미디어 폴더
    },
  },
  schema: {
    collections: [
      {
        name: 'post', // post를 관리할 콜렉션
        label: 'Posts',
        path: 'content/posts',
        fields: [
          {
            type: 'string',
            name: 'title', // 포스트 제목
            label: 'Title',
            required: true,
          },
          {
            type: 'rich-text',
            name: 'body', // 포스트 본문
            label: 'Body',
            required: true,
          },
        ],
      },
    ],
  },
});

const App = () => {
  return (
    <TinaCloudProvider cms={cms}>
      <TinaProvider cms={cms}>
        <div>
          <h1>My GitHub Blog</h1>
          <p>Welcome to my blog powered by TinaCMS!</p>
        </div>
      </TinaProvider>
    </TinaCloudProvider>
  );
};

export default App;
