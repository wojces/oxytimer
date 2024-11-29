import "./table-action-button.css";

export default function TableActionButton({ action, text, disabled }) {
  return (
    <button
      type="button"
      className="action-btn "
      onClick={action}
      disabled={disabled}>
      {text}
    </button>
  );
}
