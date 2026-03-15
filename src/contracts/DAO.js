export const DAO_ABI = [
  "function proposalCount() view returns (uint256)",
  "function proposals(uint256) view returns (address,address,bytes,uint256,uint256,uint256,bool)",
  "function propose(address,bytes)",
  "function vote(uint256,bool)",
  "function execute(uint256)",
  "event ProposalCreated(uint256,address)",
  "event VoteCast(uint256,address,bool,uint256)",
  "event ProposalExecuted(uint256)"
];
