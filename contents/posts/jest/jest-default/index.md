---
title: "Jest"
date: 2023-05-19
update: 2022-05-20
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

> - **jest**: `Jest` 프레임워크 패키지이다.  
> - **ts-jest**: `TypeScript` 로 작성된 테스트 코드를 실행하기 위해 변환해주는 전처리기이다.  
> - **@types/jest**: `Jest` 에 대한 여러 타입 정의이다.  
`@jest/globals` 패키지를 설치하는 방법도 있는데, 이 경우에는 describe, test, expect 등의 API를 직접 `import` 해서 사용해야 한다.

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

`Jest` 를 사용하는데 있어서 기본적으로 설정이 필요하지는 않지만, `ts` 파일을 자동으로 컴파일하지 않기 때문에 `.ts` 파일로 작성된 테스트 코드 파일에 대해서 `ts-jest` 가 변환해주도록 지시해야 한다.

그렇기 때문에 `jest.config.js` 설정 파일에 해당 내용을 적어줘야 하는데, 위 커맨드를 실행하면 자동으로 아래와 같은 파일이 생성된다.

```js
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
```

### Jest 기본 사용법

#### 테스트 실행
기본적으로 `Jest` 는 파일 이름이 `test.js` 나 `test.ts` 로 끝나는 경우에 테스트 파일이라고 인식하는데 `npm test` 커맨드를 실행하면 프로젝트 내에 존재하는 모든 테스트 파일을 실행한다.  

만약 특정 파일만 실행하고 싶은 경우에는 `npm test <파일명 or 경로>` 커맨드를 실행하면 된다.

#### 테스트 파일 작성
```ts
describe('테스트 영역 설명', () => {
  test('테스트 설명', () => {
    expect(검증 대상).Matcher(기대 결과)
  });
})
```

`Jest` 의 테스트 코드는 위와 같은 형식으로 작성한다.  

- **describe**: 특정 테스트를 위해서 `test` 를 여러 번 호출하는 경우에는 유사한 `test` 를 같은 영역에 묶을 수 있다.  
- **test**: 어떤 검증 대상에 대해서 기대 결과가 어떻게 되어야 하는지를 내부에 담고 있는 API이다. `it` 이라는 별칭으로 사용할 수도 있다.
- **expect**: 어떤 값을 검증할 것인지 대상을 적어주는 API이다.
- **Matcher**: 검증하려는 대상이 어떤 결과가 나와야 하는지를 적어주는 API이다. `toBe`, `toEqual`, `toBeTruthy` 등 많은 Matcher 가 존재하며 [API 문서](https://jestjs.io/docs/expect)에서 확인할 수 있다.

#### 예시 코드

```js
/* sum.js */
function sum(a, b) { return a + b; }
module.exports = sum;
```

```js
/* sum.test.js */
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

위 테스트 코드는 정의된 `sum` 함수에 대해서 테스트를 수행하며, `sum(1, 2)` 의 결과가 `3` 과 일치한지를 확인한다.




## 참고 자료
[제스트 (프레임워크) - 위키백과](https://ko.wikipedia.org/wiki/%EC%A0%9C%EC%8A%A4%ED%8A%B8_(%ED%94%84%EB%A0%88%EC%9E%84%EC%9B%8C%ED%81%AC))  
[Jest 공식 페이지](https://jestjs.io/)  
[Jest 공식 페이지 - Using TypeScript](https://jestjs.io/docs/getting-started#using-typescript)  
[Jest 공식 페이지 - Jest Config File](https://kulshekhar.github.io/ts-jest/docs/getting-started/installation/#jest-config-file)  
[Jest 소개 - Inpa](https://inpa.tistory.com/entry/JEST-%F0%9F%93%9A-jest-%EB%AC%B8%EB%B2%95-%EC%A0%95%EB%A6%AC)  
[Jest Basic - DaleSeo](https://www.daleseo.com/jest-basic/)  