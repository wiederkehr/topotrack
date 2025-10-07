"use client";

import { useEffect } from "react";

export default function ComposerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Composer error:", error);
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "1rem" }}>Composer Error</h2>
      <p style={{ marginBottom: "1rem", color: "var(--gray-11)" }}>
        There was an error loading the composer.
      </p>
      <p
        style={{
          marginBottom: "2rem",
          fontSize: "0.875rem",
          color: "var(--gray-10)",
        }}
      >
        {error.message}
      </p>
      <button
        onClick={reset}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "0.25rem",
          border: "1px solid var(--gray-7)",
          backgroundColor: "var(--gray-3)",
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}
