import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function LegalPage({ file }) {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(file)
      .then((res) => res.text())
      .then((text) =>
        setContent(
          text.replace("{{DATE}}", new Date().toLocaleDateString())
        )
      );
  }, [file]);

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px" }}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
