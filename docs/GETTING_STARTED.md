> Note
>
> [Installation Guide](https://github.com/HanBae/HeVote/blob/master/docs/INSTALLATION_GUIDE.md)에 따라
> 프로그램을 모두 설치하셔야 합니다!

# Getting Started
## Running Server
### Locally
1. ganache로 이더리움 노드를 열어주세요.
2. mongoDB를 실행하고, mongoDB의 데몬이 실행되었는지 확인해주세요.
3. `.env` 파일의 설정을 알맞게 수정해주세요. 
    ```
    mv .env.example .env
    vim .env
    ```
4. 서버가 잘 구동되는지 확인하세요.
    ```
    npm run start
    ```
5. `localhost:4000`으로 접속하여 웹사이트가 잘 열리는지 확인하세요.

### test
현재 HeVote는 test 용도의 prototype으로만 제공하고 있습니다.
앞으로 개선을 하여 development, test, production으로 나눌 것입니다.

#### setup
1. 서버를 실행한 후, **region@election.com**으로 가입해주세요.
비밀번호는 마음대로 정하셔도 됩니다.

2. 초기 설정 명령을 실행해주세요(동형암호 생성과 IPFS 업로드로 시간이 걸릴 수 있습니다). 이 명령어는 선거를 초기화할 때도 사용됩니다.
```
npm run remake
```

#### scenario test
**(작성중)**

투표의 시나리오는 다음 다섯 단계로 이루어집니다.

- 선거 관리

선거 개설자 아이디로 로그인하여 선거 목록에 있는 테스트 선거를 클릭하면,
`선거 정보 수정하기` 버튼이 있습니다.
이 버튼을 누르면 다음 목록을 볼 수 있습니다.

- 로그인 후 투표 참여

- 후보자 선택 후 투표

- 투표 완료(반복)

- 선거 종료 후 집계