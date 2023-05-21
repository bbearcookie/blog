---
title: "모킹(Mocking)"
date: 2023-05-21
update: 2022-05-21
tags:
  - jest
series: "테스팅을 위한 Jest"
---

## 모킹이란?
기존 함수의 기능을 **흉내내는 가짜 함수**를 만들어 내는 것을 말한다.

우리가 테스트 코드를 작성할 때 데이터베이스나 외부의 서버로부터 데이터를 가져오는 등의 외부에 의존해야 하는 경우가 있다. 이런 경우에는 단위 테스트가 외부의 상황에 따라서 결과가 달라지는 문제점이 발생하기 때문에 **외부에 의존하는 코드를 가짜로 대체**하는 모킹을 활용할 수 있다.  

`Jest` 에서 모킹을 활용하는 방법은 `jest.fn()`, `jest.spyOn()`, `jest.mock()` 이 있다.

## 실행 환경 추적
모킹 함수는 내부적으로 `.mock` 프로퍼티를 가지고 있다.  

이 프로퍼티에 들어있는 여러 속성들을 통해서 모킹 함수가 **몇 번 호출** 되었는지, **어떤 값을 인자**로 전달 받았는지, **this의 값**은 무엇이었는지 등의 다양한 정보를 추적할 수 있다.

### mockFn.mock.calls
모킹 함수에 전달했던 **인자의 정보**를 기억하는 배열 변수이다. 만약 모킹 함수를 호출할 때 `f('arg1', 'arg2')`, `f('arg3', 'arg4')` 의 순서로 진행했다면 내부의 내용은 다음과 같다:
```js
[
  ['arg1', 'arg2'],
  ['arg3', 'arg4'],
];
```

### mockFn.mock.results
모킹 함수가 반환했던 값을 기억하는 객체가 담긴 배열 변수이다. 객체 내부에는 `type` 과 `value` 값을 포함하고 있다.
> Type 종류
> - **return**: 모킹 함수가 값을 정상적으로 반환했던 경우이다.  
> - **throw**: 모킹 함수가 예외를 던졌던 경우이다.  
> - **imcomplete**: 아직 호출에 대한 실행이 완료되지 않은 경우이다.  
```js
[
  {
    type: 'return',
    value: 'result1',
  },
  {
    type: 'throw',
    value: {
      /* Error instance */
    },
  },
  {
    type: 'return',
    value: 'result2',
  },
];
```

### mockFn.mock.instances
모킹 함수가 `new` 연산자로 인스턴스화 된 경우에 해당 객체의 인스턴스가 담긴 배열 변수이다.

```js
const mockFn = jest.fn();

const a = new mockFn();
const b = new mockFn();

mockFn.mock.instances[0] === a; // true
mockFn.mock.instances[1] === b; // true
```

### mockFn.mock.contexts
모킹 함수를 호출했던 당시에 `this` 에 바인딩되는 객체 정보가 담긴 배열 변수이다.

```ts
describe('mock.contexts 에 대한 코드', () => {
  const mockFn = jest.fn();

  class Person {
    name: string;
    age: number;

    constructor(name: string, age: number) {
      this.name = name;
      this.age = age;
    }

    callMockFn(...args: any[]) {
      mockFn.call(this, ...args);
    }
  }

  const kim = new Person('kim', 20)
  kim.callMockFn('a', 'b');
  kim.callMockFn(10, 20);

  const lee = new Person('lee', 25);
  lee.callMockFn('a', 'b');
  lee.callMockFn(10, 20);

  test('호출했던 당시의 this 값 테스트', () => {
    expect(mockFn.mock.contexts[0]).toStrictEqual(kim); // true
    expect(mockFn.mock.contexts[1]).toStrictEqual(kim); // true
    expect(mockFn.mock.contexts[2]).toStrictEqual(lee); // true
    expect(mockFn.mock.contexts[3]).toStrictEqual(lee); // true
  });
});
```

```ts
// mockFn.mock.contexts
[
  Person { name: 'kim', age: 20 },
  Person { name: 'kim', age: 20 },
  Person { name: 'lee', age: 25 },
  Person { name: 'lee', age: 25 }
]
```

## 유용한 Matcher
모킹 함수에 대한 실행 환경을 추적하기 위해서 `.mock` 프로퍼티를 직접 참조하지 않고 `expect()` 함수의 `Matcher` 를 이용하는 방법도 있다.

- **.toHaveBeenCalled()**  
함수가 호출된 적이 있는지를 확인한다.  
`.toBeCalled()` 로 사용할 수도 있다.  
- **.toHaveBeenCalledTimes(number)**  
함수가 특정 횟수만큼 호출되었는지를 확인한다.  
`.toBeCalledTimes(number)` 로 사용할 수도 있다.  
- **.toHaveBeenCalledWith(arg1, arg2, ...)**  
함수가 해당 인수를 전달받고 호출되었는지를 확인한다.  
`.toBeCalledWith()` 로 사용할 수도 있다.
- **.toHaveReturned()**  
함수가 값을 반환한 적이 있는지를 확인한다.  
`.toReturn()` 로 사용할 수도 있다.  
- **.toHaveReturnedTimes(number)**  
함수가 특정 횟수만큼 반환되었는지를 확인한다.  
`.toReturnTimes(number)` 로 사용할 수도 있다.  
- **.toHaveReturnedWith(value)**  
함수가 해당 값을 반환한 적이 있는지를 확인한다.  
`.toReturnWith(value)` 로 사용할 수도 있다.  

## jest.fn()
`jest.fn()` 을 호출하면 모킹 함수가 생성된다.  
모킹 함수를 생성한 뒤에는 그 함수가 어떤 값을 반환할 것인지를 정의해줘야 하는데 다음과 같은 API가 존재한다:

- **mockFn.mockReturnValue(value)**  
모킹 함수가 `value` 를 반환하도록 한다.  
- **mockFn.mockImplementation(fn)**  
모킹 함수의 내부에서 동작하는 코드를 직접 작성한다.  
- **mockFn.mockResolvedValue(value)**  
모킹 함수가 해당 `value` 를 이행하는 `Promise` 를 반환한다.  
- **mockFn.mockRejectedValue(value)**  
모킹 함수가 해당 `value` 를 이유로 거부하는 `Promise` 를 반환한다.  

각각의 API에는 `mockFn.mockReturnValueOnce(value)` 와 같이 `Once` 가 접미사로 붙은 것도 제공하는데, 이는 이후의 호출에 대해서 한 번만 작동하는 API이다.

### 예시 코드
```ts
test('mocking', async () => {
  const mockFn = jest
    .fn()
    .mockReturnValue('default')
    .mockReturnValueOnce(5)
    .mockImplementationOnce(() => 'hello')
    .mockResolvedValueOnce('Resolved')
    .mockRejectedValueOnce(new Error('Rejected'));

  console.log(mockFn()); // 5
  console.log(mockFn()); // 'hello'
  console.log(mockFn()); // Promise { 'Resolved' }
  console.log(mockFn()); // Promise { <rejected> Error: Rejected }
  console.log(mockFn()); // 'default'

  expect(mockFn()).toBe('default');
});
```

### 제네릭
타입스크립트를 사용하면 `jest.fn()` 에 제네릭 인자를 세 개 넘겨줄 수 있다.
```ts
function fn<T, Y extends any[], C = any>(implementation?: (this: C, ...args: Y) => T): Mock<T, Y, C>;
```
- **T**: 해당 모킹 함수가 반환하는 값의 타입을 지정한다.  
- **Y**: 해당 모킹 함수가 받는 매개변수의 타입을 지정한다.  
- **C**: 정확하게는 모르겠지만, `this` 에 바인딩 되는 값의 타입을 지정하는 듯 하다.  

#### 예시 코드
다음은 `number` 형태의 인자 두 개를 받아서 합을 반환하는 코드이다: 

```ts
test('1 + 2 = 3', () => {
  const adder = jest.fn<number, [number, number]>((a, b) => a + b);
  expect(adder(1, 2)).toBe(3);
});
```

## jest.spyOn()
실행 환경을 추적하는 기능은 모킹 함수에만 적용이 된다.  

그렇기 때문에 실제 구현 코드의 함수 자체에 대해서는 실행 환경을 추적할 수 없는데, 간혹 함수의 기능을 흉내내는 새로운 가짜 함수를 만드는 것이 아니라 **기존의 함수를 그대로 사용한 채로 실행 환경만 추적**하고 싶은 경우가 있다.  

이런 경우에는 `jest.spyOn()` 으로 <b style="color: red">**기존에 존재하는 객체의 일부 메소드가 호출되는 환경을 지켜보는 모킹 함수**</b>를 만들 수 있다.

### 예시 코드
아래 코드는 기존 객체 `calculator` 의 `add` 메소드가 동작하는 것을 지켜보는 코드이다.  

```ts
describe('about spyon', () => {
  const calculator = {
    add: (a: number, b: number) => a + b,
    minus: (a: number, b: number) => a - b
  }

  test('toHaveReturnedWith', () => {
    const spy = jest.spyOn(calculator, 'add'); // calculator 객체의 add 메소드의 동작을 지켜본다.
    
    calculator.add(1, 2); // 모킹 함수를 실행하는게 아니라, 기존의 함수를 그대로 실행하고 있다.
    calculator.add(3, 2);
    calculator.add(5, 4);
    
    expect(spy).toHaveReturnedWith(3);
  });
});
```

## jest.mock()
특정 모듈을 모킹하는 기능이다.  

테스트 하려는 코드에서 모킹해야 하는 부분이 많다면 일일히 `jest.fn()` 으로 새로운 모킹 함수를 만드는 과정도 굉장히 번거로워진다.  

특히 `axios` 같이 외부 라이브러리에 의존하는 부분에 대한 모킹을 처리해야 하는 경우에 어려움이 더해지는데 `jest.mock()` 을 이용하면 **특정 모듈을 한번에 모킹**할 수 있다.

사용 방법은 최상위 레벨의 영역에서 `jest.mock(사용할 모듈)` 을 호출해주면 된다.

직접 만든 `messageService` 와 외부 라이브러리인 `axios` 에서 내보내는 모든 함수에 대해서 모킹하고 싶다면 다음과 같이 작성한다:
```ts
jest.mock('../messageService');
jest.mock('axios');
```


## 참고 자료
[Mock Functions](https://jestjs.io/docs/mock-functions)  
[Mock Functions API](https://jestjs.io/docs/mock-function-api)  
[jest.fn(), jest.spyOn() 함수 모킹 (DaleSeo)](https://www.daleseo.com/jest-fn-spy-on/)  
[모킹 Mocking 정리 - jest.fn / jest.mock / jest.spyOn (Inpa)](https://inpa.tistory.com/entry/JEST-%F0%9F%93%9A-%EB%AA%A8%ED%82%B9-mocking-jestfn-jestspyOn?category=914656)  