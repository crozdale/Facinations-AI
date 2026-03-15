import { useState } from "react";
import { ethers } from "ethers";
import { useDAO } from "../hooks/useDAO";

export default function DAOPropose() {
  const { getDAO } = useDAO();
  const [target, setTarget] = useState("");
  const [calldata, setCalldata] = useState("");
  const [status, setStatus] = useState("");

  async function submit() {
    try {
      const dao = await getDAO(false);
      setStatus("Submitting proposal…");
      const tx = await dao.propose(target, calldata);
      await tx.wait();
      setStatus("Proposal submitted");
    } catch {
      setStatus("Failed");
    }
  }

  return (
    <section>
      <h4>DAO Proposal</h4>
      <input placeholder="Target contract" onChange={e => setTarget(e.target.value)} />
      <textarea placeholder="Encoded calldata" onChange={e => setCalldata(e.target.value)} />
      <button onClick={submit}>Propose</button>
      {status && <p>{status}</p>}
    </section>
  );
}
