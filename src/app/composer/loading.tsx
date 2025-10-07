"use client";

export default function ComposerLoading() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "2rem",
            height: "2rem",
            border: "2px solid var(--gray-7)",
            borderTopColor: "var(--accent-9)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1rem",
          }}
        />
        <p style={{ color: "var(--gray-11)" }}>Loading composer...</p>
      </div>
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
