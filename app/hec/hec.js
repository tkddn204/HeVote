const execSync = require('child_process').execSync;
const fs = require('fs');
const config = require('../../config');

class Hec {

    /**
     * 생성자
     *
     * data 폴더와 그 폴더 안의 publicKey, secretKey, candidate, result 폴더가 있는지 없는지 검사한 후
     * 없으면 폴더를 생성함
     */
    constructor() {
        const root = config.root;
        const dataPaths = [
            `${root}/data`,
            `${root}/data/publicKey`,
            `${root}/data/secretKey`,
            `${root}/data/candidate`,
            `${root}/data/result`
        ];
        dataPaths.forEach((path) => {
            if(!fs.existsSync(path)) {
                fs.mkdirSync(path);
            }
        });
    }

    /**
     * 공개키와 비밀키 파일들을 만드는 메소드
     *
     * @param {string} o 선거 컨트렉트 주소
     * @param {int} p 후보자의 수(소수)
     * @param {int} L 레벨
     * @param {string} dir 실행 파일의 디렉토리
     * @param {function} cb exec 처리가 끝난 후의 콜백 함수
     */
    static async createKeys(o, p=13, L=3, dir, cb) {
        const command = `${config.root}/app/hec/bin/createKeys o=${o} p=${p} L=${L} dir=${dir}`;
        console.debug(command);

        let out, err;
        try {
            out = execSync(command).toString();
        } catch (error) {
            err = error;
        } finally {
            await cb(out, err);
        }
    }

    /**
     * 후보자 벡터 파일들을 만드는 메소드
     *
     * @param {string} o 선거 컨트렉트 주소
     * @param {string} v 유권자의 계정 주소
     * @param {int} t 후보자의 수
     * @param {string} dir 실행 파일의 디렉토리
     * @param {function} cb exec 처리가 끝난 후의 콜백 함수
     */
    static async encryptCandidateList(o, v, t, dir, cb) {
        const command = `${config.root}/app/hec/encryptCandidateList o=${o.toLowerCase()} v=${v.toLowerCase()} t=${t} dir=${dir}`;
        console.debug(command);

        let out, err;
        try {
            out = execSync(command).toString();
        } catch (error) {
            err = error.toString();
        } finally {
            await cb(out, err);
        }
    }

    /**
     * 투표를 최종 집계하는 메소드
     * 집계 결과를 반환함
     *
     * @param {string} o 선거 컨트렉트 주소
     * @param {int} n 후보자의 수
     * @param {string} dir 실행 파일의 디렉토리
     * @return {Array} 집계 결과
     * @param {function} cb exec 처리가 끝난 후의 콜백 함수
     */
    static async tally(o, n, dir, cb) {
        const command = `${config.root}/app/hec/tally o=${o.toLowerCase()} n=${n} dir=${dir}`;
        console.debug(command);

        let out, err;
        try {
            out = execSync(command).toString();
        } catch (error) {
            err = error.toString();
        } finally {
            await cb(out, err);
        }
    }

    /**
     * 집계 결과를 반환하는 메소드
     *
     * @param {string} o 선거 컨트렉트 주소
     */
    static getResult(o) {
        // 결과 파일 읽고 배열로 변환
        let resultFile;
        try {
            resultFile = fs.readFileSync(`${config.root}/data/result/${o.toLowerCase()}.txt`, 'utf8');
        } catch (error) {
            console.debug("file not found");
            return undefined;
        }

        const arr = Array.from(resultFile)
            .filter((value) => parseInt(value))
            .map((value) => parseInt(value)-1);
        console.debug(arr);
        return arr;
    }
}

if (typeof module !== 'undefined') {
    module.exports = new Hec()
}
