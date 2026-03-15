export const GOVERNANCE_ABI = [
  "function isGovernor(address user) view returns (bool)",
  "function isEmergency(address user) view returns (bool)",
  "function registerVault(string,address,address,bool)",
  "function pauseProtocol()",
  "function unpauseProtocol()",
  "event VaultRegistered(string,address,address,bool)",
  "event ProtocolPaused(address)",
  "event ProtocolUnpaused(address)"
];
