import "./table-side-button.css";

export default function TableSideButton({ text, action, disabled }) {
  return (
    <button
      type="button"
      onClick={action}
      className="side-btn"
      disabled={disabled}>
      {text}
    </button>
  );
}
