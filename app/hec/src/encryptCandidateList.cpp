#include <cstring>
#include <fstream>
#include <unistd.h>

#include <NTL/ZZX.h>
#include <NTL/vector.h>

#include "FHE.h"
#include "timing.h"
#include "EncryptedArray.h"

/**
 * 후보자 번호(벡터)를 암호화된 텍스트(Ctxt) 객체를 내보내는 모듈
 *
 * 공개키가 필요하며 공개키는 owner를 보고 찾아냄
 * 파라미터로는 o와 t가 있음
 * o는 owner의 주소
 * t는 후보자의 총 숫자
 *
 * 내보내는 파일명은 후보자 번호와 owner를 포함함
 *
 */
int main(int argc, char *argv[]) {
    ArgMapping amap;

    string owner = "owner";
    string voter = "voter";
    string dir = "data";
    long total = 4;

    amap.arg("o", owner, "owner's address");
    amap.arg("v", voter, "voter's address");
    amap.arg("t", total, "candidate's total number");
    amap.arg("dir", dir, "save directory");
    amap.parse(argc, argv);

    // file names
    const string publicKeyBinaryFileName = dir + "/publicKey/" + owner + ".bin";
    cout << publicKeyBinaryFileName << flush;

    // get publicKeyFile
    ifstream publicBinFile(publicKeyBinaryFileName.c_str(), ios::binary);
    assert(publicBinFile.is_open());

    // get CandidateFiles
    fstream candidateFile[total];
    for(long i = 0; i < total; i++) {
        string candidatesFileName = dir + "/candidate/" + owner + "-" + to_string(i) + "-" + voter + ".txt";
        candidateFile[i] = fstream(candidatesFileName.c_str(), fstream::out | fstream::trunc);
        assert(candidateFile[i].is_open());
    }

    // Read in context,
    std::unique_ptr<FHEcontext> context = buildContextFromBinary(publicBinFile);
    readContextBinary(publicBinFile, *context);

    // Read in SecKey and PubKey.
    // Got to insert pubKey into seckey obj first.
    std::unique_ptr<FHESecKey> secKey(new FHESecKey(*context));
    FHEPubKey *pubKey = (FHEPubKey *) secKey.get();

    // read publicKey
    readPubKeyBinary(publicBinFile, *pubKey);

    cout << "read publicKey successful.\n" << flush;

    publicBinFile.close();

    // make encryption texts
    for(long i = 0; i < total; i++) {
        // ready to encryption
        Ctxt encryptionText(*pubKey);
        Vec <ZZ> resultPoly;
        resultPoly.SetLength(total);

        // set poly
        for (long j = 0; j < total; j++) {
            if (j == i) resultPoly[j] = 1;
            else resultPoly[j] = 0;
        }

        // encrypt poly
        pubKey->Encrypt(encryptionText, to_ZZX(resultPoly));
        candidateFile[i] << encryptionText << endl;

//        cout << "array : " << resultPoly << endl;
    }

    for(long i = 0; i < total; i++) {
        candidateFile[i].close();
    }

    cout << "encrypt candidates successful.\n\n";
}