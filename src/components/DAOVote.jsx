import { useState } from "react";
import { useDAO } from "../hooks/useDAO";

export default function DAOVote({ proposalId }) {
  const { getDAO } = useDAO();
  const [status, setStatus] = useState("");

  async function vote(support) {
    try {
      const dao = await getDAO(false);
      setStatus("Voting…");
      const tx = await dao.vote(proposalId, support);
      await tx.wait();
      setStatus("Vote cast");
    } catch {
      setStatus("Vote failed");
    }
  }

  return (
    <>
      <button onClick={() => vote(true)}>Vote YES</button>
      <button onClick={() => vote(false)}>Vote NO</button>
      {status && <span>{status}</span>}
    </>
  );
}
