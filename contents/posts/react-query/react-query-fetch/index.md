---
title: "서버의 데이터 가져오기"
date: 2023-05-07
update: 2022-05-07
tags:
  - react-query
series: "React Query"
---

서버의 데이터를 가져오는 경우에는 `useQuery`, `useQueries`, `useInfiniteQuery` 를 사용한다.

## useQuery
```ts
export function useQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'initialData'
  > & { initialData?: () => undefined },
): UseQueryResult<TData, TError>
```
하나의 `queryKey` 에 해당하는 단일 데이터를 서버에 요청할 때 사용한다.

### 예제 코드
```ts
interface IPost {
  id: number;
  userId: number;
  title: string;
  body: string;
}

const fetchPost = (postId: number) => {
  return axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`).then(res => res.data);
};

function Post() {
  const [postId, setPostId] = useState(1);

  const postQuery = useQuery<IPost, AxiosError>({
    queryKey: ['post', postId],
    queryFn: () => fetchPost(postId)
  });
}
```

### 파라미터
#### queryKey
패칭한 데이터를 캐싱하는 데 사용하는 고유한 키이다. 쿼리 키가 변화하면 `useQuery` 는 해당 쿼리 키에 대한 데이터를 새롭게 반영한다.

#### queryFn
데이터를 패칭할 때 동작하는 함수이다. 보통은 서버에게 비동기 API 요청을 하는 코드를 작성한다.

#### enabled
`useQuery` 의 옵션으로 줄 수 있는 `boolean` 타입의 속성으로, 기본 값은 `true` 이다. 이 값이 `false` 이면 `useQuery` 선언을 만나도 API 요청이 자동으로 발생하지 않는다.   

특정 쿼리가 실행되기 전에 다른 쿼리부터 수행해야 한다거나, 혹은 준비가 된 상태에서만 쿼리를 실행해야 하는 경우에 유용한 옵션이다.

#### keepPrevious
`useQuery` 의 옵션으로 줄 수 있는 `boolean` 타입의 속성으로, 기본 값은 `false` 이다.  

- `false`: 기존에 캐싱된 데이터가 있는 상태에서 `queryKey` 가 변경되어 새로운 데이터를 패치하게 되면, 기존의 `data` 는 `undefined` 가 되고 `status` 는 `loading` 상태가 된다.
- `true`: 기존에 캐싱된 데이터가 있는 상태에서 `queryKey` 가 변경되어 새로운 데이터를 패치하게 되면, 패칭하는 동안에 기존의 `data` 를 그대로 사용하며 `status` 는 그대로 `success` 상태이다.

새로운 데이터를 받는 동안에 아무런 데이터가 없다면 `status` 가 `loading` 과 `success` 를 오고 가면서 **UI가 깜빡 거리는 현상**이 발생할 수 있는데 이를 방지하고 싶을 때 유용한 옵션이다.

`UseQueryResult` 의 `isPreviousData` 로 이전의 데이터인지의 여부를 확인할 수 있다.

#### placeholderData
`useQuery` 의 옵션으로 줄 수 있는 `TData` 타입의 속성으로, 쿼리가 `loading` 상태일 때 임시로 보여줄 데이터이다.

#### initialData
`useQuery` 의 옵션으로 줄 수 있는 `TData` 타입의 속성으로, 쿼리 결과의 기본 값을 지정한다.

#### placeholderData와 initialData의 차이점
- `placeholderData`: **데이터가 캐시에 저장되지 않고**, 단순히 로딩 상태에 보여주기 위한 데이터이다. 그래서 `useQuery` 선언을 만났을 때 `staleTime` 이 존재해도 기존의 데이터가 없기 때문에 반드시 데이터 패칭이 발생한다.
- `initialData`: **데이터가 캐시에 저장**된다. 따라서 `useQuery` 선언을 만났을 때 `staleTime` 이 존재한다면 기존의 데이터 `initialData` 가 `fresh` 인 상태이기 때문에 패칭이 발생하지 않는다.

#### select
`useQuery` 의 옵션으로 줄 수 있는 `TData` 타입의 속성으로, 서버로부터 받은 데이터를 변환하거나 일부만 추출하는 등의 전처리를 해서 `UseQueryResult` 의 `data` 로 저장되는 값을 설정할 수 있다. 단, 실제 캐싱되는 데이터 자체는 변하지 않는다.  

`TypeScript` 를 사용하는 경우에는 `useQuery` 제네릭의 세 번째 변수에 실제 `data` 로 저장되는 값의 타입을 지정해줘야 한다.
```ts
function Post() {
  const [postId, setPostId] = useState(1);

  const postQuery = useQuery<IPost, AxiosError, Pick<IPost, 'id' | 'title'>>({
    queryKey: ['post', postId],
    queryFn: () => fetchPost(postId),
    select: res => ({
      id: res.id,
      title: res.title,
    })
  });
}
```

### 프리패칭
이후에 패칭이 발생할 가능성이 높은 데이터에 대해서는 백그라운드에서 미리 받아놓는 편이 사용자 경험에 유리하다. `react-query` 에서는 이러한 프리패칭 기능을 제공하는데 `QueryClient` 객체의 `prefetchQuery()` 를 사용하면 된다.

#### 예제 코드
```ts
function Post() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const nextPostId = postId + 1;
    queryClient.prefetchQuery({
      queryKey: ['post', nextPostId],
      queryFn: () => fetchPost(nextPostId),
    });
  }, [postId, queryClient]);
}
```

## useQueries
`useQuery` 는 선언하면 자체적으로 병렬적으로 쿼리를 수행하지만, 수행하는 쿼리가 동적인 상황에 따라 달라진다면 일일히 `useQuery` 를 선언하는 방법이 불가능하다. 이런 경우에는 `useQueries` 를 사용할 수 있다.

```ts
function Post() {
  const postIds = [20, 25, 28, 30];
  const postsQueries = useQueries({
    queries: postIds.map<UseQueryOptions<IPost, AxiosError>>(id => ({
      queryKey: ['post', id],
      queryFn: () => fetchPost(id),
    })),
  });
}
```

`useQueries` 의 결과는 `UseQueryResult` 의 배열 형태이다.

## useInfiniteQuery
```ts
export function useInfiniteQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseInfiniteQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryFnData,
    TQueryKey
  >,
): UseInfiniteQueryResult<TData, TError>
```
`useInfiniteQuery` 는 무한 스크롤 기능처럼 **기존의 데이터가 있는 상태에 새로운 데이터를 추가적으로 보여줘야** 하는 경우에 사용한다.

### 파라미터
- `queryKey`: 캐싱에 사용할 고유한 쿼리 키
- `queryFn`: 실제 비동기 API 요청이 일어나는 함수
- `getNextPageParam(lastPage)`: 다음 페이지의 `pageParam` 을 반환하는 함수. `undefined` 라면 다음 페이지가 없다고 간주한다.
- `getPreviousPageParam(firstPage)`: 이전 페이지의 `pageParam` 을 반환하는 함수. `undefined` 라면 이전 페이지가 없다고 간주한다.

### 반환 값
#### data
`useInfiniteQuery` 가 반환하는 값 `data` 는 `pages` 배열과 `pageParams` 배열을 프로퍼티로 가진 객체이다. 
- `pageParams`: 각 페이지마다 `queryFn` 함수에 전달되는 `pageParams` 값을 의미한다.  
- `pages`: 각 페이지마다 가지고 있는 `pageParams` 로 `queryFn` 을 수행한 결과 데이터를 의미한다.

#### fetchNextPage
다음 페이지를 패칭하는 함수이다. `isFetchingNextPage` 변수로 패칭이 일어나고 있는지의 여부를 알 수 있다.

#### fetchPreviousPage
이전 페이지를 패칭하는 함수이다. `isFetchingPreviousPage` 변수로 패칭이 일어나고 있는지의 여부를 알 수 있다.

### 예제 코드
```tsx
function InfinitePost() {
  const postQueries = useInfiniteQuery<IPost>({
    queryKey: ['post'],
    queryFn: ({ pageParam = 10 }) => fetchPost(pageParam),
    getNextPageParam: lastPage => (lastPage.id < 100 ? lastPage.id + 1 : undefined),
    getPreviousPageParam: firstPage => (firstPage.id > 1 ? firstPage.id - 1 : undefined),
  });

  const { 
    data,
    fetchNextPage,
    fetchPreviousPage,
    status,
    fetchStatus,
    isFetchingNextPage,
    isFetchingPreviousPage
  } = postQueries;

  const queryClient = useQueryClient();

  return (
    <div>
      <Link to="/post">to post</Link>
      <p>status: {status}</p>
      <p>fetchStatus: {fetchStatus}</p>
      <hr />
      {isFetchingPreviousPage && <span>Previous Page 패칭중...</span>}
      {status === 'success' && data.pages.map(post => <PostContent key={post.id} post={post} />)}
      {isFetchingNextPage && <span>Next Page 패칭중...</span>}
      <hr />
      <button onClick={() => fetchPreviousPage()}>Previous</button>
      <button onClick={() => fetchNextPage()}>Next</button>
    </div>
  );
}
```

## 참고 자료
[Query Functions](https://tanstack.com/query/v4/docs/react/guides/query-functions)  
[useQuery](https://tanstack.com/query/v4/docs/react/reference/useQuery)  
[Infinite Queries](https://tanstack.com/query/v4/docs/react/guides/infinite-queries)  