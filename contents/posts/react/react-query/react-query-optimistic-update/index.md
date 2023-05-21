---
title: "낙관적 업데이트(Optimistic Update)"
date: 2023-05-08
update: 2022-05-08
tags:
  - react-query
series: "React Query"
---

서버가 응답하는 결과를 클라이언트에서도 미리 예측이 가능한 경우에는 응답을 받기까지 기다리는 시간이 사용자 입장에서 답답하다고 느껴질 수 있다. 이럴 때 서버로 보낸 요청이 당연히 성공할거라는 낙관적인 생각을 가지고 **변경 사항을 미리 반영하는 방법**을 사용할 수 있는데 이를 <b style="color: red">**낙관적 업데이트(Optimistic Update)**</b>라 한다.

예를 들어서 게시글의 좋아요 기능이나 댓글 작성 기능은 클라이언트에서도 결과가 충분히 예측 가능하기 때문에 낙관적 업데이트를 적용하기에 좋은 기능이다.

## 구현 방법
`react-query` 에서 낙관적 업데이트를 구현하기 위해서는 `useMutation` 을 사용하는데 `mutate()` => `onMutate()` => `onError()` => `onSettled()` 의 실행 흐름에서 각 콜백마다 구현해야 할 내용은 다음과 같다:

- `onMutate`: 현재 캐싱되어 있는 데이터를 다음 콜백 함수에게 넘겨주고, 새로운 데이터를 캐싱한다.  
중요한 점은 다른 곳에서 해당 쿼리에 대해서 리패칭을 하고 있는 경우에는 낙관적 업데이트로 미리 반영했던 데이터가 다시 없었던 시기로 덮어씌워질 수 있기 때문에 해당 쿼리 키와 관련해서 일어나고 있는 쿼리를 모두 중단해야한다.
- `onError`: 캐싱된 새로운 데이터를 `onMutate` 로부터 전달받은 `context` 객체로 롤백한다.
- `onSettled`: 요청이 완전히 끝난 상태에 데이터가 서버와 일치함을 보장하기 위해서 쿼리를 `invalidate` 한다.

## 장점과 단점
- **장점**: 캐시가 빠르게 업데이트 되기 때문에 사용자 경험이 좋아진다.
- **단점**: 요청이 실패했을 때 롤백해야 하는 로직을 따로 구현해야 하기 때문에 코드가 복잡해진다.

## 예제 코드
```tsx
interface IPost {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export const putPost = (post: IPost) => {
  return axios.put(`https://jsonplaceholder.typicode.com/posts/${post.id}`, post);
};

function PostWriter() {
  const [id, setId] = useState(101);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const queryClient = useQueryClient();

  const putMutation = useMutation<AxiosResponse<IPost>, AxiosError, IPost, IPost>({
    mutationFn: putPost,
    onMutate: async post => {
      await queryClient.cancelQueries(['post']);

      const previous = queryClient.getQueryData<IPost>(['post', post.id]);
      queryClient.setQueryData<IPost>(['post', post.id], post);
      return { id: post.id, ...previous } as IPost;
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData<IPost>(['post', context?.id], context);
    },
    onSettled: (res, err, variables, context) => {
      queryClient.invalidateQueries(['post']);
    },
  });

  const handleSubmit = useCallback(() => {
    setTitle('');
    setBody('');

    putMutation.mutate({ userId: 55, id, title, body });
  }, [putMutation, title, body, id]);

  return (
    <>
      <input type="number" value={id} placeholder="ID" onChange={e => setId(Number(e.target.value))} />
      <input type="text" value={title} placeholder="제목" onChange={e => setTitle(e.target.value)} />
      <input type="text" value={body} placeholder="내용" onChange={e => setBody(e.target.value)} />
      <button onClick={handleSubmit}>추가</button>
      <hr />
    </>
  );
}
```

## 참고 자료
[Optimistic Updates](https://tanstack.com/query/v4/docs/react/guides/optimistic-updates)  
[react-query optimistic update시 데이터 꼬임 방지](https://velog.io/@mskwon/react-query-cancel-queries)  