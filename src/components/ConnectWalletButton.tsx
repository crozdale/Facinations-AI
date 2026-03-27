import { useTranslation } from "react-i18next";
import { useWeb3 } from "../providers/Web3Provider";

export default function ConnectWalletButton() {
  const { t } = useTranslation();
  const { account, connect } = useWeb3();

  return (
    <button
      onClick={connect}
      className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
    >
      {account
        ? `${account.slice(0, 6)}…${account.slice(-4)}`
        : t("wallet.connect", "Connect Wallet")}
    </button>
  );
}
