export default function DataTripleStaticColumn({
  time,
  pressure1,
  pressure2,
  colWidth,
}) {
  return (
    <div className={"col-" + colWidth + " flex-column" + " " + "unit"}>
      <div className="rota-top head-row row">
        <div className="col elem-row elem">{time}</div>
      </div>
      <div className="rota-bot head-row row">
        <div className="col elem-row elem">{pressure1}</div>
      </div>
      <div className="rota-bot head-row row">
        <div className="col elem">{pressure2}</div>
      </div>
    </div>
  );
}
