---
title: "블로그 prebuild-install 이슈"
date: 2023-09-28
update: 2023-09-28
tags:
  - issue
  - build-essential
---

최근에 구매한 갤럭시 북3 프로에 WSL을 이용해 Ubuntu를 설치하고 그 위에서 개발과 관련한 프로그램을 설치하고 사용하고 있었다.  

이게 꽤나 마음에 들어서 원래 사용하던 데스크탑도 윈도우 11로 업그레이드하고 포맷할 겸 동일하게 개발환경을 Ubuntu 기반으로 이사했는데, 그 과정에서 블로그 레포지토리를 받아서 글을 작성하려는데 이슈가 있어서 기록해보고자 한다.  

## build-essential
`npm install` 로 패키지를 설치하려는데 특정 모듈(이미지 처리와 관련한 모듈인듯)을 설치하는 도중 다음과 같은 에러가 발생했다:

```sh
prebuild-install WARN install No prebuilt binaries found (target=14.19.3 runtime=node arch=x64 libc= platform=linux)
gyp ERR! build error 
gyp ERR! stack Error: not found: make
gyp ERR! stack     at getNotFoundError (/home/aodem/.nvm/versions/node/v14.19.3/lib/node_modules/npm/node_modules/which/which.js:13:12)
gyp ERR! stack     at F (/home/aodem/.nvm/versions/node/v14.19.3/lib/node_modules/npm/node_modules/which/which.js:68:19)
gyp ERR! stack     at E (/home/aodem/.nvm/versions/node/v14.19.3/lib/node_modules/npm/node_modules/which/which.js:80:29)
gyp ERR! stack     at /home/aodem/.nvm/versions/node/v14.19.3/lib/node_modules/npm/node_modules/which/which.js:89:16
gyp ERR! stack     at /home/aodem/.nvm/versions/node/v14.19.3/lib/node_modules/npm/node_modules/isexe/index.js:42:5
gyp ERR! stack     at /home/aodem/.nvm/versions/node/v14.19.3/lib/node_modules/npm/node_modules/isexe/mode.js:8:5
gyp ERR! stack     at FSReqCallback.oncomplete (fs.js:192:21)
gyp ERR! System Linux 5.15.90.1-microsoft-standard-WSL2
gyp ERR! command "/home/aodem/.nvm/versions/node/v14.19.3/bin/node" "/home/aodem/.nvm/versions/node/v14.19.3/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js" "rebuild"
gyp ERR! cwd /home/aodem/workspace/blog/node_modules/sharp
gyp ERR! node -v v14.19.3
gyp ERR! node-gyp -v v5.1.0
gyp ERR! not ok
```

이건 Ubuntu에 build-essential 패키지가 설치되어 있지 않아서 발생하는 문제였다.  
설치하려는 모듈 중에서 이 패키지에 의존하는 게 있는듯..

### 해결책
#### 1. build-essential 설치
```sh
sudo apt-get install build-essential
```

#### 2. 캐시 및 package-lock.json 리셋

```sh
rm -rf node_modules
rm package-lock.json
npm cache clear --force
npm install
```

build-essential를 설치하고 깔끔하게 패키지와 캐시를 날려서 다시 인스톨했다.

### 참고 자료
[[npm 오류] Error: not found: make](https://blog.uniony.me/nodejs/make-not-found/)  
[WorkerError: failed to process image #21515](https://github.com/gatsbyjs/gatsby/issues/21515)  
