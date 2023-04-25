---
title: "데이터베이스 관련 코드 개선"
date: 2023-03-25
update: 2023-04-25
tags:
  - development
  - mysql
  - promise
series: "Express 서버 프로젝트 리팩토링"
---

## 문제 상황
`Node.js` 환경에서 `MySQL` 이나 `mariaDB` 데이터베이스에 접근할 수 있는 클라이언트이자 `Promise` 기반의 기능을 지원하는 `mysql2`를 사용해서 직접 `SQL`문을 작성하는 방식으로 로직을 작성하고 있었다.

그런데 기존에 작성하던 방식에서 다음 문제를 발견했다.
> 1. 커넥션 객체를 받아오는 `getConnection()` 은 예외가 발생할 가능성이 있는 코드인데 `try` 문의 바깥에 작성하고 있었다.
> 2. 특정 함수에서 `SQL` 문을 여러 번 실행해야 하는 경우가 있는데, 실행 순서가 상관이 없는 경우에도 `async-await` 구문으로 무조건 요청을 대기하고 있었다. 이는 병렬 처리를 하는 편이 효율적이다.

### 문제 예시
```ts
// 교환글 수정
export const putTrade = async ({ trade, voucherId, amount, wantPhotocardIds }:
  { trade: TradeType; voucherId: number; amount: number; wantPhotocardIds: number[]; }
) => {
  const con = await db.getConnection();

  try {
    await con.beginTransaction();
    let sql;

    // 기존 소유권 상태를 available로 변경
    sql = `...`;
    await con.execute(sql);

    // 기존 wantPhotocard 모두 제거
    sql = `...`;
    await con.execute(sql);

    // 새로운 소유권 사용상태 변경
    sql = `...`;
    await con.execute(sql);

    // 교환글 수정
    sql = `...`;
    await con.execute(sql);

    // 교환글이 원하는 포토카드 정보 작성
    for (let photoId of wantPhotocardIds) {
      sql = `...`;
      await con.execute(sql);
    }
    
    con.commit();
  } catch (err) {
    con.rollback();
    throw err;
  } finally {
    con.release();
  }
}
```

## 해결 방법
1. 커넥션 객체를 초기에는 `undefined` 인 상태로 놓고 `try` 블록 안에서 커넥션 객체를 받아온다. `catch` 나 `finally` 에서는 ES2020 에서 등장한 `Optional Chaining` 연산자를 이용해서 커넥션 객체가 존재할 때에만 `rollback()`이나 `release()`를 실행하게 한다.
2. `SQL` 구문의 실행 순서가 중요하지 않은 경우에는 각 요청을 수행하는 `Promise` 객체를 만들어서 병렬로 처리하게 하고, `Promise.all()` 함수를 이용해서 모든 요청이 정상적으로 수행된 경우에 결과를 `commit()` 한다.

## 수정된 코드

```ts
import db from '@config/database';
import { PoolConnection } from 'mysql2/promise';
import { TradeDetail } from '@type/trade';

// 교환글 수정
export const putTrade = async ({ trade, voucherId, amount, wantPhotocardIds }:
  { trade: TradeType; voucherId: number; amount: number; wantPhotocardIds: number[]; }
) => {
  let con: PoolConnection | undefined;

  try {
    con = await db.getConnection();
    await con.beginTransaction();

    // 기존 소유권 상태를 available로 변경
    const updateExistingVoucher = new Promise((resolve, reject) => {
      if (!con) return reject(new Error('undefined db connection'));
      let sql = `...`;
      con.execute(sql).then(resolve).catch(reject);
    });

    // 새로운 소유권 사용상태 변경
    const updateNewVoucher = new Promise((resolve, reject) => {
      if (!con) return reject(new Error('undefined db connection'));
      let sql = `...`;
      con.execute(sql).then(resolve).catch(reject);
    });

    // 기존 wantPhotocard 모두 제거
    const deleteExistingWantcard = new Promise((resolve, reject) => {
      if (!con) return reject(new Error('undefined db connection'));
      let sql = `...`;
      con.execute(sql).then(resolve).catch(reject);
    });

    // 교환글 수정
    const updateTrade = new Promise((resolve, reject) => {
      if (!con) return reject(new Error('undefined db connection'));
      let sql = `...`;
      con.execute(sql).then(resolve).catch(reject);
    });

    // 교환글이 원하는 포토카드 정보 작성
    const insertWantcards = wantPhotocardIds.map(photocardId => (
      new Promise((resolve, reject) => {
        if (!con) return reject(new Error('undefined db connection'));
        let sql = `...`;
        con.execute(sql).then(resolve).catch(reject);
      })
    ));

    await Promise.all([
      updateExistingVoucher,
      updateNewVoucher,
      deleteExistingWantcard,
      updateTrade,
      ...insertWantcards
    ]);

    con.commit();
  } catch (err) {
    con?.rollback();
    throw err;
  } finally {
    con?.release();
  }
}
```