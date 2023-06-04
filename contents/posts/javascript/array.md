---
title: "배열(Array)"
date: 2023-06-03
update: 2023-06-03
tags:
  - JavaScript
  - Array
---

## 배열
배열은 여러 개의 값을 순차적으로 나열한 자료구조이다.  
- **밀집 배열(dense array)**: 동일한 크기의 메모리 공간이 빈틈없이 연속적으로 나열된 구조이다.  
- **희소 배열(sparse array)**: 각각의 메모리 공간의 크기가 달라도 되고 연속적으로 이어져있지 않을 수도 있는 구조이다. 자바스크립트에서의 배열이 희소 배열에 해당한다.  

### 특징
- 배열은 `Array` 객체이며 `Object` 를 상속한다.  
- `length` 프로퍼티를 가진다.  
- 배열은 객체이지만, 자바스크립트 엔진이 일반 객체와 구별하여 좀 더 배열처럼 동작하도록 최적화하기 때문에 객체를 배열처럼 사용했을 때 보다 빠르다.  

### 유사 배열
마치 배열처럼 프로퍼티 값을 인덱스로 접근할 수 있고, `length` 프로퍼티를 가진 객체를 **유사 배열(Array-Like)** 이라고 한다.  

```js
const arrayLike = {
  '0': 10,
  '1': 20,
  '2': 30,
  length: 3,
};

for (let i in arrayLike) {
  console.log(arrayLike[i]);
}
```

## 생성 방법
배열을 생성하는 방법은 4가지이다.  

- **배열 리터럴**: `[]` 를 이용해서 배열을 생성한다.  
- **Array 생성자**: `Array` 생성자 함수를 이용해서 배열을 생성한다.  
인자로 단일 숫자를 보내면 배열의 길이를 나타내고, 그렇지 않은 경우에는 배열에 채워넣을 요소로 사용한다.  
- **Array.of() 메소드**: 전달된 인수를 요소로 갖는 배열을 생성한다.  
- **Array.from() 메소드**: 유사 배열 객체나 이터러블 객체를 가지고 새로운 배열을 생성한다.  
두 번째 인자로 배열의 모든 요소에 대해 호출할 맵핑 함수를 넘겨줄 수 있다.  


```js
const literal = [10, 20, 30]; // [ 10, 20, 30 ]

const constructor1 = new Array(5); // [ <5 empty items> ]
const constructor3 = new Array('a'); // [ 'a' ]
const constructor2 = new Array(5).fill(2); // [ 2, 2, 2, 2, 2 ]
const constructor4 = new Array(10, 20, 30); // [ 10, 20, 30 ]

const array1 = Array(5); // [ <5 empty items> ]
const array2 = Array(10, 20, 30); // [ 10, 20, 30 ]

const of1 = Array.of(10); // [ 10 ]
const of2 = Array.of(10, 20, 30); // [ 10, 20, 30 ]

const from1 = Array.from({ length: 3, 0: 10, 1: 20, 2: 30 }); // [ 10, 20, 30 ]
const from2 = Array.from({ length: 5 }, (_, i) => i + 1); // [ 1, 2, 3, 4, 5 ]
const from3 = Array.from(Array(5).fill(2)); // [ 2, 2, 2, 2, 2 ]
```

## 유용한 프로토타입 메소드
### 합치기
- **concat**: 두 배열을 합쳐서 새 배열을 반환한다. 기존 배열을 변경하지는 않는다.  

```js
[1, 2, 3].concat([4, 5, 6]); // [1, 2, 3, 4, 5, 6]
```

### 삽입 / 삭제
- **push**: 배열의 마지막 자리에 요소를 추가하고, 배열의 크기를 반환한다.  

```js
const animals = ['pigs', 'goats', 'sheep'];
animals.push('bear'); // (반환 값: 4) 배열: ['pigs', 'goats', 'sheep', 'bear']
```

- **pop**: 배열의 마지막 요소를 제거하고, 그 요소를 반환한다.

```js
const animals = ['pigs', 'goats', 'sheep', 'bear'];
animals.pop(); // bear
```

- **unshift**: 배열의 첫 번째 자리에 요소를 추가하고, 배열의 크기를 반환한다.  

```js
const animals = ['pigs', 'goats', 'sheep'];
animals.shift('bear'); // (반환 값: 4) 배열: ['bear', 'pigs', 'goats', 'sheep']
```

- **shift**: 배열의 첫 번째 요소를 제거하고, 그 요소를 반환한다.  

```js
const animals = ['pigs', 'goats', 'sheep', 'bear'];
animals.shift(); // pigs
```

<b style="color: red">**주의!**</b> `unshift` 와 `shift` 는 모든 요소의 인덱스를 하나씩 옮겨줘야 하기 때문에 느리다.

### 추출 / 변경
- **slice(begin, end)**: 배열의 `begin` 인덱스부터 `end` 인덱스까지 (`end` 미포함) 추출해서 새로운 배열을 반환한다.  
원본 배열은 변경되지 않는다.  

```js
const animals = ['pigs', 'goats', 'sheep', 'bear'];
console.log(animals.slice(1, 3)); // [ 'goats', 'sheep' ]
```

- **splice(start, deleteCount, ...items)**:  
배열의 기존 요소를 삭제하거나 새로운 요소를 추가하여 배열의 내용을 변경한다.  
반환 값은 제거한 요소를 담은 배열이다.  
  - **첫 번째 인자**: 배열의 변경을 시작할 인덱스  
  - **두 번째 인자**: 배열에서 제거할 요소의 수  
(`slice` 에서 두 번째 인자는 마지막 인덱스를 가리키는 값 이었는데, 여기서는 제거할 요소의 수이다.)
  - **세 번째 이후 인자**: 배열에 추가할 요소들

```js
const animals = ['pigs', 'goats', 'sheep', 'bear'];
console.log(animals.slice(1, 3)); // [ 'pigs', 'goats', 'sheep' ]
console.log(animals); // [ 'dog', 'cat', 'snake', 'bear' ]
```

## 참고 자료
모던 자바스크립트 Deep Dive 27장 배열  
[Array (MDN)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array)  
[배열 (코어 자바스크립트)](https://ko.javascript.info/array)  