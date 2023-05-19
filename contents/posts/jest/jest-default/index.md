---
title: "Jest"
date: 2023-05-19
update: 2022-05-19
tags:
  - jest
series: "테스팅을 위한 Jest"
---

## Jest란?
`Jest` 는 메타(구 페이스북)가 만들고 유지보수하는 **자바스크립트 테스팅 프레임워크**이다.  

`Jest` 가 등장하기 이전에는 테스팅을 위해서 `Test Runner`, `Test Matcher`, `Test Mock` 에 적용할 각각의 라이브러리를 선택해서 적용해야 했었는데, 그렇다보니 각각의 라이브러리가 유사하지만 조금씩 다른 API 때문에 여러 프로젝트에서 일하는 자바스크립트 개발자들에게 혼란을 주기도 했었다.

`Jest` 는 <b style="color: red">**All-in-one 테스팅 프레임워크**</b>로써 혼란을 방지하고 손쉽게 사용할 수 있다는 장점이 있다.

> - **Test Runner**: `Mocha`, `Jasmin` 등의 라이브러리가 있었다.  
> - **Test Matcher**: `Chail`, `Expect` 등의 라이브러리가 있었다.  
> - **Test Mock**: `Sinon`, `Testdouble` 등의 라이브러리가 있었다.  

## Jest의 장점
[Jest 공식 페이지](https://jestjs.io/)에 따르면 `Jest`에는 다음과 같은 장점이 존재한다:

- **zero config**: 대부분의 자바스크립트 프로젝트에서 특별한 설정이 필요 없이 바로 사용할 수 있다.
- **snapshots**: 복잡하고 거대한 객체를 추적하기 쉽게 하는 텍스트를 만들 수 있다.
- **isolated**: 성능을 최대화하기 위해서 각각의 테스트는 자체 프로세스에서 병렬적으로 실행된다.
- **great api**: `Jest` 는 잘 문서화되고, 잘 관리되고, 좋은 툴킷을 한 곳에 가지고 있다.

## Jest 설치
다음은 `TypeScript` 가 적용된 `Node.js` 환경에서 `Jest` 를 설치하는 과정이다.

### 1. 패키지 설치
```sh
npm i -D jest ts-jest @types/jest
```

> `jest`: `Jest` 프레임워크 패키지이다.  
> `ts-jest`: `TypeScript` 로 작성된 테스트 코드를 실행하기 위해 변환해주는 전처리기이다.  
> `@types/jest`: `Jest` 에 대한 여러 타입 정의이다.  
`@jest/globals` 패키지를 설치하는 방법도 있는데, 이 경우에는 `describe`, `test`, `expect` 등의 API를 직접 `import` 해서 사용해야 한다.

### 2. package.json 수정
```json
{
  "scripts": {
    "test": "jest"
  }
}
```

`test` 스크립트로 `jest` 를 사용하도록 해준다.  
이후에 `npm test` 혹은 `npm run test` 커맨드로 테스트를 실행할 수 있다.

### 3. Jest 설정 파일 생성
```sh
npx ts-jest config:init
```

`Jest` 를 사용하는데 있어서 기본적으로 설정은 필요하지 않지만 `ts` 파일을 자동으로 컴파일하지 않기 때문에 `.ts` 파일로 작성된 테스트 코드 파일에 대해서 `ts-jest` 가 변환해주도록 지시하는 설정 파일을 만들어야 한다.

그렇기에 위 커맨드를 실행하면 자동으로 아래와 같은 `jest.config.js` 파일이 생성된다:

```js
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
```



## 참고 자료
[제스트 (프레임워크) - 위키백과](https://ko.wikipedia.org/wiki/%EC%A0%9C%EC%8A%A4%ED%8A%B8_(%ED%94%84%EB%A0%88%EC%9E%84%EC%9B%8C%ED%81%AC))  
[Jest 공식 페이지](https://jestjs.io/)  
[Jest 공식 페이지 - Using TypeScript](https://jestjs.io/docs/getting-started#using-typescript)  
[Jest 공식 페이지 - Jest Config File](https://kulshekhar.github.io/ts-jest/docs/getting-started/installation/#jest-config-file)  
[Jest 소개 - Inpa](https://inpa.tistory.com/entry/JEST-%F0%9F%93%9A-jest-%EB%AC%B8%EB%B2%95-%EC%A0%95%EB%A6%AC)  
[Jest Basic - DaleSeo](https://www.daleseo.com/jest-basic/)  