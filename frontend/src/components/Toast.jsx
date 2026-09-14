export function Toast({ msg, err, clearError }) {
  return (
    <>
      {msg && <aside className="toast ok">✓ {msg}</aside>}
      {err && (
        <aside className="toast bad">
          {err}
          <button onClick={clearError}>×</button>
        </aside>
      )}
    </>
  );
}
