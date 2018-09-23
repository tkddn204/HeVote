# HeVote
[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/HanBae/HeVote/blob/master/LICENSE)

HeVote는 동형암호를 사용한 블록체인 기반 전자투표 시스템(ÐApp)입니다.

## Introduction
HeVote는 전자투표의 개설부터 투표, 집계까지 할 수 있습니다.
[이더리움](https://www.ethereum.org/)과 [IPFS](https://ipfs.io/), 두 블록체인을 사용하여 투표 내역을 적은 비용으로 안전하게 저장할 수 있으며,
동형암호 라이브러리인 [HElib](https://github.com/shaih/HElib)으로 사용자가 투표한 내역을 암호화하고,
암호화된 상태에서도 투표 집계를 가능케 하여 비밀선거의 원칙을 지키도록 했습니다!
Express.js+mongoDB를 사용한 정적 웹 으로 사용자에게 쉽고 편리하게 전자투표 서비스를 제공할 수 있습니다.

## Advantage
- 이더리움과 IPFS: 안전하게 투표 내역을 저장
- 동형암호: 투표 내역을 암호화하여 저장하므로 해킹에 안전

## Features
- Metamask 및 Mist 등의 이더리움 지갑 없이 ÐApp을 사용할 수 있습니다.
- 일반 사용자도 선거 개설을 요청할 수 있습니다.
- 사용자는 무조건 한 선거 당 하나의 투표만을 진행할 수 있습니다.
- 한정된 유권자만 투표할 수 있습니다. (예정) 

## Installation
[Installation Guide](https://github.com/HanBae/HeVote/blob/master/docs/INSTALLATION_GUIDE.md)를 참고하세요!

## Get Started

## Examples

## Thanks To
- [passport-local-express4](https://github.com/mjhea0/passport-local-express4)를 포크했습니다.
로그인의 벽에 부딪혔을 때 구원해주신 [mjhea0](https://github.com/mjhea0)에게 감사의 말씀을 드립니다.
- 디렉토리 구조는 [node-express-mongoose-demo](https://github.com/madhums/node-express-mongoose-demo)를 사용했습니다.
마찬가지로 어려움에 도움을 주신 [madhums](https://github.com/madhums)에게 감사의 말씀을 드립니다.

## License
HeVote는 [MIT License](https://github.com/HanBae/HeVote/blob/master/LICENSE) 하에 관리됩니다.
- [MIT License](https://github.com/HanBae/HeVote/blob/master/LICENSE)
- [Apache License](http://www.apache.org/licenses/LICENSE-2.0)
