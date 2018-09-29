# Installation Guide
## Recommended Environments
우분투 환경에서 구동하는 것을 추천합니다.

- [Ubuntu](https://www.ubuntu.com/) 16.04 / 18.04 LTS (64-bit)

또한, 고사양의 하드웨어를 사용하는 것을 추천합니다.

- RAM 4GB 이상 권장
- SSD 20GB 이상 권장

## Requirements
HeVote의 서버를 구동하기 위해서는 다음과 같은 구성요소가 필요합니다.
- [NodeJS / npm](https://nodejs.org/ko/)
    - 8 이상 버전을 권장합니다.
- [ganache](https://truffleframework.com/ganache)([ganache-cli](https://github.com/trufflesuite/ganache-cli)) or [geth](https://github.com/ethereum/go-ethereum)(숙련자용)
    - **최신 버전**을 권장합니다.
- [MongoDB](https://www.mongodb.com/)
    - 개발 시 **2.6.10** 버전을 이용했기에, 그 이상의 버전을 권장합니다.
- option: [IPFS](https://ipfs.io/)
    - 따로 IPFS의 노드를 운용하셔서 연결하실수도 있습니다.
    - default: [INFURA](https://infura.io)의 IPFS 노드를 사용합니다.
    - 자신의 노드를 사용하실 분만 설치하시면 됩니다.

## Install HeVote
설치할 것이 생각보다 많습니다. 하지만 참고 천천히 잘 따라와 주신다면, 멋진 HeVote의 모습을 보실 수 있을 겁니다.

### clone

우선, HeVote의 github 저장소를 clone합니다.

```
git clone https://github.com/HanBae/HeVote
```

### truffle

스마트 컨트렉트 코드 컴파일 및 배포를 위해 truffle을 설치해야 합니다.

```
sudo npm install -g truffle
```

### HElib

truffle을 설치하는 동안, HElib을 설치해주세요(시간이 오래 걸릴 수 있습니다).

1. HElib의 [INSTALL.txt](https://github.com/shaih/HElib/blob/master/INSTALL.txt)를 참조하여 GMP와 NTL의 설치를 진행하세요.
    - GMP를 설치하는 데 어려움이 발생하면, 다음 명령어로 설치하세요. gmp 6.1.2 버전을 사용합니다.
    ```
    wget https://gmplib.org/download/gmp/gmp-6.1.2.tar.lz
    sudo apt install lunzip m4
    lunzip gmp-6.1.2.tar.lz
    tar -xvf gmp-6.1.2.tar
    cd gmp-6.1.2
    ./configure
    make
    make check
    sudo make install
    ```
    - NTL을 설치하는 데 어려움이 발생하면, 다음 명령어로 설치하세요. NTL 11.2.1 버전을 사용합니다.
    ```
    wget http://www.shoup.net/ntl/ntl-11.2.1.tar.gz
    sudo apt-get install libntl-dev
    tar -xvf ntl-11.2.1.tar.gz
    cd ntl-11.2.1/src
    ./configure NTL_GMP_LIP=on
    make
    make check
    sudo make install
    ```
2. (★**중요!**) 다음 명령어로 HElib을 clone하고, HElib 디렉토리를 HeVote의 `HeVote/app/hec` 안에 넣어주세요. 
```
git clone https://github.com/shaih/HElib
mv HElib HeVote/app/hec/HElib
cd HeVote/app/hec/HElib/src
make
make check
```
3. 마지막으로 다음 명령어를 실행하여 컴파일을 진행하면 됩니다.
```
cd ../..
mkdir bin
make all
```

> ※ **Caution!**
>
> `/usr/local/include` 안에 GMP와 NTL이 잘 설치되었는지 확인해주세요!
> 동형암호를 사용할 때 항상 `/usr/local/include` 경로 안의 라이브러리를 사용합니다!


### dependency

마지막으로, `package.json`의 의존성 설치를 해주시면 됩니다.

```
npm install
```

혹시 설치 중에 문제가 발생하시면, 언제든지 제 [메일](mailto:tkddn204@gmail.com?subject=[HeVote]%20설치%20문제)
또는 [Issue](https://github.com/HanBae/HeVote/issues/new)에 질문을 남겨주세요!
