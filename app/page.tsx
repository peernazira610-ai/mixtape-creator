"use client";
export default function Home() {
  return (
    <main
      style={{
        backgroundColor: "#d8edf6",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.15)",
backdropFilter: "blur(20px)",
border: "1px solid rgba(255,255,255,0.3)",
          padding: "40px",
          borderRadius: "20px",
          textAlign: "center",
          boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
        }}
      >
        <h1 style={{ fontSize: "40px" }}>🎵 Mixtape For You</h1>

        <p>Create your own aesthetic cassette mixtape.</p>

        <button
  onClick={() => window.location.href = "/create"}
          style={{
            marginTop: "20px",
            padding: "15px 30px",
            background: "#5eaad6",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          Create Mixtape
        </button>
      </div>
    </main>
  );
}