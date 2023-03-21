---
title: "순열과 조합"
date: 2023-03-07
update: 2023-03-07
tags:
  - algorithm
  - permutation
  - combination
---

알고리즘 문제를 풀다보면 경우의 수를 순회해야 하는 경우가 있는데  
순열이나 조합의 알고리즘을 잘 체화시켜 놓으면 유용하게 사용할 수 있다.

## 조합(combination)
조합은 n개의 원소 중에서 r개를 뽑는데 <b>순서는 고려하지 않는 것</b>이다.  
예를 들어서 [1, 2, 3, 4]의 배열이 있는데 순서에 상관없이 2가지를 선택하는 경우에 조합의 개념을 이용할 수 있다.  
조합은 원소의 순서가 달라도 조합에 들어있는 원소가 모두 같다면 같은 경우로 봐야하기 때문에 특정 인덱스 이전의 요소는 <b style="color: red;">더 이상 선택하지 말아야</b> 한다.
그렇기에 DFS를 진행할 때 이전에 선택한 원소의 갯수인 `depth` 와 별개로 앞으로 선택해야 할 첫 번째 원소의 인덱스인 `begin` 이 매개변수로 필요하다.

```js
function combination(arr, r) {
  const n = arr.length;
  const result = [];

  // depth: 선택한 원소의 갯수
  // begin: 앞으로 선택해야 할 원소의 인덱스
  const DFS = function(depth, begin) {

    // 원소를 목표치인 r개만큼 뽑았으면 출력한다.
    if (depth === r) {
      console.log(result);
      return;
    }

    // 뽑아야 할 원소가 남아있다면 이전에 선택되지 않은 원소 중에서 뽑는다.
    for (let i = begin; i < n; i++) {
      result[depth] = arr[i]; // 뽑은 원소
      DFS(depth + 1, i + 1); // 선택한 원소의 갯수와 앞으로 선택해야 할 원소의 인덱스를 증가시켜서 더 뽑는다.
    }
  }

  DFS(0, 0);
}

combination([1, 2, 3, 4], 2);
```

```
[ 1, 2 ]
[ 1, 3 ]
[ 1, 4 ]
[ 2, 3 ]
[ 2, 4 ]
[ 3, 4 ]
```

## 순열
순열은 n개의 원소 중에서 r개를 뽑는데 <b>순서를 고려하는 것</b>이다.  
조합과는 다르게 순열을 구성하는 원소 요소가 같다고 해도 원소의 순서가 다르다면 다른 순열로 보기 때문에 이전에 선택했던 요소를 정확하게 기억하기 위한 `selected` 방문 기록 변수가 필요하다.
DFS를 진행할 때는 이전에 선택한 원소의 갯수인 `depth`가 필요하다.

```js
function permutation(arr, r) {
  const n = arr.length;
  const result = [];
  const selected = Array.from({ length: n }, () => 0); // 방문 여부를 기록하는 체크 리스트

  // depth: 선택한 원소의 갯수
  const DFS = function(depth) {

    // 원소를 목표치인 r개만큼 뽑았으면 출력한다.
    if (depth === r) {
      console.log(result);
      return;
    }

    // 뽑아야 할 원소가 남아있다면 뽑는다.
    for (let i = 0; i < n; i++) {
      if (selected[i]) continue; // 이미 전에 선택한 원소라면 스킵한다.

      result[depth] = arr[i]; // 뽑은 원소
      selected[i] = 1; // 방문 체크
      DFS(depth + 1); // 선택한 원소의 갯수를 1 증가시켜서 더 뽑는다.
      selected[i] = 0; // 방문 해제
    }
  }

  DFS(0);
}

permutation([1, 2, 3, 4], 2);
```

```
[ 1, 2 ]
[ 1, 3 ]
[ 1, 4 ]
[ 2, 1 ]
[ 2, 3 ]
[ 2, 4 ]
[ 3, 1 ]
[ 3, 2 ]
[ 3, 4 ]
[ 4, 1 ]
[ 4, 2 ]
[ 4, 3 ]
```

## 참고
https://www.youtube.com/watch?v=HYKpunR1Nto  
https://www.youtube.com/watch?v=78MHQ9s7kAc  