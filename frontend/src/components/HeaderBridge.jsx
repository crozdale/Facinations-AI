import { useNavigate } from "react-router-dom";
import Header from "../teleport/Header";

export default function HeaderBridge() {
  const navigate = useNavigate();

  return <Header onNavigate={navigate} />;
}


