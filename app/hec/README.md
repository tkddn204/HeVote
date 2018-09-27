# HEC
HEC는 HeVote를 위한 동형암호 커넥터(Homomorphic Encription Connector)의 줄임말입니다.

## Usage
모듈 맨 위에 다음 코드만 입력하여 함수를 사용하면 됩니다!

```
const Hec = require('../hec/hec')();
```

## Example

```
const Hec = require('../hec/hec')();

await Hec.createKeys(deployedPublicElections[0], 10007, 7, 'data', async () => {
            const publicKeyFilePath = "./data/publicKey/" + deployedPublicElections[0] + ".bin";
            const fileSize = fs.statSync(publicKeyFilePath).size;
            if (fileSize > 0) {
                console.log("good. Key files saved");
            } else {
                console.error("failed: file not Saved");
            }
        });
```

## Methods
~~(작성중)~~

- Hec.createKeys(...)
- Hec.encryptCandidateList(...)
- Hec.tally(...)
- Hec.getResult(...)
