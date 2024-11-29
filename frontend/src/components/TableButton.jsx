import "./table-button.css";

export default function TableButton({ action, text, disabled }) {
  return (
    <button
      type="button"
      className="table-btn"
      onClick={action}
      disabled={disabled}>
      {text}
    </button>
  );
}
