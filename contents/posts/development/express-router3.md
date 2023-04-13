---
title: "서비스 로직 비동기 병렬 처리"
date: 2023-03-24
update: 2023-03-24
tags:
  - development
  - express
  - promise
series: "Express를 사용한 프로젝트 코드 구조 리팩토링"
---

`Node.js` 기반의 사이드 프로젝트에서 `MySQL` 데이터베이스를 사용하게 해주는 모듈이자 Promise 기반의 API를 제공하는 `mysql2` 모듈을 사용했다.  
커넥션 풀에 미리 여러 커넥션을 생성해 놓고, 각 서비스 로직에서 필요할 때 커넥션을 받아와 사용하고 사용이 끝났으면 반환하는 방식을 사용했는데 기존에 작성했던 서비스 로직의 코딩 스타일에 몇 가지의 개선해야 할 점이 보여서 새롭게 개선하게 되었다.

## 기존 코드

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
    sql = `
    UPDATE Voucher
    SET state=${con.escape('available')}
    WHERE voucher_id=${con.escape(trade.voucherId)}`
    await con.execute(sql);

    // 기존 wantPhotocard 모두 제거
    sql = `DELETE FROM TradeWantcard WHERE trade_id=${trade.tradeId}`
    await con.execute(sql);

    // 새로운 소유권 사용상태 변경
    sql = `
    UPDATE Voucher
    SET state=${con.escape('trading')}
    WHERE voucher_id=${con.escape(voucherId)}`
    await con.execute(sql);

    // 교환글 수정
    sql = `
    UPDATE Trade
    SET voucher_id=${con.escape(voucherId)}
    WHERE trade_id=${con.escape(trade.tradeId)}`
    await con.execute(sql);

    // 교환글이 원하는 포토카드 정보 작성
    for (let photoId of wantPhotocardIds) {
      sql = `
      INSERT INTO TradeWantcard (trade_id, photocard_id)
      VALUES (${con.escape(trade.tradeId)}, ${con.escape(photoId)})`;
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

기존의 코드를 살펴 보면 다음과 같은 부분을 개선해 볼 수 있다.
> 1. 커넥션 객체를 `try` 블록의 외부에서 받아오고 있는데, 이 과정에서 에러가 발생할 가능성이 있으므로 `db.getConnection()`을 `try` 블록의 내부로 옮기는 편이 좋다.  
그런데 `catch` 블록과 `finally` 블록에서의 `con` 객체는 비어있기 때문에 ES2020부터 등장한 `Optional Chaining` 연산자를 활용해서 `rollback()`과 `release()`를 처리한다.
> 2. `con.execute()`를 여러번 실행하고 있는데 이 비동기 처리는 순서가 중요하지 않음에도 불구하고 `await`을 이용하여 다른 비동기 처리가 끝날때까지 비효율적으로 기다리게 된다.  
그래서 각자의 비동기 처리를 병렬적으로 하는 `Promise` 객체를 만들고, `Promise.all()` 를 사용해서 모든 비동기 처리가 끝날 때까지 기다리게 개선한다.

## 수정된 코드

```ts
import db from '@config/database';
import { PoolConnection } from 'mysql2/promise';
import { TradeDetail } from '@type/trade';

// 교환글 수정
export const updateTrade = async ({
  trade, 
  voucherId, 
  amount, 
  wantPhotocardIds
}: {
  trade: TradeDetail;
  voucherId: number;
  amount: number;
  wantPhotocardIds: number[];
}) => {
  let con: PoolConnection | undefined;

  try {
    con = await db.getConnection();
    await con.beginTransaction();

    // 기존 소유권 상태를 available로 변경
    const updateExistingVoucher = new Promise((resolve, reject) => {
      if (!con) return reject(new Error('undefined db connection'));

      let sql = `
      UPDATE Voucher
      SET
        state=${con.escape('available')}
      WHERE voucher_id=${con.escape(trade.voucherId)}`

      con.execute(sql).then(resolve).catch(reject);
    });

    // 새로운 소유권 사용상태 변경
    const updateNewVoucher = new Promise((resolve, reject) => {
      if (!con) return reject(new Error('undefined db connection'));

      let sql = `
      UPDATE Voucher
      SET
        state=${con.escape('trading')}
      WHERE voucher_id=${con.escape(voucherId)}`

      con.execute(sql).then(resolve).catch(reject);
    });

    // 기존 wantPhotocard 모두 제거
    const deleteExistingWantcard = new Promise((resolve, reject) => {
      if (!con) return reject(new Error('undefined db connection'));
      
      let sql = `
      DELETE FROM TradeWantcard
      WHERE trade_id=${trade.tradeId}`

      con.execute(sql).then(resolve).catch(reject);
    });

    // 교환글 수정
    const updateTrade = new Promise((resolve, reject) => {
      if (!con) return reject(new Error('undefined db connection'));

      let sql = `
      UPDATE Trade
      SET
        voucher_id=${con.escape(voucherId)},
        amount=${con.escape(amount)}
      WHERE trade_id=${con.escape(trade.tradeId)}`

      con.execute(sql).then(resolve).catch(reject);
    });

    // 교환글이 원하는 포토카드 정보 작성
    const insertWantcards = wantPhotocardIds.map(photocardId => (
      new Promise((resolve, reject) => {
        if (!con) return reject(new Error('undefined db connection'));

        let sql = `
        INSERT INTO TradeWantcard(
          trade_id,
          photocard_id
        ) VALUES (
          ${con.escape(trade.tradeId)},
          ${con.escape(photocardId)}
        )`;

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