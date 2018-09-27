# Installation Guide
## Recommended Environments
우분투 환경에서 구동하는 것을 추천합니다. 분명, 다른 OS로도 구동할 수 있는 방법이 존재할 수 있습니다!
- [Ubuntu](https://www.ubuntu.com/) 16.04 / 18.04 LTS (64-bit)

## Requirements
HeVote의 서버를 구동하기 위해서는 다음과 같은 구성요소가 필요합니다.
- [NodeJS / npm](https://nodejs.org/ko/)
    - 8 이상 버전을 추천합니다.
- [ganache](https://truffleframework.com/ganache)([ganache-cli](https://github.com/trufflesuite/ganache-cli)) or [geth](https://github.com/ethereum/go-ethereum)(숙련자용)
    - **최신 버전**을 권장합니다.

## preInstall
설치할 것이 생각보다 많습니다. 하지만 참고 천천히 잘 따라와 주신다면, 웅장한(?) HeVote의 모습을 보실 수 있을 겁니다!

- truffle

우선, 스마트 컨트렉트 코드 컴파일 및 배포를 위해 truffle을 설치해야 합니다.

```
npm install -g truffle
```

- Helib

truffle을 설치하는 동안, HElib을 설치해주세요(시간이 오래 걸릴 수 있습니다).

1. HElib의 [INSTALL.txt](https://github.com/shaih/HElib/blob/master/INSTALL.txt)를 참조하여 GMP와 NTL의 설치를 진행하세요.
2. (★**중요!**)GMP와 NTL의 설치가 모두 끝나면, HElib를 clone하여 `app/hec/HElib` 안에 넣어주세요.
    1. `git clone https://github.com/shaih/HElib`
    2. `mv HElib app/hec/HElib`
    3. `cd app/hec/HElib/`
3. 이후 INSTALL.txt의 절차에 따라 `make`를 진행해주시고,
4. `cd app/hec` 으로 돌아오셔서 `make install`을 한번 하셔서 컴파일을 해주시면 됩니다.

> ※ Caution!
>
> `/usr/local` 안에 GMP와 NTL이 잘 설치되었는지 확인해주세요!
>
> 컴파일할 때 항상 해당 경로의 라이브러리(`.a`)를 사용합니다!


- dependency
마지막으로, `package.json`의 의존성 설치를 해주시면 됩니다.

```
npm install
```

혹시 설치 중에 문제가 발생하시면, 언제든지 제 [메일](mailto:tkddn204@gmail.com?subject="HeVote 설치 문제")
또는 [Issue](https://github.com/HanBae/HeVote/issues/new)에 질문을 남겨주세요!
