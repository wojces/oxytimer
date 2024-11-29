export default function DataTripleStaticColumn({
  time,
  pressure1,
  pressure2,
  colWidth,
  warning,
}) {
  let warningStyle = {
    backgroundColor: "",
    fontWeight: "",
  };

  if (warning == 1) {
    warningStyle.backgroundColor = "#ffcc00";
    warningStyle.fontWeight = 700;
  } else if (warning == 2) {
    warningStyle.backgroundColor = "#cc3300";
    warningStyle.fontWeight = 700;
  } else {
    warningStyle.backgroundColor = "";
  }

  return (
    <div className={"col-" + colWidth + " flex-column"} style={warningStyle}>
      <div className="rota-top head-row row">
        <div className="col elem-row elem">{time}</div>
      </div>
      <div className="rota-bot head-row row">
        <div className="col elem-row elem">{pressure1}</div>
      </div>
      <div className="rota-bot head-row row">
        <div className="col elem elem-row">{pressure2}</div>
      </div>
    </div>
  );
}
