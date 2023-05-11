---
title: "큐(Queue)"
date: 2023-04-30
update: 2022-04-30
tags:
  - Algorithm
  - Queue
---

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Data_Queue.svg/330px-Data_Queue.svg.png" alt="큐">

**큐(Queue)**는 먼저 들어간 데이터가 먼저 나오는 `FIFO(First In First Out)` 형태의 자료구조이다.  
보통 예약이 먼저 걸려있는 작업부터 순차적으로 실행해야 하는 경우거나, BFS 알고리즘과 같은 곳에서 활용하기 좋다.

## 구현 방법
큐를 구현하는 방법은 크게 세 가지가 있다.
1. 배열
2. 객체(해쉬)
3. 연결 리스트

### 1. 배열
자바스크립트의 배열은 맨 뒤에 요소를 추가하는 `push(value)` 와 맨 앞에 있는 요소를 제거하여 반환하는 `shift()` 를 프로토타입의 함수로 제공한다.

그래서 배열 자체를 큐처럼 사용할 수 있는데 문제는 `shift()` 함수를 사용하면 기존의 다른 요소들의 인덱스를 모두 재조정해야하기 때문에 <b style="color: red">**성능이 굉장히 느려진다**</b>는 문제점이 있다.

#### 예시 코드
```js
for (let i = 0; i < 500000; i++) {
  arr.push(i);
}

for (let i = 0; i < 500000; i++) {
  arr.shift();
}
```

#### 실행 속도
```
Array_push: 11.721ms
Array_shift: 1:20.825 (m:ss.mmm)
```

### 2. 객체(해쉬)
데이터를 key-value 형태로 보관하고 조회할 수 있는 객체나 해쉬를 이용해서 큐를 구현하는 방법으로 배열 자체를 큐로 사용하는 것 보다는 삭제 속도가 빠르다.

`head`는 **가장 첫 번째 요소**의 인덱스를 가리키고, `tail`는 **가장 마지막 요소**의 인덱스를 가리킨다.

- 삽입: 해쉬의 `tail` 키에 새로운 값을 넣고, 이후에 삽입될 때 새로운 위치에 삽입되도록 `tail` 를 증가시킨다.
- 삭제: 해쉬의 `head` 키에 들어있는 값을 제거하여 반환하고, 이후에 삭제할 때 다음 위치의 데이터가 삭제되도록 `head` 를 증가시킨다.


#### 예시 코드
```js
class HashQueue {
  constructor() {
    this.storage = new Map();
    this.head = 0;
    this.tail = 0;
  }

  push(value) {
    if (this.size() === 0) this.storage.set(this.head, value);
    else {
      this.tail++;
      this.storage.set(this.tail, value);
    }
  }

  shift() {
    if (this.size() === 0) return;
    let result = this.storage.get(this.head);
    this.storage.delete(this.head);

    if (this.size() === 0) {
      this.head = 0;
      this.tail = 0;
    } else {
      this.head++;
    }

    return result;
  }

  size() {
    return this.storage.size;
  }
}

function main() {
  const queue = new HashQueue();
  for (let i = 0; i < 500000; i++) {
    queue.push(i);
  }

  for (let i = 0; i < 500000; i++) {
    queue.shift();
  }
}

main();
```

#### 실행 속도
```
HashQueue_push: 114.7ms
HashQueue_shift: 116.872ms
```

### 3. 연결 리스트
연결 리스트의 첫 노드와 끝 노드를 `head`, `tail` 포인터로 가리키게 하여 큐를 구현하는 방법이다.

`head`는 **가장 첫 번째 요소**를, `tail`은 **가장 마지막 요소**를 가리킨다.  
`size`는 **큐에 들어있는 원소의 갯수**를 나타낸다.

- 삽입: 새로운 데이터가 추가되면, 기존의 마지막 요소 `tail`의 다음 요소 `next`를 자기 자신으로 하고, 자기 자신은 새로운 마지막 요소가 되도록 `tail` 로 설정한다.
- 삭제: 기존의 첫 번째 요소인 `head` 를 꺼내서 반환하고, 두 번째 요소인 `head.next` 가 새롭게 `head`가 되도록 설정한다.

#### 예시 코드
```js
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedListQueue {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  push(value) {
    const node = new Node(value);
    if (this.size === 0) this.head = node;
    else this.tail.next = node;

    this.tail = node;
    this.size++;
  }

  shift() {
    if (this.size === 0) return;
    const result = this.head;
    this.head = this.head.next;
    this.size--;
    return result.value;
  }

  print() {
    const result = [];
    let current = this.head;
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    console.log(result);
  }
}

function main() {
  const queue = new LinkedListQueue();
  for (let i = 0; i < 500000; i++) {
    queue.push(i);
  }

  for (let i = 0; i < 500000; i++) {
    queue.shift();
  }
}

main();
```

#### 실행 속도
```
LinkedListQueue_push: 55.313ms
LinkedListQueue_shift: 7.626ms
```

## 속도 비교
- 삽입: 배열 > 연결 리스트 > 해쉬
- 삭제: 연결 리스트 > 해쉬 >>>>> 배열

배열을 큐처럼 사용한 경우가 삭제 연산에 있어서 매우 차이 날 정도로 느렸다.  
그래서 코딩 테스트 문제를 풀다가 간혹 배열을 큐처럼 사용했을 때엔 통과하지 못했지만, 다른 방법을 선택할 때엔 통과하는 경우가 몇 번 있었다.

이런 경우에는 재빠르게 큐를 직접 구현해서 사용하는 편이 좋겠다.

## 참고 자료
https://ko.wikipedia.org/wiki/%ED%81%90_%28%EC%9E%90%EB%A3%8C_%EA%B5%AC%EC%A1%B0%29
