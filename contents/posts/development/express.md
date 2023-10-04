---
title: "Express 기반의 프로젝트 셋업"
date: 2023-10-03
update: 2023-10-05
tags:
  - development
  - express
---

꽤 오래 전에 Express와 TypeScript로 프로젝트를 구성하는 블로그 글을 작성했었다.

그런데 최근에 프로젝트를 하면서 Express 서버를 다시 구성해야 할 일이 생겼는데 예전에 덜 명확하게 알던 부분도 있었고 새롭게 삽질을 했던 경험이 있어서 이번 기회에 다시 리뉴얼해서 작성해보고자 한다.

## TypeScript

### 패키지 설치

우선, TypeScript 기반으로 세팅할 것이니 관련된 패키지를 설치해보도록 하자.

```sh
npm i typescript @types/node ts-node tsconfig-paths
```

- **typescript**: 타입스크립트 패키지.
- **@types/node**: Node.js 환경이 제공하는 내장 기능에 대한 타입 정의.
- **ts-node**: 타입스크립트 파일을 실행을 위한 패키지.
- **tsconfig-paths**: `tsconfig.json` 에 정의된 `paths` 정보를 모듈이 읽을 수 있게 한다. path alias 기능으로 절대 경로를 지정해주고 싶어서 설치한다.

> 🚨 주의!  
> React같은 FE 환경에서는 `devDependencies` 에 설치했지만, Express같은 BE 환경에서는 일반 `dependencies` 에 설치해야 했었다. 왜냐하면 `devDependencies` 는 배포에 포함되지 않는 패키지이기 때문에 빌드가 안되는 문제가 생겼다. cloudtype 이라는 SaaS 서비스를 이용했었는데, 배포 환경마다 다를지는 아직 모르겠다.  
> 물론 `husky`, `eslint`, `prettier` 와 같이 배포 환경에서는 전혀 사용되지 않는 패키지는 `devDependencies` 에 설치해도 좋다.

### tsconfig.json

루트 디렉토리에 타입스크립트 설정 파일을 작성한다.

```json{7}
{
  "compilerOptions": {
    "baseUrl": "src",
    "rootDir": "src",
    "outDir": "dist",

    "esModuleInterop": true,

    "strict": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src", "./src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

## Express

### 패키지 설치

Express 패키지를 설치한다.

```sh
npm i express @types/express
npm i -D nodemon
```

- **express**: Express 패키지
- **@types/express**: Express에서 제공하는 기능에 대한 타입 정의
- **nodemon**: 파일 수정을 감지하고 서버를 다시 재실행하기 위한 패키지. 개발 환경에서 사용한다.

### src/app.ts 작성

간단한 API 서버 코드를 작성한다.

```ts
import express from "express"

const app = express()

app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.listen(5010, () => {
  console.log("Server running on port 5010")
})
```

### package.json 수정

빌드와 실행에 관련된 스크립트를 작성한다.

```json
{
  "scripts": {
    "start": "ts-node -r tsconfig-paths/register src/app.ts",
    "dev": "nodemon --watch src --exec ts-node -r tsconfig-paths/register src/app.ts"
  }
}
```

각 커맨드를 살펴보자면:

1. **start**: `app.ts` 파일을 실행하되, Path Alias의 적용을 위해서 `tsconfig-paths` 모듈을 먼저 require 한다.  
   배포 환경에서 실행할 땐 파일의 변화가 없으니 이 커맨드를 실행하려는 목적이다.
2. **dev**: `src` 디렉토리 내부의 파일이 변경되면 `start` 스크립트의 내용을 그대로 다시 실행한다.
   개발 환경에서는 소스 코드가 변경되면 반영하고 서버를 다시 실행하기 위한 목적이다.

## Path Alias

경로가 깊은 경우에 import를 보다 편하게 하기 위해서 path alias를 적용한다.

### tsconfig.json 수정

컴파일러 옵션에 paths 내용을 추가한다.

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## 환경변수

소스코드에 공개되어서는 안될 내용을 환경변수로 다루기 위한 내용을 적용한다.

### 패키지 설치

```sh
npm i dotenv
```

### .env 작성

```
A='에이'
B='비'
C='씨'
```

### tsconfig.json 수정

기본적으로 env 파일의 내용은 `process.env.키_이름` 으로 가져와서 사용할 수 있지만, 타입이 `string | undefined` 로 되어있기 때문에 타입 체크를 해야하며 IDE가 자동완성을 해주지 못하는 번거로움이 존재한다.

그래서 타입 정의 파일을 만들어 놓으면 편한데, 그 파일의 내용을 `ts-node` 가 가져올 수 있도록 설정해야 한다.

```json
{
  "ts-node": {
    "files": true
  },
  "files": ["src/types/env.d.ts"]
}
```

### src/types/env.d.ts 작성

env 파일에 정의된 내용에 대한 타입 정의를 작성한다.

```ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production"
    A: string
    B: string
    C: string
  }
}
```

### dotenv 불러오기

프로젝트에서 한 번은 dotenv 패키지를 불러와야만 환경변수를 사용할 수 있다.

가장 최상단인 `src/app.ts` 에서 수행하는 것도 적절하겠다.

```ts{1}
import "dotenv/config"
import express from "express"

console.log(process.env.A) // '에이' 출력

const app = express()

app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.listen(5010, () => {
  console.log("Server running on port 5010")
})
```

## Express 객체 확장

현재 로그인한 사용자 정보같이, 간혹 앞 단의 미들웨어에서 로그인 정보를 처리하고 Request 객체에 담아서 사용하고 싶은 경우가 있다.

그런 경우에도 확장을 위해서 타입 정의 파일을 활용한다. 이번에는 accessToken 정보를 담고 싶다고 가정해보겠다.

### src/types/express.d.ts 작성

```ts
export {} // 이 구문이 없다면 에러가 발생하는데, 모듈이라고 인식을 못해서 그런거같다.

declare global {
  namespace Express {
    interface Request {
      accessToken?: string
    }
  }
}
```

### tsconfig.json 수정

```json
{
  "ts-node": {
    "files": true
  },
  "files": ["src/types/env.d.ts", "src/types/express.d.ts"]
}
```

### src/app.ts 수정

이제 req 객체에 accessToken 프로퍼티를 사용할 수 있다는 점을 확인할 수 있다.

```ts{17}
import "dotenv/config"
import express from "express"

const app = express()

app.use((req, res, next) => {
  const authorization = req.headers["authorization"]

  if (authorization?.startsWith("Bearer ")) {
    req.accessToken = authorization.split(" ")[1]
  }

  next()
})

app.get("/", (req, res) => {
  console.log(req.accessToken) // Request 객체에 accessToken 이 추가 되어 있음

  res.send("Hello World!")
})

app.listen(5010, () => {
  console.log("Server running on port 5010")
})
```
