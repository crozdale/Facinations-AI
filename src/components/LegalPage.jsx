import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function LegalPage({ file }) {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(file)
      .then((res) => res.text())
      .then(setContent)
      .catch(() => setContent("Failed to load document."));
  }, [file]);

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px" }}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
