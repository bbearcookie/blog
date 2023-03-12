---
title: 'Express.js의 라우터 기능'
date: 2023-3-12 18:18:00
category: 'issue'
draft: false
---

Express.js의 Router 기능을 통해서 라우팅 경로를 지정하는데 의도치 않은 상황을 겪은 적이 있다.  
예를 들어 `/photo` 경로에 대한 라우터와 `/voucher` 경로에 대한 라우터를 지정하고 각각 `router.get('/')` 으로 컨트롤러 로직을 등록했는데 `/photo` 에 요청해도 `/voucher`에 요청해도 똑같은 컨트롤러의 로직만 실행되는 것이었다.  
원인은 `express.Router()` **객체를 참조한 것을 각 라우터가 공유해서 사용하도록 만들었기 때문**이었다.  

API 서버 프로그램을 만들다 보면 express에 관한 것 말고도 다양한 설정들이 존재하기에 나는 프로그램의 시작 포인트인 `app.js`에 express 관련 설정을 몽땅 놓지 않고 관련 파일 `express.js`를 따로 만들어서 설정하는 방법을 선호한다.

그래서 `express.js` 파일에서 `app` 객체를 생성하고 관련 설정을 한 뒤, `app.js` 같은 곳에서 사용할 수 있도록 내보냈는데 이 과정에서 `express.Router()` 객체도 같은 방법으로 내보내서 사용했기 때문에 문제가 생겼던 것이었다.

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

위와 같이 프로젝트가 구성되어 있을때 `express.Router()`는 **각각의 라우팅 파일에서 새로 참조**를 해야한다.  
만약 라우팅 파일의 `1번 라인` 처럼 한번 참조했던 것을 가져와서 공유해서 사용한다면  
`/photo` 로 요청해도 `/voucher`로 요청해도 `/` 경로에 대해 <b style="color: red;">**먼저 등록된**</b> 포토카드 관련 컨트롤러만 실행이 되어 버린다.