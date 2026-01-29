"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [result, setResult] = useState<{ id: string } | null>(null);

  async function createPaste() {
    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        ttl_seconds: 300,
        max_views: 5,
      }),
    });

    const data = await res.json();
    setResult(data);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Pastebin Lite</h1>

      <textarea
        rows={8}
        style={{ width: "100%" }}
        placeholder="Paste your text here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <br /><br />

      <button onClick={createPaste}>Create Paste</button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <p>Paste created:</p>
          <a
            href={`/p/${result.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {window.location.origin}/p/{result.id}
          </a>
        </div>
      )}
    </div>
  );
}
