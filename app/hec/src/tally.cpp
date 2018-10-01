#include <cstring>
#include <fstream>
#include <unistd.h>
#include <sys/types.h>
#include <dirent.h>
#include <errno.h>
#include <cstring>

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

    // get Ctxt files
    getdir(directoryPathWithCtxt, fileNames);
    const long sizeOfCtxtFile = fileNames.size();
    if(sizeOfCtxtFile == 0) {
        string res = "[";
        for (int i = 0; i < numberOfCandidates; i++) {
            res.append(to_string(i));
            if(i != numberOfCandidates-1) res.append(",");
        }
        res.append("]");

        resultFile << res;
        return 0;
    }

    // get public key
    const string secretKeyBinaryFilePath = directoryPath + "/secretKey/" + owner + ".bin";
    ifstream secretBinFile(secretKeyBinaryFilePath.c_str(), ios::binary);
    assert(secretBinFile.is_open());

    // set resultFile
    const string resultFilePath = directoryPath + "/result/" + owner + ".txt";
    ofstream resultFile(resultFilePath.c_str(), ios::binary);
    assert(resultFile.is_open());

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
    // Got to insert pubKey into seckey obj first.
    std::unique_ptr <FHESecKey> secKey(new FHESecKey(*context));
    FHEPubKey *pubKey = (FHEPubKey *) secKey.get();

    // read publicKey
    readPubKeyBinary(secretBinFile, *pubKey);
    readSecKeyBinary(secretBinFile, *secKey);

    // close secreyKey file
    secretBinFile.close();

    cout << "read PublicKey & SecretKey successful.\n" << flush;


    // ready to add two Ctxts
    // get Ctxt to file
    Ctxt resultCtxt(*pubKey), secondCtxt(*pubKey), tempCtxt(*pubKey);

    // fill 1 to tempCtxt
    Vec <ZZ> tempPoly;
    tempPoly.SetLength(numberOfCandidates);

    // set poly
    for (long i = 0; i < numberOfCandidates; i++) tempPoly[i] = 1;

    // encrypt poly
    pubKey->Encrypt(tempCtxt, to_ZZX(tempPoly));

    // add files
    ZZX tempCtxtZZX;
    ostringstream cTxtStream;


    CtxtFiles[0] >> resultCtxt;
    cTxtStream << resultCtxt;
    secKey->Decrypt(tempCtxtZZX, resultCtxt);

    cout << "\n" << fileNames[0] << endl;
    cout << "CypherText: " << cTxtStream.str().substr(0, 20)
        << " ... " << cTxtStream.str().substr(cTxtStream.str().size() - 63, 50) << endl;
    cout << "PlainText: " << tempCtxtZZX << endl;
    cout << "\n+\n" << endl;

    for (long i = 1; i < sizeOfCtxtFile; i++) {
        CtxtFiles[i] >> secondCtxt;
        resultCtxt += secondCtxt;
        cTxtStream << secondCtxt;
        secKey->Decrypt(tempCtxtZZX, secondCtxt);

        cout << fileNames[i] << endl;
        cout << "CypherText: " << cTxtStream.str().substr(0, 20)
             << " ..." << cTxtStream.str().substr(cTxtStream.str().size() - 63, 50) << endl;
        cout << "PlainText:" << tempCtxtZZX << endl;
        if(i != sizeOfCtxtFile-1) cout << "\n+\n" << endl;
    }
    cout << "\n=\n" << endl;

    // save result
    ZZX ptSum;
    cTxtStream << resultCtxt;
    secKey->Decrypt(ptSum, resultCtxt);

    cout << " [ tally result ]" << endl;
    cout << "CypherText: " << cTxtStream.str().substr(0, 20)
         << " ..." << cTxtStream.str().substr(cTxtStream.str().size() - 63, 50) << endl;
    cout << "PlainText: " << ptSum << endl;

    // last elements +1
    resultCtxt += tempCtxt;
    secKey->Decrypt(ptSum, resultCtxt);

    // save result to file
    resultFile << ptSum;
}