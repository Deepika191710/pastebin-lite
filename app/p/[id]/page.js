"use client";

import { useEffect, useState, use } from "react";

export default function PastePage({ params }) {
  const { id } = use(params); // ✅ THIS FIXES THE ERROR

  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPaste() {
      const res = await fetch(`/api/pastes/${id}`);
      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Paste not found");
        return;
      }

      setData(result);
    }

    loadPaste();
  }, [id]);

  if (error) return <h2>{error}</h2>;
  if (!data) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Paste</h2>

      <textarea
        value={data.content}
        readOnly
        rows={10}
        style={{ width: "100%" }}
      />

      <p>Remaining views: {data.remainingViews}</p>
    </div>
  );
}
