import TableButton from "./TableButton";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
import { useState } from "react";

export default function DataTripleColumn({
  action,
  time,
  pressure1,
  pressure2,
  stateEditStart,
  rotaState,
  finished,
  prevK,
  currentK,
  currentIdx,
  text,
}) {
  function handleTimeFormat(timestamp) {
    if (timestamp < 3600)
      return "+" + dayjs.duration(timestamp, "seconds").format("mm:ss");
    else if (timestamp >= 3600)
      return "+" + dayjs.duration(timestamp, "seconds").format("HH:mm:ss");
  }
  const sectionKEditable = stateEditStart === rotaState;

  function singleKEditable() {
    if (
      currentIdx == 0 &&
      prevK == undefined &&
      !currentK &&
      sectionKEditable
    ) {
      return true;
    } else if (currentIdx && prevK && !currentK && sectionKEditable) {
      return true;
    } else {
      return false;
    }
  }

  const [inputOneValue, setInputOneValue] = useState("");
  const [inputTwoValue, setInputTwoValue] = useState("");

  function handleInputOneChange(event) {
    setInputOneValue(event.target.value);
  }
  function handleInputTwoChange(event) {
    setInputTwoValue(event.target.value);
  }

  function handleConfirmClick() {
    action(Number(inputOneValue), Number(inputTwoValue));
  }

  return (
    <div className={"col flex-column"}>
      {/* timestamp */}

      <div className="rota-top head-row row">
        {time !== null && (
          <div className="col elem-row elem">{handleTimeFormat(time)}</div>
        )}

        {time === null && singleKEditable() && (
          <div className="col elem-row elem">
            {finished != 1 && (
              <TableButton action={handleConfirmClick} text={text} />
            )}
          </div>
        )}

        {time === null && !singleKEditable() && (
          <div className="col elem-row elem"></div>
        )}
      </div>

      {/* rescuer 1 */}

      <div className="rota-mid head-row row">
        {sectionKEditable && singleKEditable() && (
          <div className="col elem-row elem">
            <input
              type="number"
              className="form-control"
              value={inputOneValue}
              onChange={handleInputOneChange}
            />
          </div>
        )}

        {!singleKEditable() && (
          <div className="col elem-row elem">{pressure1}</div>
        )}
      </div>

      {/* rescuer 2 */}

      <div className="rota-bot head-row row">
        {sectionKEditable && singleKEditable() && (
          <div className="col elem-row elem">
            <input
              type="number"
              className="form-control"
              value={inputTwoValue}
              onChange={handleInputTwoChange}
            />
          </div>
        )}

        {!singleKEditable() && (
          <div className="col elem-row elem">{pressure2}</div>
        )}
      </div>
    </div>
  );
}
