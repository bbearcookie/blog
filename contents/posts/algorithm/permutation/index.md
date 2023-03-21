---
title: "순열 알고리즘"
date: 2022-11-12
update: 2022-11-12
tags:
  - algorithm
  - permutation
---

## 내용 업데이트
[순열과 조합](https://bbearcookie.netlify.app/permutation-and-combination/)  
현재 포스트와 유사한 내용을 다시 새로운 글로 작성하였음.

![](./images/permutation/main.png)

알고리즘 코딩 문제를 풀다보면 모든 경우의 수마다 한번씩 순회하여 특정한 로직을 수행해야 하는 경우가 있다.  
이런 경우에 순열을 활용하면 쉽게 순회할 수 있다.

## 순열

![](./images/permutation/npr.png)

순열이란 <b>서로 다른 n개의 요소</b> 중에서 <span style="color:red"><b>r개</b></span>를 중복없이 순서에 상관있게 선택하는 경우의 수를 의미한다.  
예를들어, 전체 요소가 [a, b, c] 이라고 할 때, 2개만 선택하는 경우  
- ab
- ac
- bc  

이렇게 세 가지의 경우가 있다.

## 순열 찾는 알고리즘

만약 주어진 배열이 [a, b, c, d] 일 때 서로 다른 3개의 원소를 선택해서 나열하려면 어떻게 해야할까?  
결론은, 요소를 <b>하나씩 선택된 요소 집합으로 추가</b>하면서,
아직 <span style="color:red"><b>선택되지 않은 요소들의 순서를 바꿔서 하나씩 추가</b></span>해서 진행하면 된다.  
알고리즘의 흐름대로 진행하는 과정을 서술하자면 다음과 같다.

<ul>
  <li>a <=> a를 스왑하여
  <span style="background: #4D5357; color: #FFBF00;">{a}</span> 선택.
  {b, c, d} 남음.
  </li>
  <ul>
    <li>b <=> b를 스왑하여
    <span style="background: #4D5357; color: #FFBF00;">{a, b}</span> 선택.
    {c, d} 남음.
    </li>
    <ul>
      <li>c <=> c를 스왑하여
      <span style="background: #4D5357; color: #FFBF00;">{a, b, c}</span> 선택.
      </li>
    </ul>
    <ul>
      <li>c <=> d를 스왑하여
      <span style="background: #4D5357; color: #FFBF00;">{a, b, d}</span> 선택.
      </li>
    </ul>
  </ul>
  <ul>
    <li>b <=> c를 스왑하여
    <span style="background: #4D5357; color: #FFBF00;">{a, c}</span> 선택.
    {b, d} 남음.
    </li>
    <ul>
      <li>b <=> b를 스왑하여
      <span style="background: #4D5357; color: #FFBF00;">{a, c, b}</span> 선택.
      </li>
    </ul>
    <ul>
      <li>b <=> d를 스왑하여
      <span style="background: #4D5357; color: #FFBF00;">{a, c, d}</span> 선택.
      </li>
    </ul>
  </ul>
  <ul>
    <li>b <=> d를 스왑하여
    <span style="background: #4D5357; color: #FFBF00;">{a, d}</span> 선택.
    {c, b} 남음.
    </li>
    <ul>
      <li>c <=> c를 스왑하여
      <span style="background: #4D5357; color: #FFBF00;">{a, d, c}</span> 선택.
      </li>
    </ul>
    <ul>
      <li>c <=> b를 스왑하여
      <span style="background: #4D5357; color: #FFBF00;">{a, d, b}</span> 선택.
      </li>
    </ul>
  </ul>
</ul>

<ul>
  <li>a <=> b를 스왑하여
  <span style="background: #4D5357; color: #FFBF00;">{b}</span> 선택.
  {a, c, d} 남음.
  </li>
  <ul>
    <li>a <=> a를 스왑하여
    <span style="background: #4D5357; color: #FFBF00;">{b, a}</span> 선택.
    {c, d} 남음.
    </li>
    <ul>
      <li>c <=> c를 스왑하여
      <span style="background: #4D5357; color: #FFBF00;">{b, a, c}</span> 선택.
      </li>
    </ul>
    <ul>
      <li>c <=> d를 스왑하여
      <span style="background: #4D5357; color: #FFBF00;">{b, a, d}</span> 선택.
      </li>
    </ul>
  </ul>
  <ul>
    <li>a <=> c를 스왑하여
    <span style="background: #4D5357; color: #FFBF00;">{b, c}</span> 선택.
    {a, d} 남음.
    </li>
    <ul>
      <li>a <=> a를 스왑하여
      <span style="background: #4D5357; color: #FFBF00;">{b, c, a}</span> 선택.
      </li>
    </ul>
    <ul>
      <li>a <=> d를 스왑하여
      <span style="background: #4D5357; color: #FFBF00;">{b, c, d}</span> 선택.
      </li>
    </ul>
  </ul>
  <ul>
    <li>a <=> d를 스왑하여
    <span style="background: #4D5357; color: #FFBF00;">{b, d}</span> 선택.
    {c, a} 남음.
    </li>
    <ul>
      <li>c <=> c를 스왑하여
      <span style="background: #4D5357; color: #FFBF00;">{b, d, c}</span> 선택.
      </li>
    </ul>
    <ul>
      <li>c <=> a를 스왑하여
      <span style="background: #4D5357; color: #FFBF00;">{b, d, a}</span> 선택.
      </li>
    </ul>
  </ul>
</ul>

<ul>
  <li>a <=> c를 스왑하여
  <span style="background: #4D5357; color: #FFBF00;">{c}</span> 선택.
  {b, a, d} 남음.
  </li>
  <ul>
    <li>b <=> b를 스왑하여
    <span style="background: #4D5357; color: #FFBF00;">{c, b}</span> 선택.
    {a, d} 남음.
    </li>
    <ul>
      <li>a <=> a를 스왑하여
      <span style="background: #4D5357; color: #FFBF00;">{c, b, a}</span> 선택.
      </li>
    </ul>
    <ul>
      <li>a <=> d를 스왑하여
      <span style="background: #4D5357; color: #FFBF00;">{c, b, d}</span> 선택.
      </li>
    </ul>
  </ul>
  <ul>
    <li>b <=> a를 스왑하여
    <span style="background: #4D5357; color: #FFBF00;">{c, a}</span> 선택.
    {b, d} 남음.
    </li>
    <ul>
      <li>b <=> b를 스왑하여
      <span style="background: #4D5357; color: #FFBF00;">{c, a, b}</span> 선택.
      </li>
    </ul>
    <ul>
      <li>b <=> d를 스왑하여
      <span style="background: #4D5357; color: #FFBF00;">{c, a, d}</span> 선택.
      </li>
    </ul>
  </ul>
  <ul>
    <li>b <=> d를 스왑하여
    <span style="background: #4D5357; color: #FFBF00;">{c, d}</span> 선택.
    {a, b} 남음.
    </li>
    <ul>
      <li>a <=> a를 스왑하여
      <span style="background: #4D5357; color: #FFBF00;">{c, d, a}</span> 선택.
      </li>
    </ul>
    <ul>
      <li>a <=> b를 스왑하여
      <span style="background: #4D5357; color: #FFBF00;">{c, d, b}</span> 선택.
      </li>
    </ul>
  </ul>
</ul>

<ul>
  <li>a <=> d를 스왑하여
  <span style="background: #4D5357; color: #FFBF00;">{d}</span> 선택.
  {b, c, a} 남음.
  </li>
  <ul>
    <li>b <=> b를 스왑하여
    <span style="background: #4D5357; color: #FFBF00;">{d, b}</span> 선택.
    {c, a} 남음.
    </li>
    <ul>
      <li>c <=> c를 스왑하여
      <span style="background: #4D5357; color: #FFBF00;">{d, b, c}</span> 선택.
      </li>
    </ul>
    <ul>
      <li>c <=> a를 스왑하여
      <span style="background: #4D5357; color: #FFBF00;">{d, b, a}</span> 선택.
      </li>
    </ul>
  </ul>
  <ul>
    <li>b <=> c를 스왑하여
    <span style="background: #4D5357; color: #FFBF00;">{d, c}</span> 선택.
    {b, a} 남음.
    </li>
    <ul>
      <li>b <=> b를 스왑하여
      <span style="background: #4D5357; color: #FFBF00;">{d, c, b}</span> 선택.
      </li>
    </ul>
    <ul>
      <li>a <=> a를 스왑하여
      <span style="background: #4D5357; color: #FFBF00;">{d, c, a}</span> 선택.
      </li>
    </ul>
  </ul>
  <ul>
    <li>b <=> a를 스왑하여
    <span style="background: #4D5357; color: #FFBF00;">{d, a}</span> 선택.
    {c, b} 남음.
    </li>
    <ul>
      <li>c <=> c를 스왑하여
      <span style="background: #4D5357; color: #FFBF00;">{d, a, c}</span> 선택.
      </li>
    </ul>
    <ul>
      <li>c <=> b를 스왑하여
      <span style="background: #4D5357; color: #FFBF00;">{d, a, b}</span> 선택.
      </li>
    </ul>
  </ul>
</ul>

이렇게 총 24가지의 경우의 수가 나온다.

## 소스코드
```js
function swap(array, a, b) {
    let temp = array[a];
    array[a] = array[b];
    array[b] = temp;
    return array;
}

function permutation(array, depth, n, r) {
    if (depth === r) {
        for (let i = 0; i < r; i++) {
            process.stdout.write(array[i].toString());
        }
        console.log("");
        return;
    }
    
    for (let i = depth; i < n; i++) {
        array = swap(array, depth, i); // 스왑
        permutation(array, depth + 1, n, r);
        array = swap(array, depth, i); // 되돌리기
    }
}

permutation(['a', 'b', 'c', 'd'], 0, 4, 3);
```

## 실행결과
```
abc
abd
acb
acd
adc
adb
bac
bad
bca
bcd
bdc
bda
cba
cbd
cab
cad
cda
cdb
dbc
dba
dcb
dca
dac
dab
```

## 이미지 출처 및 참고
[Permutation via Backtracking](https://medium.com/@guguru/permutation-algorithm-via-backtracking-39fc1bf07a33)  
[순열 구현하기](https://ansohxxn.github.io/algorithm/permutation/)  
[프로그래머스 소수 찾기 문제](https://school.programmers.co.kr/learn/courses/30/lessons/42839)  