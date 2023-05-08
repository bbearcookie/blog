---
title: "Tanstack Query(React Query)"
date: 2023-05-06
update: 2022-05-06
tags:
  - react-query
series: "React Query"
---

`react-query` 는 선언적인 방식으로 서버의 상태를 클라이언트로 **가져오고, 캐싱하고, 동기화하고, 업데이트** 할 수 있는 라이브러리이다.  

## 등장 배경
서버 상태는 다음과 같은 특성을 갖는다:
- 실제 데이터가 통제할 수 없는 **원격 위치에 존재**한다.
- 데이터를 패칭하고 업데이트하는데 **비동기적인 API를 필요**로 한다.
- 실제 데이터가 다른 사람에 의해 **변경될 수** 있다.
- 데이터를 **적절한 시기에 새롭게** 가져오지 않는다면 오래된 구식 데이터가 될 수 있다.

이러한 특성을 고려하여 서버 상태를 다루기 위해서는 다음과 같은 문제를 고려해야 한다:
- 캐싱
- 동일한 데이터에 대한 여러 요청을 단일 요청으로 **중복 제거**
- 오래된 데이터를 백그라운드에서 **주기적으로 업데이트**
- 오래된 데이터가 되는 시점 알기
- 데이터의 업데이트를 가능한 **신속하게 반영**하기
- `pagination` 과 `lazy loading` 에 대한 **성능 최적화**
- 메모리 관리 및 서버 상태에 대한 `garbage collection`
- 메모이제이션된 쿼리의 결과를 구조적으로 **공유**하기

이런 문제들을 고려하면서 서버 상태를 다루기엔 어렵기 때문에 `react-query` 가 등장했다.  

`react-query` 를 사용하면 다음과 같은 장점이 있다:
- 복잡하고 이해하기 힘든 긴 코드를 **몇 줄의 로직**으로 바꿀 수 있다.
- 새 서버 상태 데이터 소스 연결에 대한 걱정 없이 애플리케이션을 **유지 관리**하기 쉽고 **새 기능**을 쉽게 구축할 수 있다.
- 애플리케이션의 사용자에게 **더 빠르고 응답성이 높다**는 강력한 인상을 줄 수 있다.
- 잠재적으로 **대역폭을 절약**하고 **메모리 성능**을 높인다.

## 중요한 기본 정보
### stale
기본적으로 `useQuery` 나 `useInfiniteQuery` 를 통한 쿼리 인스턴스는 캐시된 데이터를 **오래된`(stale)` 것으로 간주**한다. 이는 `staleTime` 값을 변경해서 언제까지 데이터를 최신 상태로 간주할 것인지를 변경할 수 있다.

오래된 쿼리는 다음과 같은 경우에 백그라운드에서 자동으로 가져온다:
- 새로운 쿼리 인스턴스가 `mount` 될 때 `(refetchOnMount)`
- 창 화면이 포커싱될 때 `(refetchOnWindowFocus)`
- 네트워크가 재연결될 때 `(refetchOnReconnect)`

### inactive
`useQuery` 나 `useInfiniteQuery` 로 가져온 쿼리 결과가 활성화 되지 않은 상태에는 `inactive` 상태가 되고 나중에 다시 사용될 가능성을 대비해서 캐시에 보관한다. 기본적으로 `inactive` 상태는 5분동안 지속되는데 이는 `cacheTime` 값을 변경하면 바꿀 수 있다.

### retry
쿼리가 실패하면 기본적으로 딜레이를 갖고 3회까지 재시도 하는데 이는 `retryDelay` 와 `retry` 값을 변경해서 바꿀 수 있다.

## 상태 흐름
![쿼리 결과 상태 흐름](./react-query-state.jpg)

`react-query` 에서의 쿼리 결과는 5가지의 상태 중 하나를 가진다.
- <span style="color: #006BFF">**Fetching**</span>: 초기 상태이며 일반적으로 외부에서 **데이터를 가져오고 있는 상태**이다.
- <span style="color: #00AB52">**Fresh**</span>: 클라이언트와 서버 모두 동일한 데이터를 가지고 있는 가장 **이상적인 상태**이다. 하지만 대부분의 경우 서버의 데이터가 금방 바뀔 수 있으므로 `Fresh` 상태는 아주 짧은 시간동안 지속된다.
- <span style="color: #FFB200">**Stale**</span>: 데이터가 오래되었으므로 **새롭게 정보를 가져와야 하는 상태**이다. 기본적으로 `Fresh` 상태인 데이터는 설정된 `staleTime` 만큼 지나게 되면 `Stale` 상태로 변하는데 `staleTime` 의 기본 값은 `0` 이다.
- <span style="color: #3F4E60">**Inactive**</span>: 쿼리 결과를 활성화한 `useQuery` 나 `useInfiniteQuery` 객체가 없기 때문에 **현재 사용되지 않는 상태**이다. 이후에 데이터가 다시 사용되면 캐싱했던 기존의 데이터를 활용한다. 만약 `cacheTime` 만큼의 시간이 지나도 사용되지 않는다면 소멸한다.
- <span style="color: #3F4E60">**Deleted**</span>: `Inactive` 상태의 쿼리 결과가 `cacheTime` 만큼이 지나서 **소멸한 상태**이다.


## 참고 자료
[Tanstack Query Overview](https://tanstack.com/query/latest/docs/react/overview)  
[Tanstack Query Important Defaults](https://tanstack.com/query/latest/docs/react/guides/important-defaults)  
[React Query and Management of Server State](https://www.rootstrap.com/blog/react-query-and-management-of-server-state)  