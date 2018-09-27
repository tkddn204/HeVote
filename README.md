# HeVote
[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/HanBae/HeVote/blob/master/LICENSE)

(GIF 추가 예정)

HeVote는 동형암호를 사용한 이더리움 & IPFS 기반 전자투표 시스템(ÐApp)입니다.

## Introduction
HeVote는 전자투표의 개설부터 투표, 집계까지 할 수 있습니다.
[이더리움](https://www.ethereum.org/)과 [IPFS](https://ipfs.io/), 두 블록체인을 사용하여 투표 내역을 적은 비용으로 안전하게 저장할 수 있으며,
동형암호 라이브러리인 [HElib](https://github.com/shaih/HElib)으로 사용자가 투표한 내역을 암호화하고,
암호화된 상태에서도 투표 집계를 가능케 하여 비밀선거의 원칙을 지키도록 했습니다.
Express.js+mongoDB를 사용한 정적 웹으로 사용자에게 쉽고 편리하게 전자투표 서비스를 제공할 수 있습니다.

## Advantage
- 이더리움과 IPFS: 안전하게 투표 내역을 저장
- 동형암호: 투표 내역을 암호화하여 저장하므로 해킹에 안전
- 웹: 사용자에게 쉽고 간단한 투표 서비스를 제공

## Architecture
![architecture](https://github.com/HanBae/HeVote/blob/master/docs/images/architecture.png)

시스템은 ÐApp 서버를 중심으로 이더리움 노드와 IPFS 노드, MongoDB들과 통신을 하면서 사용자에게 전자투표의 서비스를 제공하는 형태입니다.
- 사용자는 ÐApp 서버에게 회원 및 선거, 투표에 관련된 요청을 보내고 응답을 받음으로써 서비스를 이용할 수 있습니다.
- ÐApp 서버는 NodeJS의 Express.js 프레임워크를 사용한 웹 서버입니다. 사용자와 블록체인 및 DB 간의 징검다리 및 서비스 제공자의 역할을 합니다. 또한 동형암호 라이브러리인 HElib는 투표내역을 암호화하고 복호화를 할 때 실행합니다.
- 이더리움 노드는 선거의 정보와 투표 내역을 저장하는 블록체인과 서버와 정보를 주고받는 용도로 사용합니다. 저희는 따로 테스트 노드를 사용하여 앱 개발을 진행하였습니다.
- MongoDB는 사용자의 정보(ID, 비밀번호, 투표한 목록 등)를 저장하고, 사용자가 개설을 신청한 내역도 저장하는 용도로 사용합니다.
- IPFS 노드는 블록체인 파일시스템으로써 동형암호의 공개키나 암호문을 반영구적으로 블록체인에 저장하고, 저장한 뒤의 SHA-1 형태의 Hash값을 ÐApp 서버로 반환해주는 용도로 사용합니다.

## Functional Features
자세한 설명은 [Detailed Features](https://github.com/HanBae/HeVote/blob/master/docs/DETAILED_FEATURES.md)를 참고해주세요.
- 일반 사용자는 Metamask 및 Mist 등의 이더리움 지갑 없이 ÐApp을 사용할 수 있습니다.
- 일반 사용자는 선거를 개설하고 싶다고 관리자에게 요청할 수 있습니다.
- 관리자는 선거 개설 요청 리스트를 볼 수 있습니다. (예정)
- 관리자는 선거 컨트렉트들의 목록을 관리할 수 있습니다. (예정)
- 선거를 개설한 사용자(선거 개설자)는 여러 개의 선거 컨트렉트 계정을 가질 수 있으며,
  기본적으로 **선거 개설자가 모든 이더리움 수수료 부담 책임을 집니다**.
- 일반 사용자가 자신의 계정으로 수수료를 지불할 수 있는 정책을 가진 선거를 개설할 수 있습니다. (예정)
- 선거에 투표할 수 있는 사용자(유권자)는 무조건 한 선거 당 하나의 투표만을 진행할 수 있습니다.
- IPFS에는 동형암호의 공개키와 암호문(Cypher Text)만을 저장합니다(동형암호의 비밀키는 ÐApp 서버에 저장).
- 한정된 유권자만 투표할 수 있습니다. (예정) 

## Installation
[Installation Guide](https://github.com/HanBae/HeVote/blob/master/docs/INSTALLATION_GUIDE.md)를 참고하세요.

## Get Started
[Get Started](https://github.com/HanBae/HeVote/blob/master/docs/GET_STARTED.md)를 참고하세요.

## Demo
(youtube 동영상 추가 예정)

## TODO
[TODO List](https://github.com/HanBae/HeVote/blob/master/docs/TODO_LIST.md)에 향후 개발해야할 내역들을 포함하고 있습니다.

## References
- fork to [passport-local-express4](https://github.com/mjhea0/passport-local-express4)
- [node-express-mongoose-demo](https://github.com/madhums/node-express-mongoose-demo)

## Contribute
[New Issue](https://github.com/HanBae/HeVote/issues/new)로 기여해주시고,
혹시 새로운 Branch로 기여해주신다면 **대단히** 감사하겠습니다.

## License
HeVote는 [MIT License](https://github.com/HanBae/HeVote/blob/master/LICENSE) 하에 관리됩니다.
- [MIT License](https://github.com/HanBae/HeVote/blob/master/LICENSE)
- HElib: [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0)
