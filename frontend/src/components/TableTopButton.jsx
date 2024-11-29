import "./table-top-button.css";

export default function TableTopButton({ text, action, disabled }) {
  return (
    <button
      type="button"
      className="top-btn"
      onClick={action}
      disabled={disabled}>
      {text}
    </button>
  );
}
