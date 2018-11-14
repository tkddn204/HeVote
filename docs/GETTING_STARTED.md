> Note
>
> [Installation Guide](https://github.com/HanBae/HeVote/blob/master/docs/INSTALLATION_GUIDE.md)에 따라
> 프로그램을 모두 설치하셔야 합니다!

# Getting Started
## Running Server
현재 HeVote는 test 용도의 prototype으로만 제공하고 있습니다.
앞으로 개선을 하여 development, test, production으로 나눌 것입니다.

### Locally
1. ganache로 이더리움 노드를 열어주세요.
2. mongoDB를 실행하고, mongoDB의 데몬이 실행되었는지 확인해주세요.
3. `.env` 파일의 설정을 알맞게 수정해주세요.
    ```bash
    mv .env.example .env
    # vim
    vim .env
    # nano
    nano .env
    ```
    
    형식은 다음과 같이 맞춰주시면 됩니다.

    ```dotenv
    MONGO_URL=localhost     # MongoDB의 URL
    MONGO_PORT=27017        # MongoDB의 Port
    MONGO_ID=               # MongoDB의 'vote' 문서 관리자 ID(없으면 공란)
    MONGO_PASS=             # MongoDB의 'vote' 문서 관리자 Password(없으면 공란)
    ETHER_URL=localhost     # 연결할 Ethereum 노드(ganache)의 JSON RPC URL
    ETHER_PORT=8545         # 연결할 Ethereum 노드(ganache)의 JSON RPC Port
    ETHER_NETWORK_ID=*      # 연결할 Ethereum 노드(ganache)의 Network Id
    IPFS_URL=ipfs.infura.io # IPFS의 URL 
    IPFS_PORT=5001          # IPFS의 Port
    SESSION_SECRET=secret   # 웹 서버 세션의 비밀값(무작위로 작성해주세요)
    ```
4. 서버가 잘 구동되는지 확인하세요.
    ```bash
    npm run start
    ```

5. 초기 설정 명령을 실행해주세요(동형암호 생성과 IPFS 업로드로 약간의 시간이 걸릴 수 있습니다).
이 명령어는 선거 컨트렉트를 초기화할 때도 사용됩니다.
    ```
    npm run migration
    ```

6. 마지막으로 `http://localhost:4000`으로 접속하여 웹사이트가 잘 열리는지 확인하세요.

#### election

선거의 절차는 **선거 개설**, **투표**, **집계** 세 단계로 나눠집니다.

작성중..
