---
title: "Matcher"
date: 2023-05-20 01:00
update: 2022-05-20
tags:
  - jest
series: "테스팅을 위한 Jest"
---

## Matcher란?
`expect()` 에 입력한 어떤 검증 대상에 대해서 기대 결과가 무엇이 나와야 하는지를 검사하는 함수이다.  
[API 문서](https://jestjs.io/docs/expect#matchers)에서 확인할 수 있듯 다양한 `Matcher` 가 존재하는데, 여기서는 기본적이면서 유용한 몇 가지의 `Matcher` 에 대해서만 작성해 보고자 한다.

## toBe
단순한 값의 비교에 사용한다.
```ts
expect(1 + 3).toBe(4);
```

## toEqual
객체 내부의 모든 속성에 대해서 깊은 비교를 하는데 사용한다.  
`toStrictEqual` 을 사용하면 `undefined` 속성에 대해서도 더 엄격하게 비교한다고 한다.

```ts
function getUser(id: number) {
  return {
    id,
    email: `user${id}@test.com`,
  };
}

test('use toEqual', () => {
  // 실패
  expect(getUser(1)).toBe({
    id: 1,
    email: 'user1@test.com'
  });

  // 통과
  expect(getUser(1)).toEqual({
    id: 1,
    email: 'user1@test.com'
  });
});
```

## toMatch
문자열을 대상으로 정규식을 만족하는지를 체크하는데 사용한다.
```ts
test("string", () => {
  expect(getUser(1).email).toBe("user1@test.com");
  expect(getUser(2).email).toMatch(/.*test.com$/);
});
```

## toThrow
검증 대상이 예외를 발생하는지를 알아보는데 사용한다.  
유의해야 할 점은 <b style="color: red">**`expect()` 함수에 넘기는 검증 대상을 함수로 한 번 감싸줘야 한다는 점이다!!!**</b> 감싸주지 않는다면 예외 발생 여부를 체크하는 게 아니라 테스트 실행 도중에 정말 그 예외가 발생하게 되어 버린다.

```ts
function doThrow() {
  throw new Error('에러를 발생했습니다');
}

test('use toThrow', () => {
  expect(() => doThrow()).toThrow(new Error('에러를 발생했습니다'));
});
```

## 참고 자료
[API 문서](https://jestjs.io/docs/expect#matchers)  
[Jest Basic (DaleSeo)](https://www.daleseo.com/jest-basic/)  
[Jest 기본 문법 정리 (Inpa)](https://inpa.tistory.com/entry/JEST-%F0%9F%93%9A-jest-%EA%B8%B0%EB%B3%B8-%EB%AC%B8%EB%B2%95-%EC%A0%95%EB%A6%AC)  