export default function Combatlog({ events }) {
  return (
    <div style={{ display: 'flex', marginTop: '50px', textAlign: 'left' }}>
      <pre>{events.map((event) => `${JSON.stringify(event)}\n`)}</pre>
    </div>
  );
}
