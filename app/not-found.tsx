// This is the global catch-all not-found page rendered OUTSIDE the [locale] tree.
// It intentionally has no translations since no locale context is available here.
// It handles cases like /invalid-path that never reaches the [locale] segment at all.
import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "sans-serif",
          gap: "1rem",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <h1 style={{ fontSize: "4rem", fontWeight: "bold" }}>404</h1>
        <h2 style={{ fontSize: "1.5rem" }}>Page not found</h2>
        <p style={{ color: "#6b7280" }}>
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1.5rem",
            background: "#000",
            color: "#fff",
            borderRadius: "0.375rem",
            textDecoration: "none",
          }}
        >
          Back to Home
        </Link>
      </body>
    </html>
  );
}
