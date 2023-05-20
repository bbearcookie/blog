---
title: "Jest 전역 환경"
date: 2023-05-20
update: 2022-05-21
tags:
  - jest
series: "테스팅을 위한 Jest"
---

테스트 파일 안에서 `Jest` 는 테스트를 위한 여러 유용한 메소드와 객체를 전역 환경에 추가한다.  

자세한 내용은 [공식 문서](https://jestjs.io/docs/api)에서 확인할 수 있고 여기서는 유용하다고 생각되는 몇 가지의 기능을 정리해보고자 한다.

## 영역 묶기
연관이 있는 `test` 함수는 같은 블록에 존재하는게 관리하기 좋다.  
`describe` 를 사용하면 여러 `test` 함수를 하나의 블록으로 묶을 수 있다.

## 테스트 전/후 처리
테스트 코드를 작성하다 보면 여러 테스트 함수에서 공통적으로 필요한 로직이 있다거나 테스트 전과 후에 초기화해줘야 하는 작업이 존재하는 경우가 생길 수 있다.  

`Jest` 는 이런 경우에 사용할 수 있는 기능을 제공한다.

### beforeAll / beforeEach
- **beforeAll**: 같은 영역에 있는 `test` 함수를 실행하기 전에 한 번 호출된다.
- **beforeEach**: 같은 영역에 있는 각 `test` 함수를 실행할 때마다 호출된다.

### afterAll / afterEach
- **afterAll**: 같은 영역에 있는 `test` 함수를 모두 종료한 뒤에 한 번 호출된다.
- **afterEach**: 같은 영역에 있는 각 `test` 함수를 종료할 때마다 호출된다.

### 실행 순서
```ts
beforeAll(() => console.log('outside beforeAll'));
afterAll(() => console.log('outside afterAll'));

describe('전/후처리 테스트', () => {
  beforeAll(() => console.log('inside beforeAll'));
  afterAll(() => console.log('inside afterAll'));

  describe('Each 테스트', () => {
    beforeEach(() => console.log('Each'));

    test('Each test', () => {
      expect(true).toBeTruthy();
    });
  });

  test('one test', () => {
    expect(true).toBeTruthy();
  });
  test('one test', () => {
    expect(true).toBeTruthy();
  });
  test('one test', () => {
    expect(true).toBeTruthy();
  });
  test('one test', () => {
    expect(true).toBeTruthy();
  });
});
```

```
outside beforeAll
inside beforeAll
Each
inside afterAll
outside afterAll
```

`beforeAll` 은 외부 영역일수록 먼저 실행하고, `afterAll` 은 내부 영역일수록 먼저 실행한다는 점을 확인할 수 있다.  

또한, `beforeEach()` 가 실행된 영역의 바깥 부분에 존재하는 `test` 함수에 대해서는 `Each` 를 출력하고 않는다는 점을 확인할 수 있다.

## 테스트 코드 부분 실행
테스트 코드의 특정 부분에서 문제가 발생할 때 다른 `test` 함수 때문에 발생하는 문제인지, 혹은 해당 `test` 함수 자체에 문제가 있는지 알고싶을 경우가 있다.  

이런 경우에는 `describe` 나 `test` 에 `skip` 이나 `only` 를 붙여서 사용한다.

- **skip**: 테스트 과정에서 해당 `test` 함수를 무시하고 넘어간다.  
- **only**: 테스트 과정에서 해당 `test` 함수만 실행한다.

### 예시 코드
```ts
describe('skip 테스트', () => {
  test('진행할 테스트', () => {
    expect(true).toBeTruthy();
  });
  test.skip('스킵할 테스트', () => { // 이 테스트는 무시하고 넘어가게 된다.
    expect(true).toBeTruthy();
  });
  test('진행할 테스트2', () => {
    expect(true).toBeTruthy();
  });
});
```

## 참고 자료
[Globals - Jest](https://jestjs.io/docs/api)  
[Jest로 테스트 전/후 처리하기 (DaleSeo)](https://www.daleseo.com/jest-before-after/)  
[Jest 강좌 #4 테스트 전후 작업 - 자바스크립트 테스트 프레임워크 (코딩앙마)](https://www.youtube.com/watch?v=TRZ2XdmctSQ&list=PLZKTXPmaJk8L1xCg_1cRjL5huINlP2JKt&index=4)  