pragma solidity ^0.4.21;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title 유권자리스트
 */
contract VoterList is Ownable {

    /**
     * @dev 유권자들의 주소 목록
     *      원래는 파일 시스템으로 해결하려 했으나, 불안정함을 깨닫고
     *      컨트렉트에 저장하는 것이 DApp으로서 더 낫다고 판단하여 저장하기로 결정함
     *      votedVoters : 투표를 한 유권자들의 목록
     */
    address[] internal votedVoterList;

    // totalVoterCount : (유권자 한정 선거) 유권자들의 총 합
    uint internal totalVoterCount;

    /**
     * @dev 유권자의 현재 상태
     *      None : 투표를 할 수 있는 상태
     *      VoteAble : (유권자 한정 선거) 투표를 할 수 있는 상태
     *      Voted : 투표를 완료한 상태
     */
    enum VoterState {
        None, VoteAble, Voted
    }
    mapping(address => VoterState) internal voterState;

    /**
     * @dev 유권자 리스트 검사 모디파이어
     *      유권자가 한정된 선거일 경우 유권자리스트에 있는 사람인지 검사
     */
    modifier onlyVoterListed(bool isFiniteElection) {
        if (isFiniteElection)
            require(voterState[msg.sender] == VoterState.VoteAble);
        _;
    }

    /**
     * @dev 유권자리스트에 유권자를 추가하는 메소드
     * @param _voterAddress 유권자의 주소
     * @return success 명단에 넣어지면 true, 이미 있거나 실패하면 false
     */
    function addVoterToVoterList(address _voterAddress) public onlyOwner returns (bool success) {
        if (voterState[_voterAddress] == VoterState.None) {
            voterState[_voterAddress] = VoterState.VoteAble;
            totalVoterCount++;
            success = true;
        }
    }

    /**
     * @dev 유권자리스트에 유권자를 제거하는 메소드
     * @param _voterAddress 유권자의 주소
     * @return success 유권자가 없으면 삭제하고 true, 있으면 false
     */
    function removeVoterFromVoterList(address _voterAddress) public onlyOwner returns (bool success) {
        if (voterState[_voterAddress] == VoterState.VoteAble) {
            voterState[_voterAddress] = VoterState.None;
            totalVoterCount--;
            success = true;
        }
    }

    /**
     * @dev 투표한 사람들의 주소를 리턴하는 메소드
     * @return 투표한 사람들의 주소 리스트
     */
    function getVotedVoterList() external view returns(address[]) {
        return votedVoterList;
    }

    /**
     * @dev 유권자 수가 한정된 선거일 경우, 유권자의 총 인원 수를 얻는 메소드
     * @return 유권자의 수
     */
    function getTotalVoterCount() external view returns(uint) {
        return totalVoterCount;
    }

    /**
     * @dev 유권자의 상태를 얻는 메소드
     * @return 유권자의 상태를 정수로 반환
     */
    function getVoterState(address _voterAddress) public view returns(uint) {
        return uint(voterState[_voterAddress]);
    }

    /**
     * @dev 유권자를 투표한 상태로 설정
     * @param _voterAddress 설정할 유권자
     * @return success 성공하면 true, 실패하면 false
     */
    function setVoted(address _voterAddress) internal returns (bool success) {
        votedVoterList.push(_voterAddress);
        voterState[_voterAddress] = VoterState.Voted;
        success = true;
    }
}
