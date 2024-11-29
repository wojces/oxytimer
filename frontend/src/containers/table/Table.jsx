import "./table.css";
import AddRotaModal from "./AddRotaModal";
import DataTripleColumn from "../../components/DataTripleColumn";
import DataTripleColumnK from "../../components/DataTripleColumnK";
import DataTripleStaticColumn from "../../components/DataTripleStaticColumn";
import DataTripleEstimatingColumn from "../../components/DataTripleEstimatingColumn";
import TableButton from "../../components/TableButton";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { toast } from "react-toastify";

import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Overlay, Tooltip } from "react-bootstrap";
import {
  rotaTimeIn,
  rotaTimeK,
  rotaTimeOut,
  rotaPressureK,
  rotaPressureOut,
  removeRota,
  saveTable,
  finishTable,
  printTable,
  saveToPdf,
  fetchSingleTable,
  clearTable,
  rotaAddK,
  updateInspection,
  trimUnusedK,
  addAvgPressureConsumption,
  updateAlarmCanPlay,
  rotaExitTime,
} from "../../features/table/tableSlice";
import { updateCurrentTime } from "../../features/time/timeSlice";
import { fetchRescuers } from "../../features/rescuers/rescuerSlice";
import { fetchUser } from "../../features/user/userSlice";
import { setCurrentView } from "../../features/app/appSlice";
import CloseTableModal from "./CloseTableModal";
import EndModal from "./EndModal";
import InspectionModal from "./InspectionModal";
import PrintTableModal from "./PrintTableModal";

export default function Table() {
  const dispatch = useDispatch();
  const [addRotaModal, setAddRotaModal] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [endModal, setEndModal] = useState(false);
  const [printTableModal, setPrintTableModal] = useState(false);
  const [inspectionModal, setInspectionModal] = useState({
    active: false,
    rotaIndex: null,
  });
  const [ritIsActive, setRitIsActive] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const table = useSelector((state) => state.table.table);
  const date = dayjs().format("DD" + "." + "MM" + "." + "YYYY");
  const time = useSelector((state) => state.time.time);
  let timeInterval;

  dayjs.extend(duration);

  const rescuers = useSelector((state) => state.rescuer.rescuers);
  const userData = useSelector((state) => state.user.user);

  const ritExist = table.rotaList.some((rota) => rota?.name === "RIT");

  // podświetlenie nagłówków tabeli
  const [showTooltip, setShowTooltip] = useState(false);
  const [target, setTarget] = useState(null);
  const [tooltipText, setTooltipText] = useState("");
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const handleMouseEnter = (event, text) => {
    const targetElement = event.target;
    setHoverTimeout(
      setTimeout(() => {
        setTooltipText(text);
        setTarget(targetElement);
        setShowTooltip(true);
      }, 500)
    );
  };
  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
    setShowTooltip(false);
  };

  // zmienne do obliczania pól w tabeli dla roty
  const staticAvgPressureConsumption = 10;
  const pressureReserve = 50;
  const timeIn = (index) => table.rotaList[index]?.timestamps.IN;
  const timeOut = (index) => table.rotaList[index]?.timestamps.OUT;
  const timeLastK = (index) =>
    table.rotaList[index]?.timestamps.k.filter((el) => el !== null).at(-1);
  const pressureIn = (index, rescuerIndex) =>
    table.rotaList[index]?.rescuers[rescuerIndex]?.IN;
  const pressureLastK = (index, rescuerIndex) =>
    table.rotaList[index]?.rescuers[rescuerIndex]?.k
      .filter((el) => el !== null)
      .at(-1);

  // funkcja sprawdzająca czy rota miała kontrole ciśnienia
  const isKEmpty = (index) =>
    !table.rotaList[index].timestamps.k.some((el) => el !== null);

  // średnie zużycie ciśnienia
  const avgPressureConsumption = (index) => {
    return table.rotaList[index]?.avgPressureConsumption.at(-1);
  };

  // funkcja licząca średnie zużycie ciśnienia
  const countAvgPressureConsumption = (pressure, time) => {
    return parseInt(Number(pressure / time).toFixed(2));
    //cisnienie w barach, czas w minutach
  };

  // ciśnienie do wykorzystania
  const pressureToUse = (index, rescuerIndex) => {
    if (isKEmpty(index)) {
      return pressureIn(index, rescuerIndex) - pressureReserve;
    } else if (!isKEmpty(index)) {
      return pressureLastK(index, rescuerIndex) - pressureReserve;
    }
  };

  // funkcja zwracająca pozostałe ciśnienie (z rezerwą 50 Bar)
  function toUsePressureCount(index, rescuerIndex) {
    const rotaTimeOut = timeOut(index);
    const rotaTimeIn = timeIn(index);
    const rotaPressureToUse = pressureToUse(index, rescuerIndex);

    let countedPressureToUse;
    let currentPressureConsumption;
    const isSecondKNUll = table.rotaList[index]?.timestamps.k[1] === null;
    const pressurePreviousLastK = table.rotaList[index]?.rescuers[
      rescuerIndex
    ]?.k
      .filter((el) => el !== null)
      .at(-2);
    const timePreviousLastK = table.rotaList[index]?.timestamps.k
      .filter((el) => el !== null)
      .at(-2);

    if (isKEmpty(index)) {
      currentPressureConsumption = avgPressureConsumption(index);
      countedPressureToUse =
        rotaPressureToUse -
        (time - rotaTimeIn) * (currentPressureConsumption / 60);
    } else if (!isKEmpty(index) && isSecondKNUll) {
      currentPressureConsumption = countAvgPressureConsumption(
        pressureIn(index, rescuerIndex) - pressureLastK(index, rescuerIndex),
        (timeLastK(index) - timeIn(index)) / 60
      );
      countedPressureToUse =
        rotaPressureToUse -
        (time - timeLastK(index)) * (currentPressureConsumption / 60);
    } else if (!isKEmpty(index) && !isSecondKNUll) {
      currentPressureConsumption = countAvgPressureConsumption(
        pressurePreviousLastK - pressureLastK(index, rescuerIndex),
        (timeLastK(index) - timePreviousLastK) / 60
      );
      countedPressureToUse =
        rotaPressureToUse -
        (time - timeLastK(index)) * (currentPressureConsumption / 60);
    }

    // if (countedPressureToUse < 0) return 0;

    if (rotaTimeIn !== null && rotaTimeOut === null) {
      return Math.round(countedPressureToUse);
    } else if (rotaTimeIn !== null && rotaTimeOut !== null) {
      return;
    } else if (rotaTimeIn === null) {
      return;
    }
  }

  // Czas do wykorzystania
  const timeToUse = (index) =>
    pressureToUse(index, 0) <= pressureToUse(index, 1)
      ? (60 * pressureToUse(index, 0)) / avgPressureConsumption(index)
      : (60 * pressureToUse(index, 1)) / avgPressureConsumption(index);

  //Szacowany czas wyjścia ze strefy zagrożenia
  const exitTime = (index) => {
    if (isKEmpty(index)) {
      return Math.round(timeIn(index) + timeToUse(index));
    } else if (!isKEmpty(index)) {
      return Math.round(timeLastK(index) + timeToUse(index));
    }
  };

  // Funkcja zwracająca pozostały czas roty
  function toUseTimerCount(index) {
    const rotaTimeOut = timeOut(index);
    const rotaTimeIn = timeIn(index);
    const rotaTimeToUse = timeToUse(index);
    const rotaTimeLastK = timeLastK(index);

    let countedTimeToUse;

    if (isKEmpty(index)) {
      countedTimeToUse = rotaTimeIn + rotaTimeToUse - time;
    } else if (!isKEmpty(index)) {
      countedTimeToUse = rotaTimeLastK + rotaTimeToUse - time;
    }

    if (countedTimeToUse < 0) return "00:00";

    if (rotaTimeIn !== null && rotaTimeOut === null) {
      return dayjs.duration(countedTimeToUse, "seconds").format("HH:mm:ss");
    } else if (rotaTimeIn !== null && rotaTimeOut !== null) {
      return;
    } else if (rotaTimeIn === null) {
      return;
    }
  }

  // Licznik zegara
  function updateTime() {
    timeInterval = setInterval(
      () => dispatch(updateCurrentTime(dayjs().unix())),
      1000
    );
    return timeInterval;
  }

  // Licznik czasu roty
  function rotaTimerCount(index) {
    const rotaOut = table.rotaList[index].timestamps.OUT;
    const rotaIn = table.rotaList[index].timestamps.IN;

    const liveTimer = dayjs().unix() - rotaIn;
    const endTimer = rotaOut - rotaIn;

    if (rotaIn !== null && rotaOut === null) {
      return dayjs.duration(liveTimer, "seconds").format("HH:mm:ss");
    } else if (rotaIn !== null && rotaOut !== null) {
      return dayjs.duration(endTimer, "seconds").format("HH:mm:ss");
    } else if (rotaIn === null) {
      return;
    }
  }

  // Funkcja zwracająca czas wyjścia
  function handleDisplayExitTime(index) {
    const rotaTimeOut = timeOut(index);
    const rotaTimeIn = timeIn(index);

    if (rotaTimeIn && !rotaTimeOut) {
      return dayjs.unix(exitTime(index)).format("HH" + ":" + "mm" + ":" + "ss");
    } else if (rotaTimeIn && rotaTimeOut) {
      return dayjs
        .unix(table.rotaList[index].timestamps.estimatedExitTime)
        .format("HH" + ":" + "mm" + ":" + "ss");
    } else return;
  }

  //Ostrzeżenie i alarmy dźwiękowe
  const [volume, setVolume] = useState(0.1);
  const fiveMinAlarm = new Audio("/audio/fiveMinAlert.mp3");
  const twoMinAlarm = new Audio("/audio/twoMinAlert.mp3");
  fiveMinAlarm.volume = volume;
  twoMinAlarm.volume = volume;

  let alarmCanPlay = table.rotaList.map((el) => el.alarmCanPlay);

  const showMuteButton = alarmCanPlay.some((alarm) =>
    alarm.some((el) => el === true)
  );

  // Funkcja zarządzająca alarmami
  function timeWarningController() {
    //sprawdzam czy rota weszła w case alarmu 1 lub 2
    //dostaje [rotaIndex, 1 lub 2]
    const rotaInitState = table.rotaList
      .map((elem, index) => handleTimeWarning(index))
      .filter((el) => el[1] === 1 || el[1] === 2);

    //sprawdzam czy rota weszła w case mute 3
    //dostaje [rotaIndex, 3]
    const rotaReverseState = table.rotaList
      .map((elem, index) => handleTimeWarning(index))
      .filter((el) => el[1] === 3);

    //kopiuje stan alarmu do edycji
    const newRotaAlertStates = JSON.parse(JSON.stringify(alarmCanPlay));
    let shouldUpdate = false;

    //dla kazdej roty co wejdzie w case 3 ustawiam stan alarmu na false
    for (let [rotaIndex] of rotaReverseState) {
      newRotaAlertStates[rotaIndex] = [...newRotaAlertStates[rotaIndex]];
      newRotaAlertStates[rotaIndex][0] = false;
      newRotaAlertStates[rotaIndex][1] = false;

      if (
        newRotaAlertStates[rotaIndex][0] !== alarmCanPlay[rotaIndex][0] ||
        newRotaAlertStates[rotaIndex][1] !== alarmCanPlay[rotaIndex][1]
      ) {
        dispatch(updateAlarmCanPlay(newRotaAlertStates));
      }
    }

    //dla kazdej roty co wejdzie w case 1 lub 2, ustawiam true zeby alarm grał
    for (let [rotaIndex, ctTimeState] of rotaInitState) {
      //przypadek 1 - nie grala i ma zaczac grac
      if (newRotaAlertStates[rotaIndex][ctTimeState - 1] === false) {
        newRotaAlertStates[rotaIndex][ctTimeState - 1] = true;
        //jak zaczyna grac to drugą co grała wyłączam
        if (ctTimeState - 1 === 0) {
          newRotaAlertStates[rotaIndex][1] = false;
        } else if (ctTimeState - 1 === 1) {
          newRotaAlertStates[rotaIndex][0] = false;
        }
        //zezwalam na update stanu
        shouldUpdate = true;
      }
      //przypadek 2 - była wyciszona i ma zacząć grać
      else if (
        newRotaAlertStates[rotaIndex][ctTimeState - 1] === null &&
        newRotaAlertStates[rotaIndex][ctTimeState - 1] !==
          alarmCanPlay[rotaIndex][ctTimeState - 1]
      ) {
        newRotaAlertStates[rotaIndex][ctTimeState - 1] = true;
        //zezwalam na update stanu
        shouldUpdate = true;
      }
    }

    //robie update stanu
    if (shouldUpdate && rotaInitState.length) {
      dispatch(updateAlarmCanPlay(newRotaAlertStates));
    }

    //sprawdzam ktory alarm ma grac w zaleznosci od case 1 lub 2
    if (newRotaAlertStates.find((elem) => elem[1]) && rotaInitState.length) {
      twoMinAlarm.currentTime = 0;
      twoMinAlarm.play();
    } else if (
      newRotaAlertStates.find((elem) => elem[0]) &&
      rotaInitState.length
    ) {
      fiveMinAlarm.currentTime = 0;
      fiveMinAlarm.play();
    }
  }
  timeWarningController();

  // Wyciszenie alarmów
  function muteAlarm() {
    const alarmsToMute = alarmCanPlay.map((elem) =>
      elem.map((value) => (value === true ? null : value))
    );
    dispatch(updateAlarmCanPlay(alarmsToMute));
  }

  // Wyłączenie alarmów
  function clearMuteButton(index) {
    const clearAlarms = alarmCanPlay.map((elem, idx) => {
      if (idx === index) {
        return elem.map((value) =>
          value === true || value === null ? false : value
        );
      }
      return elem;
    });
    dispatch(updateAlarmCanPlay(clearAlarms));
  }

  // Funkcja zarządzająca ostrzeżeniami w zależności od pozostałego czasu
  function handleTimeWarning(index) {
    const previousState = alarmCanPlay[index];
    const rotaTimeIn = timeIn(index);
    const rotaTimeOut = timeOut(index);
    const rotaTimeToUse = timeToUse(index);
    const rotaTimeLastK = timeLastK(index);

    let countedTime;

    //poprawic zgodnie z pozostalym czasem
    if (isKEmpty(index)) {
      countedTime = rotaTimeIn + rotaTimeToUse - time;
    } else if (!isKEmpty(index)) {
      countedTime = rotaTimeLastK + rotaTimeToUse - time;
    }

    if (countedTime <= 300 && countedTime > 120 && rotaTimeOut == null) {
      return [index, 1];
    } else if (countedTime <= 120 && countedTime > 0 && rotaTimeOut == null) {
      return [index, 2];
    } else if (
      countedTime > 300 &&
      (previousState[0] === null || true || previousState[1] === null || true)
    ) {
      return [index, 3];
    } else {
      return [index, 0];
    }
  }

  // Tabela wykorzystanych ratowników
  let usedRescuers = [];
  function findUsedRescuers() {
    table.rotaList.forEach((rota) => {
      let rescuerOneArray = parseInt(rota.rescuers[0].rescuerId);
      let rescuerTwoArray = parseInt(rota.rescuers[1].rescuerId);
      usedRescuers.push(rescuerOneArray, rescuerTwoArray);
    });
  }
  findUsedRescuers();

  // Sprawdzenie możliwości zakończenia akcji
  function endPossibility() {
    const endStatus = table.rotaList.some((rota) => rota.currentState === 3);
    const activeStatus = table.rotaList.some((rota) => rota.currentState == 2);

    if (endStatus && !activeStatus && table.finished == 0) return true;
    else return false;
  }

  // Zakończenie akcji
  async function handleFinishTable() {
    try {
      await dispatch(saveTable());
      await finishTable(table.idTable);
      await setEndModal(false);
      await setLoading(true);
      await saveToPdf(table.idTable);
      await setPrintTableModal(true);
      await dispatch(fetchSingleTable(table.idTable));
      await setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  // Zamknięcie tabeli
  function handleCloseTable() {
    if (table.finished == 1) {
      dispatch(clearTable());
      dispatch(setCurrentView("NewTable"));
      navigate("/");
    } else if (table.finished == 0) {
      setCloseModal(true);
    }
  }

  // Ustawienia Routingu tabeli
  const { id } = useParams();

  function checkId(value) {
    if (typeof value !== "number") {
      return false;
    }
    if (!Number.isInteger(value)) {
      return false;
    }
    if (value <= 0) {
      return false;
    }
    return true;
  }

  function fetchTableByPath(pathId) {
    if (checkId(Number(pathId))) {
      dispatch(fetchSingleTable(pathId))
        .unwrap()
        .then((result) => {
          if (result === 404) {
            navigate("/tables");
          }
        });
    } else {
      navigate("/tables");
    }
  }

  // console.log(table.rotaList);

  useEffect(() => {
    dispatch(fetchRescuers());
    dispatch(fetchUser());
    updateTime();
    fetchTableByPath(id);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <div className="container-fluid text-center">
      {loading && (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      <Overlay target={target} show={showTooltip} placement="top">
        {(props) => (
          <Tooltip id="overlay-example" {...props}>
            {tooltipText}
          </Tooltip>
        )}
      </Overlay>
      <AddRotaModal
        modalIsVisible={addRotaModal}
        closeModal={() => {
          setAddRotaModal(false);
          setRitIsActive(false);
        }}
        rit={ritIsActive}
        ritExist={ritExist}
        rescuersArray={rescuers}
        usedRescuers={usedRescuers}
      />
      {table.finished == 0 && (
        <CloseTableModal
          modalIsVisible={closeModal}
          closeModal={() => setCloseModal(false)}
        />
      )}
      <EndModal
        modalIsVisible={endModal}
        closeModal={() => setEndModal(false)}
        finishTable={handleFinishTable}
      />
      <PrintTableModal
        modalIsVisible={printTableModal}
        closeModal={() => setPrintTableModal(false)}
        printTable={() => printTable(table.idTable)}
      />
      <InspectionModal
        modalIsVisible={inspectionModal.active}
        closeModal={() => {
          setInspectionModal({
            ...inspectionModal,
            active: false,
            rotaIndex: null,
          });
          dispatch(saveTable());
        }}
        inspection={() => table.rotaList[inspectionModal.rotaIndex]?.inspection}
        updateInspection={(selectedInspection, inspectionStatus) => {
          if (table.finished == 1) return;
          if (table.rotaList[inspectionModal.rotaIndex].currentState != 1)
            return;
          dispatch(
            updateInspection(
              inspectionModal.rotaIndex,
              selectedInspection,
              inspectionStatus
            )
          );
        }}
      />

      <div className="sticky-head">
        {/* Górny nagłówek tablicy z zegarem, przyciskami i info */}

        <div className="upper-head row">
          <div className="top-timer col-3">
            <div className="head-row row flex-column">
              <div className="col-4 fs-6">{date}</div>
              <div className="col-8">
                {dayjs.unix(time).format("HH" + ":" + "mm" + ":" + "ss")}
              </div>
            </div>
          </div>
          {table.finished !== 1 && (
            <div className="top-buttons col-4">
              <div className="head-row row">
                <div className="col">
                  <TableButton
                    text={"Dodaj rotę"}
                    action={() => {
                      setAddRotaModal(true);
                    }}
                  />
                </div>
                <div className="col">
                  <TableButton
                    text={"Zapisz tablicę"}
                    action={() => {
                      dispatch(saveTable());
                      toast.success("Pomyślnie zapisano tabele", {
                        position: "bottom-center",
                        autoClose: 1000,
                        closeOnClick: true,
                        pauseOnHover: false,
                        pauseOnFocusLoss: false,
                        theme: "light",
                      });
                    }}
                  />
                </div>
              </div>
              <div className="head-row row">
                <div className="col">
                  <TableButton
                    text={"Dodaj RIT"}
                    action={() => {
                      setRitIsActive(true);
                      setAddRotaModal(true);
                    }}
                    disabled={ritExist}
                  />
                </div>
                <div className="col">
                  <TableButton
                    text={"Zamknij tablicę"}
                    action={() => {
                      handleCloseTable();
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          {table.finished === 1 && (
            <div className="top-buttons col-4">
              <div className="head-row row">
                <div className="col">
                  <TableButton
                    text={"Drukuj wynik"}
                    action={() => {
                      printTable(table.idTable);
                    }}
                    disabled={table.finished != 1}
                  />
                </div>
                <div className="col">
                  <TableButton
                    text={"Zamknij tablicę"}
                    action={() => {
                      handleCloseTable();
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="top-data col-4">
            <div className="col-10 desc">
              <p>Nazwa: {table.name}</p>
              <p>Lokalizacja: {table.location}</p>
              <p>
                Data:{" "}
                {dayjs(table.createdAt).format(
                  "DD" + "." + "MM" + "." + "YYYY"
                )}
              </p>
              <p>Kontroler: {userData.first_name + " " + userData.last_name}</p>
            </div>
            <div className="col-2 mute">
              {showMuteButton && (
                <TableButton
                  text={<i className="bi bi-volume-mute-fill"></i>}
                  action={() => {
                    muteAlarm();
                  }}
                />
              )}
            </div>
          </div>
          <div className="top-end col-1">
            {table.finished == 0 && (
              <>
                <p className="mb-2">Aktywna</p>
              </>
            )}
            {endPossibility() && (
              <TableButton
                text={"Zakończ akcję"}
                action={() => {
                  setEndModal(true);
                }}
              />
            )}
            {table.finished == 1 && (
              <>
                <p>Zakończona</p>
                <p>
                  {dayjs(table.finishedAt).format(
                    "DD" + "." + "MM" + "." + "YYYY"
                  )}
                </p>
                <p> {dayjs(table.finishedAt).format("HH" + ":" + "mm")}</p>
              </>
            )}
          </div>
        </div>
        {/* Dolny nagłówek tablicy z opisami kolumn */}

        <div className="table-head row">
          <div className="section-one col-3">
            <div className="head-row row">
              <div
                className="col-2  elem"
                onMouseEnter={(e) => handleMouseEnter(e, "Rota")}
                onMouseLeave={handleMouseLeave}>
                R
              </div>
              <div
                className="col-10 elem"
                onMouseEnter={(e) =>
                  handleMouseEnter(e, "Ratownicy przypisani do roty")
                }
                onMouseLeave={handleMouseLeave}>
                Ratownicy
              </div>
            </div>
          </div>
          <div className="section-two col-2">
            <div className="head-row row">
              <div
                onMouseEnter={(e) =>
                  handleMouseEnter(e, "Obecne ciśnienie ratownika")
                }
                onMouseLeave={handleMouseLeave}
                className="col-4 h-100 elem">
                ob. cis.
              </div>
              <div
                className="col-2 h-100 elem"
                onMouseEnter={(e) => handleMouseEnter(e, "Jednostka miary")}
                onMouseLeave={handleMouseLeave}>
                j.m.
              </div>
              <div
                className="col-6 h-100 elem"
                onMouseEnter={(e) =>
                  handleMouseEnter(e, "Wejście do strefy zagrożenia")
                }
                onMouseLeave={handleMouseLeave}>
                wejście
              </div>
            </div>
          </div>
          <div className="section-three col-2">
            <div className="head-row row">
              <div
                className="col-12 h-100 elem"
                onMouseEnter={(e) =>
                  handleMouseEnter(e, "Kontrola ciśnienia roty")
                }
                onMouseLeave={handleMouseLeave}>
                kontrola
              </div>
            </div>
          </div>
          <div className="section-four col-4">
            <div className="head-row row">
              <div
                className="col h-100 elem"
                onMouseEnter={(e) =>
                  handleMouseEnter(e, "Wyjście ze strefy zagrożenia")
                }
                onMouseLeave={handleMouseLeave}>
                wyjście
              </div>
              <div
                className="col h-100 elem"
                onMouseEnter={(e) =>
                  handleMouseEnter(
                    e,
                    "Szacowana godzina wyjścia ze strefy zagrożenia"
                  )
                }
                onMouseLeave={handleMouseLeave}>
                szac. wyj.
              </div>
              <div
                className="col h-100 elem"
                onMouseEnter={(e) =>
                  handleMouseEnter(
                    e,
                    <>
                      Czas i ciśnienie do wykorzystania
                      <br />
                      (z rezerwą 50 Bar)
                    </>
                  )
                }
                onMouseLeave={handleMouseLeave}>
                do wyk.
              </div>
            </div>
          </div>
          <div className="section-five col-1">Działania</div>
        </div>
      </div>
      {/* Główna część tablicy, lista rot biorących udział w akcji */}

      <div className="table-rota-container">
        {table?.rotaList?.map((rota, index) => (
          <div
            className={`table-rota row ${ritExist ? "rit" : ""}`}
            key={rota.name}>
            <div className="section-one col-3">
              <div className="head-row row">
                {/* Nazwa roty */}

                <div className="name col-2 elem">{rota.name}</div>
                {/* Ratownicy przypisani do roty */}

                <div className="col-10 flex-column">
                  <div className="rota-top row elem-row">
                    <div className="col-6 elem">Od wejścia:</div>
                    <div className="col-6 elem">{rotaTimerCount(index)}</div>
                  </div>
                  <div className="rota-bot row elem-row">
                    <div className="col elem">{rota.rescuers[0].name}</div>
                  </div>
                  <div className="rota-bot w-100 row">
                    <div className="col elem">{rota.rescuers[1].name}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="section-two col-2">
              <div className="head-row row">
                {/* Obecne ciśnienie */}

                <DataTripleEstimatingColumn
                  colWidth={4}
                  time={"-"}
                  pressure1={
                    !rota.timestamps.OUT &&
                    rota.timestamps.IN &&
                    (toUsePressureCount(index, 0) + pressureReserve < 0
                      ? 0
                      : toUsePressureCount(index, 0) + pressureReserve)
                  }
                  pressure2={
                    !rota.timestamps.OUT &&
                    rota.timestamps.IN &&
                    (toUsePressureCount(index, 1) + pressureReserve < 0
                      ? 0
                      : toUsePressureCount(index, 1) + pressureReserve)
                  }
                />
                {/* Jednostka miary */}

                <DataTripleStaticColumn
                  className="unit"
                  colWidth={2}
                  time={"-"}
                  pressure1={"Bar"}
                  pressure2={"Bar"}
                />
                {/* Wejście do strefy zagrożenia */}

                <DataTripleColumn
                  // type 1 wyswietla zwykla godzine i cisnienie jest divem
                  colWidth={6}
                  stateEditStart={1}
                  rotaState={rota.currentState}
                  type={1}
                  action={() => {
                    dispatch(rotaTimeIn(index));
                    dispatch(
                      addAvgPressureConsumption(
                        index,
                        staticAvgPressureConsumption
                      )
                    );
                    dispatch(saveTable());
                  }}
                  text={"wejdź"}
                  time={rota.timestamps.IN}
                  pressure1={rota.rescuers[0].IN}
                  pressure2={rota.rescuers[1].IN}
                  finished={table.finished}
                />
              </div>
            </div>
            <div className="section-three col-2">
              {/* Kontrola ciśnienia roty */}

              <div className="head-row k-row">
                {rota.timestamps.k.map((elem, idx) => {
                  return (
                    <DataTripleColumnK
                      rota={rota.name}
                      key={idx}
                      stateEditStart={2}
                      rotaState={rota.currentState}
                      prevK={rota.timestamps.k[idx - 1]}
                      currentK={rota.timestamps.k[idx]}
                      currentIdx={idx}
                      action={(p1, p2) => {
                        if (!p1 || !p2) {
                          return;
                        }
                        if (p1 <= 0 || p2 <= 0) {
                          return;
                        }
                        if (
                          idx === 0 &&
                          (p1 >= rota.rescuers[0].IN ||
                            p2 >= rota.rescuers[1].IN)
                        ) {
                          return;
                        }
                        if (
                          idx > 0 &&
                          (p1 >= rota.rescuers[0].k[idx - 1] ||
                            p2 >= rota.rescuers[1].k[idx - 1])
                        ) {
                          return;
                        }

                        dispatch(rotaPressureK(index, 0, idx, p1));
                        dispatch(rotaPressureK(index, 1, idx, p2));

                        let rescuerOneFirstK =
                          rota.rescuers[0].IN - rota.rescuers[0].k[0];
                        let rescuerTwoFirstK =
                          rota.rescuers[1].IN - rota.rescuers[1].k[0];
                        let rescuerOneK =
                          rota.rescuers[0].k[idx - 1] - rota.rescuers[0].k[idx];
                        let rescuerTwoK =
                          rota.rescuers[1].k[idx - 1] - rota.rescuers[1].k[idx];

                        if (idx === 0) {
                          rescuerOneFirstK = rota.rescuers[0].IN - p1;
                          rescuerTwoFirstK = rota.rescuers[1].IN - p2;
                        }

                        if (idx > 0) {
                          rescuerOneK = rota.rescuers[0].k[idx - 1] - p1;
                          rescuerTwoK = rota.rescuers[1].k[idx - 1] - p2;
                        }

                        if (rota.timestamps.k[0] === null) {
                          dispatch(
                            addAvgPressureConsumption(
                              index,
                              countAvgPressureConsumption(
                                rescuerOneFirstK >= rescuerTwoFirstK
                                  ? rescuerOneFirstK
                                  : rescuerTwoFirstK,
                                (dayjs().unix() - rota.timestamps.IN) / 60
                              )
                            )
                          );
                        }

                        if (rota.timestamps.k[0] !== null) {
                          dispatch(
                            addAvgPressureConsumption(
                              index,
                              countAvgPressureConsumption(
                                rescuerOneK >= rescuerTwoK
                                  ? rescuerOneK
                                  : rescuerTwoK,
                                (dayjs().unix() - rota.timestamps.k[idx - 1]) /
                                  60
                              )
                            )
                          );
                        }
                        dispatch(rotaTimeK(index, idx));
                        dispatch(saveTable());
                      }}
                      text={"+"}
                      time={
                        rota.timestamps.k[idx] === null
                          ? null
                          : rota.timestamps.k[idx] - rota.timestamps.IN
                      }
                      pressure1={
                        rota.rescuers[0].k[idx] === null
                          ? ""
                          : rota.rescuers[0].k[idx]
                      }
                      pressure2={
                        rota.rescuers[1].k[idx] === null
                          ? ""
                          : rota.rescuers[1].k[idx]
                      }
                      finished={table.finished}
                    />
                  );
                })}
              </div>
            </div>
            <div className="section-four col-4">
              <div className="head-row row">
                {/* Wyjście ze strefy zagrożenia */}

                <DataTripleColumn
                  colWidth={4}
                  stateEditStart={2}
                  rotaState={rota.currentState}
                  type={2}
                  action={(p1, p2) => {
                    if (!p1 || !p2) {
                      return;
                    }
                    if (p1 <= 0 || p2 <= 0) {
                      return;
                    }

                    if (
                      p1 >= rota.rescuers[0].IN ||
                      p2 >= rota.rescuers[1].IN
                    ) {
                      return;
                    }

                    const filteredK = rota.timestamps.k.filter(
                      (k) => k !== null
                    );
                    const lastKIndex = filteredK.length - 1;

                    if (
                      p1 >= rota.rescuers[0].k[lastKIndex] ||
                      p2 >= rota.rescuers[1].k[lastKIndex]
                    ) {
                      return;
                    }

                    dispatch(rotaPressureOut(index, 0, p1));
                    dispatch(rotaPressureOut(index, 1, p2));
                    dispatch(rotaExitTime(index, exitTime(index)));

                    if (rota.timestamps.k.some((el) => el !== null)) {
                      const rescuerOne = rota.rescuers[0].k[lastKIndex] - p1;
                      const rescuerTwo = rota.rescuers[1].k[lastKIndex] - p2;
                      dispatch(
                        addAvgPressureConsumption(
                          index,
                          countAvgPressureConsumption(
                            rescuerOne >= rescuerTwo ? rescuerOne : rescuerTwo,
                            (dayjs().unix() - rota.timestamps.k[lastKIndex]) /
                              60
                          )
                        )
                      );
                    } else {
                      const rescuerOne = rota.rescuers[0].IN - p1;
                      const rescuerTwo = rota.rescuers[1].IN - p2;

                      dispatch(
                        addAvgPressureConsumption(
                          index,
                          countAvgPressureConsumption(
                            rescuerOne >= rescuerTwo ? rescuerOne : rescuerTwo,
                            (dayjs().unix() - rota.timestamps.IN) / 60
                          )
                        )
                      );
                    }

                    dispatch(rotaTimeOut(index));
                    dispatch(trimUnusedK(index));
                    clearMuteButton(index);
                    dispatch(saveTable());
                  }}
                  text={"wyjdź"}
                  time={
                    rota.timestamps.OUT === null
                      ? null
                      : rota.timestamps.OUT - rota.timestamps.IN
                  }
                  pressure1={
                    rota.rescuers[0].OUT === null ? "" : rota.rescuers[0].OUT
                  }
                  pressure2={
                    rota.rescuers[1].OUT === null ? "" : rota.rescuers[1].OUT
                  }
                  finished={table.finished}
                />
                {/* Szacowana godzina wyjścia ze strefy zagrożenia */}

                <div className="col-4 exit-time">
                  {handleDisplayExitTime(index)}
                </div>

                {/* Czas i ciśnienie do wykorzystania z rezerwą */}

                <DataTripleEstimatingColumn
                  warning={handleTimeWarning(index)[1]}
                  colWidth={4}
                  time={
                    !rota.timestamps.OUT &&
                    rota.timestamps.IN &&
                    toUseTimerCount(index)
                  }
                  pressure1={
                    !rota.timestamps.OUT &&
                    rota.timestamps.IN &&
                    (toUsePressureCount(index, 0) < 0
                      ? 0
                      : toUsePressureCount(index, 0))
                  }
                  pressure2={
                    !rota.timestamps.OUT &&
                    rota.timestamps.IN &&
                    toUsePressureCount(index, 1) < 0
                      ? 0
                      : toUsePressureCount(index, 1)
                  }
                />
              </div>
            </div>
            <div className="section-five col-1">
              {/* Przycisk usuń rotę */}

              {table.finished == 0 && (
                <TableButton
                  text={"Usuń Rote"}
                  action={() => {
                    dispatch(removeRota(rota.name));
                    dispatch(saveTable());
                  }}
                  disabled={rota.currentState !== 1}
                />
              )}
              {/* Przycisk kontrola roty przed wejściem */}

              <TableButton
                text={"Kontrola"}
                action={() => {
                  setInspectionModal({
                    ...inspectionModal,
                    active: true,
                    rotaIndex: index,
                  });
                }}
              />
              {/* Przycisk dodaj punkt kontrolny ciśnienia roty */}

              {table.finished == 0 && (
                <TableButton
                  text={"Dodaj pkt kontrolny"}
                  action={() => {
                    dispatch(rotaAddK(index));
                  }}
                  disabled={
                    rota.currentState == 3 || rota.timestamps.k.length > 3
                  }
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
