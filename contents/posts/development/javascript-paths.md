---
title: "JavaScript, TypeScript 절대 경로 설정"
date: 2023-05-01
update: 2023-05-01
tags:
  - development
---

프로젝트의 규모가 커질수록 코드를 하나의 단일 책임을 수행하는 작은 모듈로 분할해서 구현하게 되는데 경로가 깊어지는 경우 다른 파일을 불러올 때 굉장히 복잡해 질 수 있다.

그래서 절대 경로로 `import` 하도록 설정하면 편리한데, 설정 과정을 작성해 보고자 한다.

## React 프로젝트
`CRA(create-react-app)` 로 초기화한 프로젝트를 기준으로 할 때 크게 두 가지의 설정이 필요하다.

1. `웹팩(Webpack)`에게 우리 프로젝트의 특정 디렉토리나 파일의 경로에 대한 `별명(alias)`을 알려준다.
2. `VSCode` 와 같은 코드 편집기에게도 마찬가지로 별명을 알려준다.

### 웹팩(Webpack)
CRA 프로젝트에서 웹팩을 수정하기 위해서는 `node_modules` 에 들어있는 웹팩 정보를 바깥으로 `eject` 해서 직접 수정하는 방법도 있지만, 이후에 패키지 업데이트가 필요할 때의 과정이 번거로울 것을 우려하거나 설정할 필요가 없는 부분까지 바깥으로 노출시키고 싶지 않은 경우에는 `craco` 라이브러리를 사용할 수 있다.

#### 1. 패키지 설치
```sh
npm i -D @craco/craco
```

#### 2. package.json 수정
```json
{
  // package.json
  "scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test",
    "eject": "react-scripts eject"
  }
}
```
`craco` 가 설정 정보를 오버라이딩한 뒤에 리액트 프로젝트를 실행하게 스크립트를 바꿔준다.

#### 3. craco.config.js 작성
```js
const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
    },
  },
};
```

웹팩의 alias 설정 정보를 입력한다.

### jsconfig.json
`jsconfig.json` 파일은 프로젝트의 루트 디렉토리 위치를 나타내고, 프로젝트에 속한 파일과 속하지 않은 파일을 지정하고, 컴파일 옵션을 설정하는 등 **인텔리센스 기능, 코드 완성, 그 외 기능을 개선**하는데 사용되는 파일이다.

우리가 절대 경로로 사용하려고 설정한 alias 정보를 코드 편집기에게도 알려줘야 코드 편집기가 제공하는 기능을 원활하게 사용할 수 있다.

이를 위해서 `jsconfig.json` 파일을 작성한다.

```json
{
  // jsconfig.json
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@components": ["./components/index.js"],
      "@components/*": ["./components/*"],
    }
  }
}
```

### 실제 사용

#### 여러 줄에 나눠서 import
```jsx
import First from '@components/First';
import Second from '@components/Second';
import Third from '@components/Third';

function App() {
  return (
    <div className="App">
      <First />
      <Second />
      <Third />
    </div>
  );
}

export default App;
```

위와 같이 절대 경로를 사용할 수 있다.  
그런데 같은 `components` 디렉토리에 있음에도 여러 줄에 나눠서 `import` 를 해야한다는 점이 불편할 수 있다.  

이런 경우에는 `@components/index.js` 파일을 작성하고, 그 안에서 내부의 컴포넌트들을 따로 `export` 해주는 방법을 사용할 수 있다.

#### 한 줄에 import
```jsx
// @components/index.js
export { default as First } from './First';
export { default as Second } from './Second';
export { default as Third } from './Third';
```

```jsx
import { First, Second, Third } from '@components';

function App() {
  return (
    <div className="App">
      <First />
      <Second />
      <Third />
    </div>
  );
}

export default App;
```

## Node.js 프로젝트
Node.js 에서 절대 경로를 별명으로 주기 위해서는 다음과 같은 방법이 있었다.

1. `package.json` 에 `imports` 옵션을 사용
2. `module-alias` 라이브러리 사용
3. `TypeScript` 를 사용해서 `tsconfig.json` 의 컴파일 설정으로 경로를 지정하기

1번은 시도해보았으나 잘 되지 않았고, 2번은 최종 업데이트가 4년 전인 라이브러리로 더 이상 관리되지 않아보였다. 그래서 프로젝트를 원래 `TypeScript` 로 구성하려고 했기 때문에 3번을 선택했다.

#### 1. Node.js 패키지 초기화
```sh
npm init -y
```

#### 2. TypeScript 설치
```sh
npm install typescript @types/node
npm install -D ts-node tsconfig-paths
```
- `typescript`: TypeScript 모듈
- `@types/node`: Node.js 에서 사용되는 타입 정의
- `ts-node`: 컴파일을 하지 않아도 TypeScript를 실행할 수 있게 해주는 모듈
- `tsconfig-paths`: tsconfig.json 파일의 `paths` 값으로 설정된 경로들을 가지고 `ts-node` 모듈을 실행할 수 있게 해주는 모듈

#### 3. tsconfig.json 설정
```sh
tsc --init --rootDir src --outDir ./build --baseUrl .
```
위 커맨드를 입력하면 `tsconfig.json` 파일이 생성된다.
- `--rootDir`: 프로젝트 루트 경로를 지정한다.
- `--outDir`: 빌드 결과물이 저장될 디렉토리 경로를 지정한다.
- `--baseUrl`: 기본 경로를 프로젝트 최상단으로 설정한다.

그 이후에 `paths` 정보를 추가로 작성해준다.
```json
{
  /// tsconfig.json
  "compilerOptions": {
    "paths": {
      "@controllers": ["src/controllers/index.ts"],
      "@controllers/*": ["src/controllers/*"]
    },
  }
}
```

#### 4. 실행 스크립트 작성
```json
{
  // package.json
  "scripts": {
    "build": "tsc",
    "start": "ts-node -r tsconfig-paths/register ./src/app.ts"
  },
}
```

#### 5. 코드 실행
```ts
// app.ts
import { one, two, three } from '@controllers';

one();
two();
three();
```

`npm start` 커맨드를 입력하면 정상적으로 실행이 되는 것을 확인할 수 있다.





## 참고 자료
https://mingeesuh.tistory.com/8  
https://lasbe.tistory.com/151  
https://offbyone.tistory.com/445  
