import TableButton from "./TableButton";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

import { useState } from "react";

export default function DataTripleColumn({
  action,
  time,
  type,
  pressure1,
  pressure2,
  stateEditStart,
  rotaState,
  colWidth,
  finished,
  text,
}) {
  function handleTimeFormat(timestamp) {
    if (type === 1)
      return dayjs.unix(timestamp).format("HH" + ":" + "mm" + ":" + "ss");
    else if (type === 2 && timestamp < 3600)
      return "+" + dayjs.duration(timestamp, "seconds").format("mm:ss");
    else if (type === 2 && timestamp >= 3600)
      return "+" + dayjs.duration(timestamp, "seconds").format("HH:mm:ss");
    else return;
  }
  const canBeEdited = stateEditStart === rotaState;

  const [inputOneValue, setInputOneValue] = useState("");
  const [inputTwoValue, setInputTwoValue] = useState("");

  function handleInputOneChange(event) {
    setInputOneValue(event.target.value);
  }
  function handleInputTwoChange(event) {
    setInputTwoValue(event.target.value);
  }

  function handleConfirmClick() {
    if (type === 1) {
      action();
    } else if (type === 2) {
      action(Number(inputOneValue), Number(inputTwoValue));
    }
  }

  return (
    <div className={"col-" + colWidth + " flex-column"}>
      {/* timestamp */}

      <div className="rota-top head-row row">
        {time !== null && (
          <div className="col elem-row elem">{handleTimeFormat(time)}</div>
        )}

        {time === null && canBeEdited && (
          <div className="col elem-row elem">
            {finished != 1 && (
              <TableButton action={handleConfirmClick} text={text} />
            )}
          </div>
        )}

        {time === null && !canBeEdited && (
          <div className="col elem-row elem"></div>
        )}
      </div>

      {/* rescuer 1 */}

      <div className="rota-mid head-row row">
        {pressure1 !== null && type === 1 && (
          <div className="col elem-row elem">{pressure1}</div>
        )}

        {type === 2 && canBeEdited && (
          <div className="col elem-row elem">
            <input
              type="number"
              className="form-control"
              value={inputOneValue}
              onChange={handleInputOneChange}
            />
          </div>
        )}

        {type === 2 && !canBeEdited && (
          <div className="col elem-row elem">{pressure1}</div>
        )}
      </div>

      {/* rescuer 2 */}

      <div className="rota-bot head-row row">
        {pressure2 !== null && type === 1 && (
          <div className="col elem-row elem">{pressure2}</div>
        )}

        {type === 2 && canBeEdited && (
          <div className="col elem-row elem">
            <input
              type="number"
              className="form-control"
              value={inputTwoValue}
              onChange={handleInputTwoChange}
            />
          </div>
        )}

        {type === 2 && !canBeEdited && (
          <div className="col elem-row elem">{pressure2}</div>
        )}
      </div>
    </div>
  );
}
