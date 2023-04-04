---
title: "우선순위 큐"
date: 2023-04-04
update: 2023-04-04
tags:
  - Algorithm
  - Priority-Queue
---

## 우선순위 큐

큐는 기본적으로 먼저 들어온 데이터가 먼저 나가는 FIFO(First In First Out) 형식의 자료구조인데  
우선순위 큐는 입출력 순서가 아니라 **우선순위가 높은 요소부터 먼저 나가는 자료구조**이다.  
보통 힙을 이용해서 구현한다.

## 힙
힙은 최대 값이나 최소 값을 찾아내는 연산을 빠르게 하기 위하여 고안된 자료구조이다.  
힙은 완전이진트리로서 형제 노드 끼리의 값의 관계는 보장하지 않지만, 부모와 자식간의 관계는 보장하는 일종의 반정렬 상태의 자료구조이다.  
배열로 구현하면 편리하며 루트 노드를 1번째 인덱스로 지정하기 위해서 맨 처음에는 사용하지 않는 `null` 값을 넣어주면 편리하다.

- **최대 힙(Max Heap)**: 부모 노드가 항상 자식 노드보다 큰 힙이다.
- **최소 힙(Min Heap)**: 부모 노드가 항상 자식 노드보다 작은 힙이다.

> 왼쪽 자식 노드: 2n  
> 오른쪽 자식 노드: 2n + 1  
> 부모 노드: n / 2  

### 삽입
1. 힙의 가장 마지막 자리에 새로운 노드를 삽입한다.
2. 부모와 자식 노드의 값을 비교하면서 올라가며 최대 힙이나 최소 힙의 정해진 조건을 만족할 때까지 서로의 값을 변경한다.

### 삭제
1. 힙에 아무런 데이터도 없다면 `undefined`를 반환한다.
2. 힙에 딱 하나의 노드만 있다면 그 노드를 반환한다.
3. 힙에 두 개 이상의 노드가 있다면, 루트 노드의 값을 기억했다가 반환하고, 가장 마지막에 있는 노드를 루트 노드에 대입하여 자식 노드와 비교하면서 내려가며 최대 힙이나 최소 힙의 정해진 조건을 만족할 때까지 서로의 값을 변경한다.


## 소스코드
```js{10, 26-27}
const heap = [null];

function heapPush(value) {
  heap.push(value);

  let child = heap.length - 1;

  while (child > 1) {
    let parent = Math.floor(child / 2);
    if (heap[parent] < heap[child]) break;
    [heap[parent], heap[child]] = [heap[child], heap[parent]];
    child = parent;
  }
}

function heapPop() {
  if (heap.length <= 1) return;
  if (heap.length === 2) return heap.pop();

  let result = heap[1];
  heap[1] = heap.pop();
  let parent = 1;
  let child = 2;

  while (child < heap.length - 1) {
    if (child + 1 < heap.length - 1 && heap[child] > heap[child + 1]) child++;
    if (heap[parent] < heap[child]) break;
    [heap[parent], heap[child]] = [heap[child], heap[parent]];
    parent = child;
    child *= 2;
  }

  return result;
}
```

위는 루트 노드가 가장 작은 숫자인 최소 힙을 구현한 것이다. 만약 최대 힙으로 구현하고 싶다면 `10, 26, 27`번째 줄의 부등호를 반대로 해주면 된다.