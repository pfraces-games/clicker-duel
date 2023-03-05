export default function Combatlog({ combatlog, enemy }) {
    return (
      <div style={{ display: "flex", marginTop: "50px", textAlign: "left" }}>
        <pre style={{ marginLeft: "50px" }}>{JSON.stringify(enemy, null, 2)}</pre>
        <pre style={{ marginLeft: "50px" }}>
          {combatlog.map((entry) => `${JSON.stringify(entry)}\n`)}
        </pre>
      </div>
    );
  }
  