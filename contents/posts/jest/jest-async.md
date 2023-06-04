---
title: "비동기 코드 테스트"
date: 2023-05-20 02:00
update: 2022-05-20 02:00
tags:
  - jest
series: "테스팅을 위한 Jest"
---

기본적으로 테스트 코드를 작성할 때 비동기 작업에 대한 테스트를 진행해야 하는 경우에는 `Jest` 에게 아직 비동기 작업이 수행중이라는 사실을 알려줘야 한다. 그렇지 않으면 비동기 작업은 아직 수행되지 않은 채로 `test` 함수가 종료되는 시점에 바로 테스트가 완료된다.

`Callback`, `Promise`, `async-await` 마다 비동기 작업을 알리는 방법은 약간의 차이점이 존재하는데 이에 대해서 정리해보고자 한다.

## 콜백 함수 테스트
비동기 작업을 수행하는 콜백 함수를 테스트할 때는 `test(name, fn, timeout)` 함수의 두 번째 매개변수에 포함된 `done` 을 사용해야 한다.

`fn` 의 매개변수에 `done` 을 정의되어 있는 경우, `Jest` 는 비동기 작업에 대한 테스트 코드가 존재한다는걸 인지하고 `done` 이 호출될 때까지 테스트를 종료하지 않고 대기한다.

### 예시 코드
```ts{10}
function load(num: number, callback: (num: number) => void) {
  setTimeout(() => {
    callback(num);
  }, 3000);
}

test('callback test', (done) => {
  const callback = (num: number) => {
    expect(num).toBe(3);
    done(); // 비동기 작업이 완료되는 시점에 done을 호출해서 Jest에게 종료를 알린다!
  };

  load(5, callback);
});
```

## Promise 테스트
프로미스 기반의 비동기 작업에 대해서 테스트할 때는 수행하려는 `Promise` 를 `return` 하면 된다. 프로미스를 반환하면 `Jest` 는 해당 프로미스가 `fulfilled` 될 때까지 기다려 주게 된다.

### 예시 코드
```ts
function load(num: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(num);
    }, 3000);
  });
}

test('promise test1', () => {
  return load(5).then(value => expect(value).toBe(5));
});

test('promise test2', () => {
  return expect(load(5)).resolves.toBe(5);
});
```

`test1` 처럼 프로미스 객체의 `then` 메소드를 사용해서 결과를 비교하는 방법도 있고  
`test2` 처럼 프로미스를 `expect` 의 인자로 넣고 `resolves` Modifier 를 이용해서 결과를 비교하는 방법도 있다.

## async-await 테스트
`async-await` 문법을 이용해서 비동기 작업을 테스트하는 방법이다.  

`test(name, fn, timeout)` 함수의 두 번째 매개변수를 `async` 함수로 주고 내부에서 `await` 키워드를 통해서 비동기 작업이 수행되는 것을 기다린다.

### 예시 코드
```ts
function load(num: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(num);
    }, 3000);
  });
}

test('async-await test', async () => {
  expect(await load(6)).toBe(6);
  const num = await load(5);
  expect(num).toBe(5);
});
```