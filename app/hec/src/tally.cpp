#include <cstring>
#include <fstream>
#include <unistd.h>
#include <sys/types.h>
#include <dirent.h>
#include <errno.h>

#include <NTL/ZZX.h>
#include <NTL/vector.h>

#include "FHE.h"
#include "timing.h"
#include "EncryptedArray.h"

// https://www.linuxquestions.org/questions/programming-9/c-list-files-in-directory-379323/
// get Dir file names
int getdir(string dir, vector <string> &files) {
    DIR *dp;
    struct dirent *dirp;
    if ((dp = opendir(dir.c_str())) == NULL) {
        cout << "Error(" << errno << ") opening " << dir << endl;
        return errno;
    }

    int checkIndex = 0;
    while ((dirp = readdir(dp)) != NULL) {
        if(checkIndex++ < 2) continue;
        string fileName = string(dirp->d_name);
        files.push_back(string(dirp->d_name));
    }
    closedir(dp);
    return 0;
}

int main(int argc, char *argv[]) {
    ArgMapping amap;

    long numberOfCandidates = 4;
    string owner = "owner";
    string directoryPath = "data";

    amap.arg("n", numberOfCandidates, "number of candidates");
    amap.arg("o", owner, "owner's address");
    amap.arg("dir", directoryPath, "data directory Path");
    amap.parse(argc, argv);

    // setting directory path with Ctxt files
    string directoryPathWithCtxt = directoryPath + "/result/" + owner;

    // files name vector list
    vector<string> fileNames = vector<string>();

    // make resultFile
    const string resultFilePath = directoryPath + "/result/" + owner + ".txt";
    ofstream resultFile(resultFilePath.c_str(), ios::binary);
    assert(resultFile.is_open());

    // get Ctxt files
    getdir(directoryPathWithCtxt, fileNames);
    const long sizeOfCtxtFile = fileNames.size();
    if(sizeOfCtxtFile == 0) {
        string res = "[";
        for (int i = 0; i < n; i++) {
            res.append(to_string(i))
            if(i != n-1) res.append(",");
        }
        res.append("]");

        resultFile << res;
        return 0;
    }

    // get public key
    const string secretKeyBinaryFilePath = directoryPath + "/secretKey/" + owner + ".bin";
    ifstream secretBinFile(secretKeyBinaryFilePath.c_str(), ios::binary);
    assert(secretBinFile.is_open());

    // make stream of Ctxt Files
    fstream CtxtFiles[sizeOfCtxtFile];
    for (long i = 0;i < sizeOfCtxtFile;i++) {
        string fileName = directoryPathWithCtxt + "/" + fileNames[i];
        CtxtFiles[i] = fstream(fileName.c_str(), fstream::in);
        assert(CtxtFiles[i].is_open());
    }

    // Read context in secret bin file
    std::unique_ptr <FHEcontext> context = buildContextFromBinary(secretBinFile);
    readContextBinary(secretBinFile, *context);

    // Read in SecKey and PubKey.
    // Got to insert pubKey into secKey obj first.
    std::unique_ptr <FHESecKey> secKey(new FHESecKey(*context));
    FHEPubKey *pubKey = (FHEPubKey *) secKey.get();

    // read publicKey & secretKey
    readPubKeyBinary(secretBinFile, *pubKey);
    readSecKeyBinary(secretBinFile, *secKey);

    // close secreyKey file
    secretBinFile.close();

    cout << "read PublicKey & SecretKey successful.\n" << flush;


    // ready to add two Ctxts
    // get Ctxt to file
    Ctxt resultCtxt(*pubKey), tempCtxt(*pubKey), fillCtxt(*pubKey);

    // fill 1 to tempCtxt
    Vec <ZZ> tempPoly;
    tempPoly.SetLength(numberOfCandidates);

    // set poly
    for (long i = 0; i < numberOfCandidates; i++) tempPoly[i] = 1;
    // encrypt poly
    pubKey->Encrypt(fillCtxt, to_ZZX(tempPoly));


    // add CypherTexts(for fill 1)
    CtxtFiles[0] >> resultCtxt;

    // fill 1
    resultCtxt += fillCtxt;

    // read files and add CypherTexts
    for (long i = 1; i < sizeOfCtxtFile; i++) {
        CtxtFiles[i] >> tempCtxt;
        resultCtxt += tempCtxt;
    }

    // save result
    ZZX ptSum;
    secKey->Decrypt(ptSum, resultCtxt);
    cout << "result : " << ptSum << endl;
    resultFile << ptSum;
}