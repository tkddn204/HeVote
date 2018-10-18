# HeVote

[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/HanBae/HeVote/blob/master/LICENSE)

HeVote는 동형암호를 사용한 이더리움 기반 전자투표 시스템(ÐApp)입니다.

## Introduction

HeVote는 전자투표의 개설부터 투표, 집계까지 할 수 있습니다.
[이더리움](https://www.ethereum.org/)의 블록체인을 사용하여 투표 내역을 적은 비용으로 안전하게 저장합니다.
동형암호 라이브러리인 [HElib](https://github.com/shaih/HElib)으로 사용자가 투표한 내역을 암호화하고,
암호화된 상태에서도 투표 집계를 가능케 하여 비밀선거의 원칙을 지키도록 했습니다.
[IPFS](https://ipfs.io/) 프로토콜을 사용하여 이더리움 트랜잭션의 비용을 줄이고, 동형암호 파일을 탈중앙화하여 저장합니다.
Express.js + mongoDB를 사용한 정적 웹으로 사용자에게 쉽고 편리하게 전자투표 서비스를 제공할 수 있습니다.

## Advantage

- 이더리움: 안전하게 투표 내역을 저장
- 동형암호: 투표 내역을 암호화하여 저장하므로 해킹에 안전
- IPFS: 이더리움 트랜잭션 비용 감소
- 웹: 사용자에게 쉽고 간단한 투표 서비스를 제공

## Architecture

<p align="center">
  <img src="https://github.com/HanBae/HeVote/blob/master/docs/images/architecture.png" width="70%" height="70%" />
</p>

ÐApp 서버를 중심으로 이더리움, IPFS, MongoDB와 정보를 주고받으면서 사용자에게 전자투표 서비스를 제공합니다.

- 사용자: ÐApp 서버에 회원 및 선거, 투표에 관련된 서비스를 이용할 수 있습니다.
- ÐApp 서버: Express.js 정적 웹 서버로써, 사용자와 블록체인 및 DB 간의 징검다리 및 서비스 제공자의 역할을 합니다.
- HElib: 차세대 동형암호 라이브러리로, 투표내역을 암호화 & 복호화합니다.
- 이더리움: 선거 정보와 투표 내역을 저장합니다.
- MongoDB: 사용자의 정보와 선거 개설 신청 정보를 저장합니다.
- IPFS: 동형암호의 공개키나 암호문을 탈중앙화하여 저장합니다.

## Features

자세한 설명은 [Detailed Features](https://github.com/HanBae/HeVote/blob/master/docs/DETAILED_FEATURES.md)를 참고해주세요.

- 이더리움 지갑(Metamask, Mist, ...) 없이 ÐApp 사용 가능
- 동형암호를 통한 비밀 선거 보장
- 동형암호 공개키와 암호문을 IPFS에 저장
- 누구나 투표할 수 있는 선거
- 하나의 선거 당 하나의 스마트 컨트렉트
- 쉽고 빠른 투표
- 로그인 / 회원가입
- 편리한 선거 관리 (예정)
- 유권자 한정 선거 (예정)

## Installation

[Installation Guide](https://github.com/HanBae/HeVote/blob/master/docs/INSTALLATION_GUIDE.md)를 참고하세요.

## Getting Started

[Getting Started](https://github.com/HanBae/HeVote/blob/master/docs/GETTING_STARTED.md)를 참고하세요.

## Demo

[![HeVote 시연영상](https://github.com/HanBae/HeVote/blob/master/docs/images/youtube-thumbnail.jpg)](https://www.youtube.com/watch?v=ZopzjAk5yak)

클릭하면 Youtube 시연영상으로 이동합니다.

## TODO

[TODO List](https://github.com/HanBae/HeVote/blob/master/docs/TODO_LIST.md)에 향후 개발해야할 내역들을 포함하고 있습니다.

## References

- fork to [passport-local-express4](https://github.com/mjhea0/passport-local-express4)
- [node-express-mongoose-demo](https://github.com/madhums/node-express-mongoose-demo)

## Contribute

[New Issue](https://github.com/HanBae/HeVote/issues/new)로 문의해주시고,
혹시 Pull Request 로 기여해주신다면 **대단히** 감사하겠습니다.

## License

HeVote는 [MIT License](https://github.com/HanBae/HeVote/blob/master/LICENSE) 하에 관리됩니다.
- HElib: [Apache License 2.0](https://github.com/shaih/HElib/blob/master/LICENSE)
