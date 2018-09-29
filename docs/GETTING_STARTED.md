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

4. 초기 설정을 하기 위해 `remake` 명령을 실행해주세요.
```
npm run remake
```

5. 