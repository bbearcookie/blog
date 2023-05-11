---
title: "Express.js 라우터 기능의 오작동"
date: 2023-03-12
update: 2023-04-25
tags:
  - development
  - express
series: "Express 서버 프로젝트 리팩토링"
---

## 문제 상황
독립적인 기능을 담당하는 컨트롤러 로직을 다른 파일로 분할하고, `express`의 라우터 기능을 이용해서 `URI`마다 담당하는 로직을 매칭해 줬는데 의도한 대로 동작하지 않았다.

예를 들어 `/photo` 경로에 대한 라우터와 `/voucher` 경로에 대한 라우터를 지정하고, 각각 `router.get('/')` 으로 컨트롤러 로직을 등록했는데 `/photo` 에 요청해도 `/voucher`에 요청해도 똑같은 컨트롤러의 로직만 실행되는 것이었다.

## 원인
원인은 `express.Router()` 객체를 참조한 것을 <b style="color: red">**각 파일에서 공유해서 사용했기 때문**</b>이었다.

`Node.js`로 API 서버를 개발할 때 설정해야 하는 부분이 `express` 외에도 여러 부분이 있기에 나는 프로그램의 시작 포인트인 `app.js`가 아니라 `@config/express.js` 파일을 따로 만들어서 설정 코드를 작성하는 것을 선호한다.

그래서 `@config/express.js` 파일에서 `app` 객체를 생성하고 관련 설정을 한 뒤, `app.js` 같은 곳에서 사용할 수 있도록 내보냈는데 이 과정에서 `express.Router()` 객체도 같은 방법으로 내보내서 사용했기 때문에 문제가 생겼던 것이었다.

## 해결 방법
`express.Router()` 객체를 생성한 것을 공유해서 사용하지 말고, 각 라우터 모듈에서 새롭게 생성해서 사용해야 한다.

## 예시
```
src
├── config
│   ├── express.js
│   ├── router.js
├── router
│   ├── photo.js
│   ├── voucher.js
├── app.js
```

### app.js
```js
const { app, init: initExpress } = require('./config/express');
const { init: initRoute } = require('./route/route');

initExpress(); // express 설정
initRoute(app); // 라우터 경로 설정

app.listen(4000, () => {
  console.log("서버 4000 실행");
})
```

### config/express.js
```js{3}
const express = require('express');
const app = express();
const router = express.Router(); // 라우터는 이렇게 공유해서 사용하면 안된다!

function init() {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
}

module.exports.init = init;
module.exports.app = app;
module.exports.router = router;
```

### config/router.js
```js
const photo = require('../route/photo');
const voucher = require('../route/voucher');

function init(app) {
  app.use('/photo', photo);
  app.use('/voucher', voucher);
}

module.exports.init = init;
```

### router/photo.js
```js{1}
// const { router } = require('../config/express');
const express = require('express');
const router = express.Router();

router.route('/')
  .get((req, res) => res.json({ message: '포토 조회 API' }))
  .post((req, res) => res.json({ message: '포토 추가 API' }))
  .delete((req, res) => res.json({ message: '포토 삭제 API' }))

module.exports = router;
```

### router/voucher.js
```js{1}
// const { router } = require('../config/express');
const express = require('express');
const router = express.Router();

router.route('/')
  .get((req, res) => res.json({ message: '소유권 조회 API' }))
  .post((req, res) => res.json({ message: '소유권 추가 API' }))
  .delete((req, res) => res.json({ message: '소유권 삭제 API' }))

module.exports = router;
```

위 프로젝트 구조를 보면`config/router.js` 에서  
`/photo`의 하위 경로에 대해서는 `router/photo.js` 파일에 존재하는 미들웨어를 실행하고 `/voucher`의 하위 경로에 대해서는 `router/voucher.js` 파일에 존재하는 미들웨어를 실행하게 되어 있다.

이 때 각 파일에서 사용하는 라우터 객체 `express.Router()`는 **각각의 라우터 파일에서 새로 생성** 해야한다.  
만약 그렇지 않고 `router/photo.js`의 주석 처리된 `1번 라인` 처럼 공유해서 사용한다면, `/photo` 로 요청해도 `/voucher`로 요청해도 `/` 경로에 대해 <b style="color: red;">**먼저 등록된**</b> 포토카드 관련 컨트롤러만 실행이 되어 버린다.
