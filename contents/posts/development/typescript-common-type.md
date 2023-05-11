---
title: "TypeScript로 타입을 지정하면서"
date: 2023-03-18
update: 2023-03-18
tags:
  - development
  - TypeScript
---

## 프로퍼티의 중복

`TypeScript`로 개발한 사이드 프로젝트에서 각 타입의 세부 프로퍼티를 일일이 입력하는 방식으로 타입을 정해줬었다.  

이렇게 하니 여러 타입마다 중복되는 프로퍼티가 많이 발생했기 때문에 여러 타입에서 공통적으로 사용되는 프로퍼티를 하나의 **공통 타입**으로 묶고, 다른 타입에서는 해당 공통 타입을 <b style="color: red">**가져와 사용하는 방식**</b>으로 개선해 보자는 생각을 하게 되었다.


## 공통 타입을 정리하기 전
```ts
export interface TradeType {
  tradeId: number;
  userId: number;
  voucherId: number;
  state: TradeStateType;
  amount: number;
  writtenTime: string;
  tradedTime: string;
  photocardId: number;
  memberId: number;
  photoName: string;
  memberName: string;
  groupName: string;
  imageName: string;
}

export interface WantcardType {
  photocardId: number;
  memberId: number;
  groupId: number;
  photoName: string;
  memberName: string;
  groupName: string;
  imageName: string;
}

export interface TradeListItemType extends TradeType {
  wantMembers: {
    memberId: number;
    name: string;
  }[];
}

export interface TradeHistoryType {
  logId: number;
  voucherId: number;
  photocardId: number;
  photoImageName: string;
  photoName: string;
  memberName: string;
  groupName: string;
  originUserId: number;
  originUserName: string;
  originUserNickname: string;
  originUserImageName: string;
  destUserId: number;
  destUserName: string;
  destUserNickname: string;
  destUserImageName: string;
  loggedTime: string;
}
```

위 타입을 보면 유사한 프로퍼티가 반복적으로 들어가고 있다.    

이를 개선하기 위해 가장 첫 번째로 해야할 것은 **유사한 속성을 가진 키를 하나의 공통 타입으로 묶는 것**이었다.

## 공통 타입 정의
```ts
// 사용자 타입
export interface User {
  userId: number;
  username: string;
  nickname: string;
  imageName: string;
}

// 배송 주소 타입
export interface Address {
  addressId: number;
  userId: number;
  name: string;
  recipient: string;
  contact: string;
  postcode: string;
  address: string;
  addressDetail: string;
  requirement: string;
  prime: number;
}

// 결제 타입
export interface Payment {
  paymentId: number;
  merchantUID: string;
  impUID: string;
  amount: number;
  state: PaymentState;
}

// 배송 요청 타입
export interface ShippingRequest {
  requestId: number;
  state: RequestState;
  writtenTime: string;
}
```

이제 위 공통 타입에서 필요한 프로퍼티를 세부 타입에서 가져와 사용하면 된다.  

그런데 문제점이 있었는데 만약 **세부 타입에서 공통 타입의 프로퍼티를 사용하기는 사용하는데, 전체가 아닌 일부만 사용하는 경우라면** 어떻게 해야하는지가 고민되었다.

찾아보니 `TypeScript`에는 `유틸리티 타입`이라고 하는 것이 있었고, 이런 상황에는 <b style="color: red">**Pick<Type, Keys> 유틸리티 타입**</b>을 이용할 수 있었다.

### Pick<Type, Keys>
```ts
interface ShippingRequestItem {
  payment: Pick<Payment, 'state' | 'amount'>;
}
```

위 예시는 `Payment` 타입 중에서 `state`와 `amount` 프로퍼티만 사용하는 경우이다.

`Pick` 유틸리티 타입의 사용 방법은, **첫 번째 인자**로 *타입*을 주고, **두 번째 인자**로 *사용할 프로퍼티를 Union 타입으로 묶은 값*을 주면 된다.

> 더 많은 유틸리티 타입에 대한 포스트는 [여기](/typescript-utility-type)

## 공통 타입을 정리한 후
```ts
// 배송 요청 상세 타입
export interface ShippingRequestDetail extends ShippingRequest {
  address: Pick<Address, 'recipient' | 'contact' | 'postcode' | 'address' | 'addressDetail' | 'requirement'>;
  payment: Payment;
  author: User;
}

// 배송 요청 목록 아이템 타입
export interface ShippingRequestItem extends ShippingRequest {
  address: Pick<Address, 'recipient' | 'contact' | 'postcode' | 'address' | 'addressDetail' | 'requirement'>;
  payment: Pick<Payment, 'state'>;
  author: User;
  voucherAmount: number;
}
```

이렇게 공통 타입 `ShippingRequest`를 상속하고, 각각의 세부 키를 갖는 `ShippingRequestDetail` 과 `ShippingRequestItem` 같은 세부 타입을 작성했다.  

이 세부 타입들은 데이터베이스를 핸들링하는 서비스 로직에서도 사용되는데, `SELECT` 문으로 가져올 때 데이터를 **어떻게 객체 형태로 가져올 수 있는지**도 고민이었다.

이에 대한 해답은 `JSON_OBJECT()` 였다.  

`SELECT` 문에 사용하면 값을 JSON 객체 형태로 묶어서 조회할 수 있다.

### SELECT 문 예시

```sql
SELECT
  JSON_OBJECT(
    'username', username,
    'nickname', nickname
  ) as author,
  user_id as userId
FROM User;
```

### 실행 결과

```json
  "author": {
      "nickname": "테스터",
      "username": "testman"
  },
  "userId": 2
```