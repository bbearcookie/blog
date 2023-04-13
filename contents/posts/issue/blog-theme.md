---
title: "블로그 설정하면서 발생한 문제 해결"
date: 2023-03-24
update: 2023-03-24
tags:
  - issue
---

내가 개발에 관한 내용을 기록하거나, 이슈에 마주했을 때 해결 과정을 기록해서 추후에 참고할 수 있게끔 하기 위해 `Gatsby`로 만들어진 정적 페이지를 `Netlify`에 배포하여 블로그를 설정했었다.

우선은 블로그를 예쁘게 꾸며야 한다는 생각보다는 고려했던 점은 다음과 같다.
1. 나중에 블로그에 대해서 **추가하고 싶은 기능**이나 **수정하고 싶은 부분**이 생기면 충분히 대응할 수 있어야 함.
2. 만약 블로그의 내용을 **다른 곳으로 옮기고 싶은 경우가 생겼을 때 더 유연하게 대응**할 수 있게끔 블로그의 내용은 마크다운 파일로 작성하고, 그 내용은 파일 형태로 보관할 수 있어야 함.

그래서 나는 내가 친숙하게 다룰 수 있는 `React`를 기반으로 만들어진 정적 페이지를 위한 프레임워크 `Gatsby`로 블로그를 구성해보고자 했다.
또한 처음부터 모든 걸 개발하기 보다는 이미 다른 사람들이 블로그로 사용할 수 있게끔 잘 구성해놓은 있는 테마들이 많았기에 `gatsby-starter-bee`로 블로그를 처음 구성하여 글을 써 나가기 시작했다.

그런데 글이 점차 많아지면서 글마다 태그를 하나만 지정할 수 있는게 아니라 여러 개를 지정하면 찾아보기 편할 것이라는 생각을 했고, 다른 테마도 더 깔끔하면서 사용하기에 좋아보여서 `gatsby-starter-hoodie`로 블로그의 셋업을 다시 하게 되었다.

## 빌드 문제

이전에 `gatsby-starter-bee` 를 받아서 구성했을 때에도 노드의 버전에 따라서 호환이 되지 않는 문제가 발생했었기 때문에 이번에도 노드의 구버전을 사용하기 위해서 시스템에 여러 개의 `Node.js` 버전을 설치해서 사용할 수 있는 `NVM(Node Version Manager)`를 이용했다.

> nvm ls: 시스템에 설치된 노드의 버전 목록 확인  
> npm install &lt;version&gt;: 특정 버전의 노드 설치  
> npm uninstall &lt;version&gt;: 시스템에 설치된 특정 버전의 노드 삭제   
> nvm use &lt;version&gt;: 시스템에 설치된 특정 버전의 노드 사용  

이번에 노드 버전 `14.19.3`을 이용했는데 프로젝트에 사용되는 관련 모듈을 설치하는 명령어인 `npm install`을 입력하는 과정중에 다음과 같은 에러가 발생했다.

```sh
gyp ERR! find VS **************************************************************
gyp ERR! find VS You need to install the latest version of Visual Studio
gyp ERR! find VS including the "Desktop development with C++" workload.
gyp ERR! find VS For more information consult the documentation at:
gyp ERR! find VS https://github.com/nodejs/node-gyp#on-windows
gyp ERR! find VS **************************************************************
```

이는 `node-gyp` 이라는 모듈에서 `Visual Studio`의 `C++`관련 모듈을 사용하는데, 컴퓨터에 설치되어 있지 않아서 발생하는 문제였다. 그래서 Visual Studio를 설치했더니 `npm install` 명령어 입력시 관련 모듈이 잘 설치가 되었다.  

## 배포 문제

`Github`의 원격 저장소에 `deploy` 브랜치가 업데이트 되면 자동으로 `Netlify`가 인식해서 프로젝트 빌드 후 배포를 하도록 설정했는데 이번에는 내 컴퓨터에서의 빌드를 하거나 개발 서버를 실행하는 데에는 문제가 없지만, `Netlify`에서는 빌드를 정상적으로 하지 못하는 문제가 발생했다. 에러 메시지는 다음과 같았다.

```sh
2:53:17 AM: failed Building production JavaScript and CSS bundles - 18.422s
2:53:17 AM: error Generating JavaScript bundles failed
2:53:17 AM: Can't resolve 'components/Bio' in '/opt/build/repo/src/components/Article/Footer'
2:53:17 AM: If you're trying to use a package make sure that 'components/Bio' is installed. If you're trying to use a local file make sure that the path is correct.
2:53:17 AM: error Generating JavaScript bundles failed
2:53:17 AM: Can't resolve 'components/Bio' in '/opt/build/repo/src/pages'
2:53:17 AM: If you're trying to use a package make sure that 'components/Bio' is installed. If you're trying to use a local file make sure that the path is correct.
2:53:17 AM: not finished Generating image thumbnails - 19.846s
```

보아하니 여러 컴포넌트가 `import`해서 사용하는 `components/Bio`의 경로를 정상적으로 인식하지 못해서 발생하는 것이었다. 이게 `Netlify`에서는 `jsconfig.json`에 설정된 경로 정보를 인식하지 못해서 발생하는 문제인지 의심해서 모든 컴포넌트의 `import` 구문을 상대 경로 지정 방식으로 변경해 보았는데도 문제는 해결되지 않았었다.

원인은 <b style="color: red">**디렉토리의 경로가 달라서**</b> 였다.  
실제 프로젝트에는 디렉토리 이름이 bio로 되어있는데, import 구문은 대문자인 Bio로 `import`가 되고 있었다. 내 시스템에서는 대소문자를 크게 구분하지 않지만, `Netlify`에서는 대소문자를 구문했기 때문에 발생하는 것으로 생각된다. 그래서 디렉토리의 제목를 대문자인 `Bio`로 바꿔주고 배포하기 위해 커밋을 하려는데...

```
nothing to commit, working tree clean
```

디렉토리의 대소문자가 바뀐 것을 깃에서 감지하지 않았다.
찾아보니 깃에는 `ignorecase` 라는 옵션이 있는데, 이게 `true`라면 대소문자를 구분하지 않는다고 한다.

```sh
git config core.ignorecase false
```

위와 같은 명령어로 깃 설정을 바꿔주니 디렉토리 제목의 변경 사항을 잘 인식하였다.  
이후 커밋한 내용을 푸쉬하니 `Netlify`에서도 정상적으로 빌드가 되었다.