---
title: "TypeScript로 타입을 지정하면서"
date: 2023-03-18
update: 2023-03-18
tags:
  - development
  - TypeScript
---

사이드 프로젝트를 진행하면서 TypeScript로 개발할 때 여러 타입에서 사용되는 공통 타입을 묶고, 세부 타입에서는 공통 타입의 일부 프로퍼티만 사용하고 싶은 경우에는 어떻게 해야 하는지 고민이 되었다.  

처음에는 방법을 잘 모르기도 했고 각각의 타입에서 공통 타입으로 적용될 프로퍼티들은 과연 어떤 것들이 될지를 잘 가늠하지 못했어서 세부 타입마다 공통적으로 들어가는 키를 중복적으로 작성했는데 이를 비효율적으로 느꼈기에 개선해보고자 했다.


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

위 타입을 보면 유사한 키가 반복적으로 들어가는 것을 볼 수 있는데 나는 이를 개선할 방법을 찾기로 했다.  
우선 맨 처음으로 유사한 속성을 가진 키를 하나의 타입으로 묶는 것이었다. 이렇게 기본적인 타입을 지정하는건 크게 어렵지 않았는데, 만약 **세부 타입에서 공통 타입의 키를 사용하기는 사용하는데, 전체가 아닌 일부만 사용한다면** 어떻게 해야할지를 고민했다. 이에 대한 해결방법은 <b style="color: red">**Pick<Type, Keys> 유틸리티 타입**</b>을 사용하는 것 이었다.  

```ts
interface ShippingRequestItem {
  payment: Pick<Payment, 'state' | 'amount'>;
}
```

사용 방법은 첫 번째 인자로 타입을 지정하고, 두 번째 인자로는 해당 타입에서 사용할 키만 Union 타입으로 묶어서 지정한다.
만약 여러 키를 가진 `Payment` 타입 중에서 `state` 키와 `amount` 키만 사용하고 싶다면 위와 같이 하면 된다.

## 공통 타입을 정리한 후
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
이 세부 타입들은 데이터베이스를 핸들링하는 서비스 로직에서도 사용되는데 `SELECT` 문으로 가져올 때 어떻게 객체 안에 있는 프로퍼티의 형태로 가져올 수 있는지도 고민이었다.  
이에 대한 해답은 `JSON_OBJECT()` 였다.  

`SELECT` 문에 사용하면 값을 JSON 객체 형태로 묶어서 조회할 수 있다.

```sql
SELECT
  JSON_OBJECT(
    'username', username,
    'nickname', nickname
  ) as author,
  user_id as userId
FROM User;
```

```json
  "author": {
      "nickname": "테스터",
      "username": "testman"
  },
  "userId": 2
```