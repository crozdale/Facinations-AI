import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDAO } from "../hooks/useDAO";

export default function DAOVote({ proposalId }) {
  const { t } = useTranslation();
  const { getDAO } = useDAO();
  const [status, setStatus] = useState("");

  async function vote(support) {
    try {
      const dao = await getDAO(false);
      setStatus(t("dao.voting", "Voting…"));
      const tx = await dao.vote(proposalId, support);
      await tx.wait();
      setStatus(t("dao.vote_cast", "Vote cast"));
    } catch {
      setStatus(t("dao.vote_failed", "Vote failed"));
    }
  }

  return (
    <>
      <button onClick={() => vote(true)}>{t("dao.vote_yes", "Vote YES")}</button>
      <button onClick={() => vote(false)}>{t("dao.vote_no", "Vote NO")}</button>
      {status && <span>{status}</span>}
    </>
  );
}
