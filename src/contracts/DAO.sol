// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IXER {
    function balanceOf(address) external view returns (uint256);
}

contract FacinationsDAO {
    struct Proposal {
        address proposer;
        address target;
        bytes data;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 endBlock;
        bool executed;
    }

    uint256 public proposalCount;
    uint256 public quorum;
    uint256 public votingPeriod;
    IXER public xer;

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public voted;

    event ProposalCreated(uint256 id, address proposer);
    event VoteCast(uint256 id, address voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 id);

    constructor(address _xer, uint256 _quorum, uint256 _votingPeriod) {
        xer = IXER(_xer);
        quorum = _quorum;
        votingPeriod = _votingPeriod;
    }

    function propose(address target, bytes calldata data) external {
        require(xer.balanceOf(msg.sender) > 0, "No voting power");

        proposalCount++;

        proposals[proposalCount] = Proposal({
            proposer: msg.sender,
            target: target,
            data: data,
            yesVotes: 0,
            noVotes: 0,
            endBlock: block.number + votingPeriod,
            executed: false
        });

        emit ProposalCreated(proposalCount, msg.sender);
    }

    function vote(uint256 id, bool support) external {
        Proposal storage p = proposals[id];
        require(block.number < p.endBlock, "Voting ended");
        require(!voted[id][msg.sender], "Already voted");

        uint256 weight = xer.balanceOf(msg.sender);
        require(weight > 0, "No power");

        voted[id][msg.sender] = true;

        if (support) p.yesVotes += weight;
        else p.noVotes += weight;

        emit VoteCast(id, msg.sender, support, weight);
    }

    function execute(uint256 id) external {
        Proposal storage p = proposals[id];
        require(block.number >= p.endBlock, "Voting active");
        require(!p.executed, "Executed");
        require(p.yesVotes + p.noVotes >= quorum, "No quorum");
        require(p.yesVotes > p.noVotes, "Rejected");

        p.executed = true;
        (bool ok,) = p.target.call(p.data);
        require(ok, "Execution failed");

        emit ProposalExecuted(id);
    }
}
