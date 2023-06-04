---
title: "쿼리 키와 쿼리 함수"
date: 2023-05-06 01:00
update: 2022-05-06
tags:
  - react-query
series: "React Query"
---

## 쿼리 키
`react-query` 는 쿼리 키를 기반으로 쿼리 캐싱을 관리한다. 따라서 특정 쿼리 키를 가진 데이터를 가져와야 할 때 이미 캐싱된 데이터가 있다면 그 데이터를 가져와서 사용한다거나, 혹은 무효화해서 새롭게 가져오도록 한다거나 하는 동작이 가능하다.

`v4` 부터 쿼리 키는 배열로 작성해야 하는데, 배열의 내부에는 `string` 이 들어갈 수도 있고 `Nested Object` 가 들어갈 수도 있다.

### 같은 키와 다른 키
쿼리 키는 결정적으로 해싱이 되기 때문에 아래는 동일한 키로 인식한다:
```ts
useQuery({ queryKey: ['todos', { status, page }], ... })
useQuery({ queryKey: ['todos', { page, status }], ...})
useQuery({ queryKey: ['todos', { page, status, other: undefined }], ... })
```

하지만 아래는 동일한 키로 인식하지 않는데, 배열 요소에 나열되는 순서가 중요하다:
```ts
useQuery({ queryKey: ['todos', status, page], ... })
useQuery({ queryKey: ['todos', page, status], ...})
useQuery({ queryKey: ['todos', undefined, page, status], ...})
```

### 고유성
쿼리 키는 가져오는 데이터를 고유하게 설명해야 하기 때문에 쿼리 함수에서 어떠한 변수에 의존한다면 그 변수는 쿼리 키에도 포함되어야 한다:
```ts
function Todos({ todoId }) {
  const result = useQuery({
    queryKey: ['todos', todoId],
    queryFn: () => fetchTodoById(todoId),
  })
}
```

### 쿼리 키 무효화
쿼리 클라이언트의 `invalidateQueries()` 를 이용하면 특정 쿼리 키를 갖는 데이터를 무효화할 수 있다. 이 때 쿼리 키 배열의 앞 부분에 해당하는 모든 데이터에 대해서 무효화할 수 있다.

예를 들어서 아래와 같은 코드를 실행하면 `['todos']`, `['todos', 1]`, `['todos', 2]` 등의 쿼리 키를 가진 모든 데이터가 무효화된다.

```ts
queryClient.invalidateQueries({
  queryKey: ['todos']
});
```

## 쿼리 함수
쿼리 함수는 `useQuery` 나 `useInfiniteQuery` 에서 데이터를 가져오는 함수를 정의할 때 사용하는 것으로 API 요청 결과나 에러를 반환하는 `Promise` 를 반환한다.

### QueryFunctionContext
쿼리 함수의 인자로 `QueryFunctionContext` 를 전달받게 되는데, 내부에 다음 값을 포함한다:
- **queryKey**: 쿼리 키
- **pageParam**: `Intinite Query` 에서 사용되는 것으로, 현재 페이지 번호를 나타낸다.
- **signal**: `Query Cancellation` 과 관련된 변수라고 하는데, 사용해 본 적은 없다.
- **meta**: 쿼리에 대한 자세한 추가 정보를 채울 수 있는 선택적 변수라고 하는데, 사용해 본 적은 없다.

## 쿼리 상태
### status
`status` 는 쿼리의 데이터가 있는지, 없는지, 혹은 오류가 발생했는지의 여부를 나타낸다.

- `loading`: 쿼리에 대한 데이터가 아직 없는 상태로, `isLoading` 로도 알 수 있다.
- `error`: 쿼리의 결과로 오류를 받은 상태로, `isError` 로도 알 수 있다.
- `success`: 쿼리가 성공적이고 데이터를 사용할 수 있는 상태로, `isSuccess` 로도 알 수 있다.

### fetchStatus
`fetchStatus` 는 실제로 서버에 대한 요청이 일어나고 있는지 아닌지의 여부를 나타낸다.

- `fetching`: 데이터가 실제로 패칭이 일어나는 상태이다. `isFetching` 로도 알 수 있다.
- `paused`: 쿼리의 패칭을 하고 싶지만, 그렇지 못하고 중단된 상태이다. `isPaused` 로도 알 수 있다.
- `idle`: 쿼리가 해당 시점에 아무 것도 안하고 있는 상태이다. 

### 왜 두 가지의 다른 상태가 존재하나?
- 쿼리의 데이터는 이미 존재하는 `success` 상태이지만, 캐싱된 데이터가 오래된 `stale` 데이터이기 때문에 새로운 `fresh` 데이터를 패칭해야 할 수 있다. 이런 경우에는 `status === success` 이면서 `fetchStatus === fetching` 일 수 있다.
- 쿼리가 처음 마운트되어서 아직 데이터가 없기 때문에 `loading` 상태이지만, 실제로 서버에 요청하고 있는지의 여부는 다를 수 있다.

즉, `status` 는 `data` 가 사용 가능한 상태인지의 여부를 나타내고 `fetchStatus` 는 현재 `queryFn` 이 동작하고 있는지의 여부를 나타낸다.

### 추가적인 상태
- `isInitialLoading`: 캐시된 데이터가 없는 상태에서 서버에 데이터를 요청하는 상태로, `isFetching && isLoading` 과 동일하다.
- `isRefetching`: 캐시된 데이터가 있는 상태에서 서버에 데이터를 요청하는 상태로, `isFetching && !isLoading` 과 동일하다.

## 참고 자료
[Query Key](https://tanstack.com/query/latest/docs/react/guides/query-keys)  
[Queries](https://tanstack.com/query/latest/docs/react/guides/queries#why-two-different-states)  