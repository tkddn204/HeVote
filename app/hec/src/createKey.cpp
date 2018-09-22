#include <cstring>
#include <fstream>
#include <unistd.h>

#include <NTL/ZZX.h>
#include <NTL/vector.h>

#include "FHE.h"
#include "timing.h"
#include "EncryptedArray.h"

/**
 *  키를 생성하여 파일로 내보내는 모듈.
 *
 *  원래 RSA 방식과는 다르게 비밀키에서 공개키를 생성하는 구조임.
 *  공개키로 암호화를 하고, 비밀키로 복호화를 함.
 *
 *  키마다 txt파일(ascii)과 bin파일의 두 파일로 내보내짐
 *  공개키 : FHEcontext와 FHEPubKey 두 객체를 내보냄
 *  비밀키 : FHEcontext, FHESecKey, FHEPubKey 세 객체를 내보냄
 *
 */
int main(int argc, char *argv[]) {

    ArgMapping amap;

    long r = 1;
    long c = 2;
    long w = 64;
    long k = 80;
    long d = 1;

    long p = 257;
    long L = 8;
    string owner = "owner";
    string dir = "data";

    amap.arg("p", p, "plaintext base");
    amap.arg("L", L, "number of levels wanted");
    amap.arg("o", owner, "owner's address");
    amap.arg("dir", dir, "save directory");
    amap.parse(argc, argv);

    // file names
    const string secretKeyBinaryFile = dir + "/secretKey/" + owner + ".bin";
    const string publicKeyBinaryFile = dir + "/publicKey/" + owner + ".bin";

    ofstream secretBinFile(secretKeyBinaryFile.c_str(), ios::binary);
    assert(secretBinFile.is_open());

    ofstream publicBinFile(publicKeyBinaryFile.c_str(), ios::binary);
    assert(publicBinFile.is_open());

    // create context
    long m = FindM(k, L, c, p, d, 0, 0);
    std::unique_ptr<FHEcontext> context(new FHEcontext(m, p, r));
    buildModChain(*context, L, c);  // Set the modulus chain

    // create key
    std::unique_ptr<FHESecKey> secKey(new FHESecKey(*context));
    FHEPubKey *pubKey = (FHEPubKey *) secKey.get();
    secKey->GenSecKey(w);
    addSome1DMatrices(*secKey);
    addFrbMatrices(*secKey);

    // Secret Bin
    cout << "\tWriting Secret Binary file " << secretKeyBinaryFile << endl;
    writeContextBaseBinary(secretBinFile, *context);
    writeContextBinary(secretBinFile, *context);
    writePubKeyBinary(secretBinFile, *pubKey);
    writeSecKeyBinary(secretBinFile, *secKey);

    // Public Bin
    cout << "\tWriting Public Binary file " << publicKeyBinaryFile << endl;
    writeContextBaseBinary(publicBinFile, *context);
    writeContextBinary(publicBinFile, *context);
    writePubKeyBinary(publicBinFile, *pubKey);

    secretBinFile.close();
    publicBinFile.close();

    cout << "createKey successful.\n\n";
}