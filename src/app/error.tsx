"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error("Application error:", error);
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "1rem" }}>Something went wrong</h2>
      <p style={{ marginBottom: "2rem", color: "var(--gray-11)" }}>
        An unexpected error occurred. Please try again.
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
