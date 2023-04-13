---
title: "이분 탐색(Binary-Search)"
date: 2023-03-28
update: 2022-03-28
tags:
  - Algorithm
  - Binary-Search
---

정렬된 배열과 같은 자료구조에서는 특정한 데이터를 찾아야 한다면 시간복잡도가 $$O(N)$$ 인 선형 방식보다는 $$O(logN)$$ 인 이분 탐색 알고리즘을 사용하는 편이 빠르고 좋다.  

## 특정 값 찾기
배열에서 특정한 값 `target`의 인덱스 위치를 찾는 이분 탐색 알고리즘은 다음과 같다.
1. 현재 탐색하려는 중간 값 `mid`를 `(start + end) / 2`로 한다.
2. 만약 `target`이 현재 값보다 작다면 왼쪽 부분을 가지고 이분 탐색 해야한다. 따라서 `end`를 `mid - 1`로 설정한다.
3. 만약 `target`이 현재 값보다 크다면 오른쪽 부분을 가지고 이분 탐색 해야한다. 따라서 `start`를 `mid + 1`로 설정한다.
4. 만약 `target`이 현재 값과 같다면 현재 인덱스인 `mid`를 반환한다.
5. 이분 탐색이 끝날 때까지 같은 값을 찾지 못했다면 `null`을 반환한다.

```js
function binarySearch(arr, start, end, target) {
  while (start < end) {
    const mid = Math.floor((start + end) / 2);
    const value = arr[mid];

    if (target < value)
      end = mid - 1;
    else if (target > value)
      start = mid + 1;
    else return mid;
  }

  return null;
}
```

## LowerBound
배열에서 특정한 값이 중복해서 존재할 수도 있을 때, 특정한 값 `target`이 **나타나기 시작하는 가장 첫 번째 위치**를 반환하거나, 혹은 동일한 값이 없다면 그 바로 다음 인덱스를 반환하는 알고리즘이다.  
> 1. 현재 탐색하려는 중간 값 `mid`를 `(start + end) / 2`로 한다.
> 2. 만약 `target`이 **현재 값보다 크다면** 오른쪽 부분을 가지고 이분 탐색 해야한다. 따라서 `start`를 `mid + 1`로 설정한다.
> 3. 만약 `target`이 현재 값보다 작거나 같다면 왼쪽 부분을 가지고 이분 탐색 해야한다. 따라서 `end`를 `mid`로 설정한다.
> 4. 이분 탐색이 끝나면 `start`나 `end` 둘 중 하나를 아무거나 반환한다.

```js
function lowerBound(arr, start, end, target) {
  while (start < end) {
    const mid = Math.floor((start + end) / 2);
    const value = arr[mid];

    if (target > value) start = mid + 1;
    else end = mid;
  }

  return start;
}
```

## UpperBound
배열에서 특정한 값이 중복해서 존재할 수도 있을 때, 특정한 값 `target` **보다 큰 요소가 나타나는 가장 첫 번째 위치**를 반환하는 알고리즘이다.  
> 1. 현재 탐색하려는 중간 값 `mid`를 `(start + end) / 2`로 한다.
> 2. 만약 `target`이 현재 값보다 **크거나 같다면** 오른쪽 부분을 가지고 이분 탐색 해야한다. 따라서 `start`를 `mid + 1`로 설정한다.
> 3. 만약 `target`이 현재 값보다 작다면 왼쪽 부분을 가지고 이분 탐색 해야한다. 따라서 `end`를 `mid`로 설정한다.
> 4. 이분 탐색이 끝나면 `start`나 `end` 둘 중 하나를 아무거나 반환한다.

```js
function upperBound(arr, start, end, target) {
  while (start < end) {
    const mid = Math.floor((start + end) / 2);
    const value = arr[mid];

    if (target >= value) start = mid + 1;
    else end = mid;
  }

  return start;
}
```

## 활용 사례
`LowerBound`나 `UpperBound`는 값이 반드시 일치하지 않아도 **가장 근사한 인덱스를 반환** 하므로 예를 들어 다음과 같은 경우에 유용하게 사용할 수 있다.

1. 정렬된 배열에 데이터를 삽입할 때 적합한 위치를 찾음.
2. 배열에 특정 요소가 몇 개 존재하는지 구함.

## 실행 예시
```js
const datas = [0, 10, 20, 30, 30, 50, 60, 70, 80, 90];
console.log(lowerBound(datas, 0, datas.length, 30));
console.log(upperBound(datas, 0, datas.length, 30));
```

```
3
5
```