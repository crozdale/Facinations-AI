import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ethers } from "ethers";
import { useDAO } from "../hooks/useDAO";

export default function DAOPropose() {
  const { t } = useTranslation();
  const { getDAO } = useDAO();
  const [target, setTarget] = useState("");
  const [calldata, setCalldata] = useState("");
  const [status, setStatus] = useState("");

  async function submit() {
    try {
      const dao = await getDAO(false);
      setStatus(t("dao.submitting_proposal", "Submitting proposal…"));
      const tx = await dao.propose(target, calldata);
      await tx.wait();
      setStatus(t("dao.proposal_submitted", "Proposal submitted"));
    } catch {
      setStatus(t("dao.failed", "Failed"));
    }
  }

  return (
    <section>
      <h4>{t("dao.proposal_title", "DAO Proposal")}</h4>
      <input placeholder={t("dao.target_placeholder", "Target contract")} onChange={e => setTarget(e.target.value)} />
      <textarea placeholder={t("dao.calldata_placeholder", "Encoded calldata")} onChange={e => setCalldata(e.target.value)} />
      <button onClick={submit}>{t("dao.btn_propose", "Propose")}</button>
      {status && <p>{status}</p>}
    </section>
  );
}
