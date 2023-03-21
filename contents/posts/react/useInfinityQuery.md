---
title: "useInfinityQuery로 무한스크롤 만들기"
date: 2022-08-04
update: 2022-08-04
tags:
  - react
  - react-query
---

## useQuery와 useInfinityQuery의 차이점
react-query를 사용해서 서버로부터 가져온 데이터를 관리할 때 가장 흔하게 <span style="color:blue">useQuery</span>가 사용된다.  
그런데 <span style="color:blue">useQuery</span> 같은 경우에는 고유한 query-key에 해당하는 데이터가 만료되면 새로운 데이터를 패칭해서 기존의 데이터를 덮어버리는 방식이기에 무한 스크롤 기능처럼 기존의 데이터는 그대로 두고 새로운 데이터를 가져와야 할 때 사용하기에는 어려움이 있는데 이런 경우에 <span style="color:red">useInfinityQuery</span>를 사용하면 좋다.  
<span style="color:red">useInfinityQuery</span>의 결과에 담긴 `data`는 useQuery와 다르게 `data.pages`와 `data.pageParams`가 존재하는데, 다음 페이지나 이전 페이지의 데이터를 가져오면 기존의 `data.pages`에 새로운 데이터가 맨 앞이나 맨 뒤에 덧붙혀지는 방식으로 작동한다.

## 기본 형태
```ts
const {
  fetchNextPage,
  fetchPreviousPage,
  hasNextPage,
  hasPreviousPage,
  isFetchingNextPage,
  isFetchingPreviousPage,
  ...result
} = useInfiniteQuery(queryKey, ({ pageParam = 1 }) => fetchPage(pageParam), {
  ...options,
  getNextPageParam: (lastPage, allPages) => lastPage.nextCursor,
  getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor,
})
```
### 옵션
#### <span style="color:orange">queryKey</span>: unknown[]
- 가져온 데이터를 인식할 고유한 키이다.

#### <span style="color:orange">queryFn</span>: (context: QueryFunctionContext) => Promise<TData>
- 데이터를 가져오는 Promise 함수로, useInfinityQuery의 두 번째 인자로 부여한다.
- 매개변수 context 객체가 갖고 있는 `pageParam`은 서버에 요청할 때 어떤 페이지의 데이터를 가져올 지 표현할 수 있으며 시작 페이지를 줄 수 있다.

#### <span style="color:orange">getNextPageParam</span>: (lastPage, allPages) => unknown | undefined
- pageParam을 다음 페이지의 값으로 변경하는 함수로, useInfinityQuery의 세 번째 인자로 부여한다.
- 현재 페이지를 기준으로 다음 페이지의 `pageParam` 값을 반환하면 된다.
- 다음 페이지가 없다면 `undefined` 를 반환하면 된다.

#### <span style="color:orange">getPreviousPageParam</span>: (firstPage, allPages) => unknown | undefined
- pageParam을 이전 페이지의 값으로 변경하는 함수로, useInfinityQuery의 세 번째 인자로 부여한다.
- 현재 페이지를 기준으로 이전 페이지의 `pageParam` 값을 반환하면 된다.
- 이전 페이지가 없다면 `undefined` 를 반환하면 된다.
  
### 반환되는 값
#### <span style="color:orange">data.pages</span>: TData[]
- 각 페이지 별 데이터 내용이 들어있다.

#### <span style="color:orange">data.pageParams</span>: unknown[]
- 각 페이지 별 `pageParam` 값이 들어있다

#### <span style="color:orange">fetchNextPage</span>: (options?: FetchNextPageOptions) => Promise<UseInfiniteQueryResult>
- 다음 페이지 내용을 가져오는 함수이다.

#### <span style="color:orange">fetchPreviousPage</span>: (options?: FetchPreviousPageOptions) => Promise<UseInfiniteQueryResult>
- 이전 페이지 내용을 가져오는 함수이다.

#### <span style="color:orange">isFetchingNextPage</span>: boolean
- 다음 페이지 내용을 가져오는 중인지의 여부이다.

#### <span style="color:orange">isFetchingPreviousPage</span>: boolean
- 이전 페이지 내용을 가져오는 중인지의 여부이다.

#### <span style="color:orange">hasNextPage</span>: boolean
- 다음 페이지가 있는지의 여부를 나타낸다.

#### <span style="color:orange">hasPreviousPage</span>: boolean
- 이전 페이지가 있는지의 여부를 나타낸다.


## 소스코드 예시
```ts
import React, { Fragment, useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useInView } from 'react-intersection-observer';
import { AxiosError } from 'axios';
import PhotoCard from './PhotoCard';
import SkeletonPhotoCard from './SkeletonPhotoCard';

interface PhotoListProps {
  children?: React.ReactNode;
}
const PhotoListDefaultProps = {};

const fetchData = (limit: number, pageParam: number) => {
  const url = `/api/photo`;
  const params = { limit, pageParam }
  const res = await client.get(url, { params });
  return res.data;
}

function PhotoList({ children }: PhotoListProps & typeof PhotoListDefaultProps) {
  const limit = 20; // 한 페이지에 보여줄 아이템 갯수
  const [viewRef, inView] = useInView();

  // 데이터 가져오기
  const { data: photos, error, isFetching, fetchNextPage, hasNextPage } = 
  useInfiniteQuery(['photos'], ({ pageParam = 0 }) => fetchData(limit, pageParam),
  {
    getNextPageParam: (lastPage, pages) => {
      return lastPage?.photos.length === limit && lastPage.pageParam + limit;
    }
  });

  // 다음 페이지 가져오기
  useEffect(() => {
    if (!inView) return;
    if (!photos) return;
    if (!hasNextPage) return;

    fetchNextPage();
    console.log(inView);
  }, [inView]);

  return (
    <>
      <section className="photo-section">
        {photos?.pages.map((page, pageIdx) => 
          <Fragment key={pageIdx}>
            {page?.photos.map((item) => (
              <PhotoCard key={item.photocard_id} photo={item} />
            ))}
          </Fragment>
        )}

        {isFetching && Array.from({length: limit}).map((_, idx) => (
          <SkeletonPhotoCard key={idx} />
        ))}
      </section>
      
      <div ref={viewRef} />
    </>
  );
}

PhotoList.defaultProps = PhotoListDefaultProps;
export default PhotoList;
```