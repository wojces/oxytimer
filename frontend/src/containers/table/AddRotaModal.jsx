import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { addRota, saveTable } from "../../features/table/tableSlice";
import { useDispatch, useSelector } from "react-redux";
import { Rescuer } from "../../model/rescuer";

export default function AddRotaModal({
  modalIsVisible,
  closeModal,
  rescuersArray,
  usedRescuers,
  rit,
  ritExist,
}) {
  const dispatch = useDispatch();

  const rotaIndex = useSelector((state) => state.table.table?.rotaList?.length);

  function rotaName() {
    if (rit) {
      return "RIT";
    } else if (ritExist) {
      return "R" + rotaIndex;
    } else {
      return "R" + (rotaIndex + 1);
    }
  }

  const [temporaryRescuers, setTemporaryRescuers] = useState(false);
  const [rescuerOneId, setRescuerOneId] = useState(null);
  const [rescuerTwoId, setRescuerTwoId] = useState(null);

  const [rescuerOnePressure, setRescuerOnePressure] = useState(null);
  const [rescuerTwoPressure, setRescuerTwoPressure] = useState(null);

  const [tempRescuerOne, setTempRescuerOne] = useState({
    firstName: "",
    lastName: "",
    pressure: "",
  });

  const [tempRescuerTwo, setTempRescuerTwo] = useState({
    firstName: "",
    lastName: "",
    pressure: "",
  });

  function clearListRescuers() {
    setRescuerOneId(null);
    setRescuerTwoId(null);
  }

  function clearTempRescuers() {
    setTempRescuerOne({
      firstName: "",
      lastName: "",
      pressure: "",
    });
    setTempRescuerTwo({
      firstName: "",
      lastName: "",
      pressure: "",
    });
    setTemporaryRescuers(false);
  }

  let rescuers = rescuersArray.map((resc) => {
    return new Rescuer(resc);
  });

  function isRescuerUsed(id) {
    return usedRescuers.includes(id);
  }

  function isRescuerSelected(id) {
    if (rescuerOneId != null && rescuerTwoId == null) {
      return rescuerOneId == id;
    } else if (rescuerTwoId != null && rescuerOneId == null) {
      return rescuerTwoId == id;
    } else if (rescuerOneId != null && rescuerTwoId != null) {
      return rescuerOneId == id || rescuerTwoId == id;
    }
  }

  function findRescuerById(id) {
    return rescuersArray.find((resc) => resc.id_rescuer == id);
  }

  function handleRescuerOnePressure(id) {
    if (rescuerOnePressure != null) {
      return rescuerOnePressure;
    } else {
      return findRescuerById(id).in_pressure;
    }
  }
  function handleRescuerTwoPressure(id) {
    if (rescuerTwoPressure != null) {
      return rescuerTwoPressure;
    } else {
      return findRescuerById(id).in_pressure;
    }
  }

  function checkForEmptyInputs(obj) {
    for (let key in obj) {
      if (obj[key].trim() === "") {
        return true;
      }
    }
    return false;
  }

  function inputsValidCheck() {
    if (
      !temporaryRescuers &&
      (rescuerOnePressure < 0 ||
        rescuerTwoPressure < 0 ||
        rescuerOneId === null ||
        rescuerTwoId === null)
    ) {
      return true;
    }

    if (
      temporaryRescuers &&
      (checkForEmptyInputs(tempRescuerOne) ||
        checkForEmptyInputs(tempRescuerTwo))
    ) {
      return true;
    }

    if (
      temporaryRescuers &&
      (Number(tempRescuerOne.pressure) <= 0 ||
        Number(tempRescuerTwo.pressure) <= 0)
    ) {
      return true;
    }

    return false;
  }

  return (
    <>
      <Modal size="lg" show={modalIsVisible} onHide={() => closeModal()}>
        <Modal.Header closeButton>
          <Modal.Title>Dodajesz Rote: {rotaName()}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="rescuer ms-3">
            <div className="mb-3">
              <label className="form-label fw-bold fs-5">Ratownik 1</label>
            </div>
            {!temporaryRescuers && (
              <div>
                <div className="mb-3 row">
                  <label className="col-sm-2 col-form-label fw-bold">
                    Nazwa
                  </label>
                  <div className="col-sm-10">
                    <select
                      className="form-select"
                      onChange={(e) => setRescuerOneId(e.target.value)}>
                      <option defaultValue={""} hidden>
                        Wybierz ratownika...
                      </option>
                      {rescuers.map((resc, index) => {
                        return (
                          !isRescuerUsed(resc.idRescuer) && (
                            <option
                              value={resc.idRescuer}
                              key={resc.idRescuer}
                              disabled={isRescuerSelected(resc.idRescuer)}>
                              {resc.firstName + " " + resc.lastName}
                            </option>
                          )
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-2 col-form-label fw-bold">
                    Ciśnienie
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="number"
                      className="form-control"
                      defaultValue={findRescuerById(rescuerOneId)?.in_pressure}
                      onChange={(e) => setRescuerOnePressure(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            {temporaryRescuers && (
              <div>
                <div className="mb-3 row">
                  <label className="col-sm-2 col-form-label fw-bold">
                    Nazwa
                  </label>
                  <div className="col-sm-5">
                    <input
                      type="text"
                      placeholder="imie..."
                      className="form-control"
                      value={tempRescuerOne.firstName}
                      onChange={(e) =>
                        setTempRescuerOne({
                          ...tempRescuerOne,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-sm-5">
                    <input
                      type="text"
                      placeholder="nazwisko..."
                      className="form-control"
                      value={tempRescuerOne.lastName}
                      onChange={(e) =>
                        setTempRescuerOne({
                          ...tempRescuerOne,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-2 col-form-label fw-bold">
                    Ciśnienie
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="number"
                      className="form-control"
                      value={tempRescuerOne.pressure}
                      onChange={(e) =>
                        setTempRescuerOne({
                          ...tempRescuerOne,
                          pressure: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="rescuer ms-3 mt-5">
            <div className="mb-3">
              <label className="form-label fw-bold fs-5">Ratownik 2</label>
            </div>
            {!temporaryRescuers && (
              <div>
                <div className="mb-3 row">
                  <label className="col-sm-2 col-form-label fw-bold">
                    Nazwa
                  </label>
                  <div className="col-sm-10">
                    <select
                      className="form-select"
                      onChange={(e) => setRescuerTwoId(e.target.value)}>
                      <option defaultValue={""} hidden>
                        Wybierz ratownika...
                      </option>
                      {rescuers.map((resc, index) => {
                        return (
                          !isRescuerUsed(resc.idRescuer) && (
                            <option
                              value={resc.idRescuer}
                              key={resc.idRescuer}
                              disabled={isRescuerSelected(resc.idRescuer)}>
                              {resc.firstName + " " + resc.lastName}
                            </option>
                          )
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-2 col-form-label fw-bold">
                    Ciśnienie
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="number"
                      className="form-control"
                      defaultValue={findRescuerById(rescuerTwoId)?.in_pressure}
                      onChange={(e) => setRescuerTwoPressure(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            {temporaryRescuers && (
              <div>
                <div className="mb-3 row">
                  <label className="col-sm-2 col-form-label fw-bold">
                    Nazwa
                  </label>
                  <div className="col-sm-5">
                    <input
                      type="text"
                      placeholder="imie..."
                      className="form-control"
                      value={tempRescuerTwo.firstName}
                      onChange={(e) =>
                        setTempRescuerTwo({
                          ...tempRescuerTwo,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-sm-5">
                    <input
                      type="text"
                      placeholder="nazwisko..."
                      className="form-control"
                      value={tempRescuerTwo.lastName}
                      onChange={(e) =>
                        setTempRescuerTwo({
                          ...tempRescuerTwo,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-2 col-form-label fw-bold">
                    Ciśnienie
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="number"
                      className="form-control"
                      value={tempRescuerTwo.pressure}
                      onChange={(e) =>
                        setTempRescuerTwo({
                          ...tempRescuerTwo,
                          pressure: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-start">
          <div className="form-check form-switch me-auto">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              checked={temporaryRescuers}
              onChange={() => {
                setRescuerOneId(null);
                setRescuerTwoId(null);
                setTemporaryRescuers(!temporaryRescuers);
              }}
            />
            <label className="form-check-label">Tymczasowi Ratownicy</label>
          </div>
          <Button
            className="px-3"
            onClick={() => {
              if (inputsValidCheck()) {
                return;
              }

              if (!temporaryRescuers) {
                dispatch(
                  addRota(
                    rotaName(),
                    findRescuerById(rescuerOneId)?.first_name +
                      " " +
                      findRescuerById(rescuerOneId).last_name,
                    handleRescuerOnePressure(rescuerOneId),
                    findRescuerById(rescuerTwoId).first_name +
                      " " +
                      findRescuerById(rescuerTwoId).last_name,
                    handleRescuerTwoPressure(rescuerTwoId),
                    rescuerOneId,
                    rescuerTwoId
                  )
                );
              }

              if (temporaryRescuers) {
                dispatch(
                  addRota(
                    rotaName(),
                    tempRescuerOne.firstName + " " + tempRescuerOne.lastName,
                    Number(tempRescuerOne.pressure),
                    tempRescuerTwo.firstName + " " + tempRescuerTwo.lastName,
                    Number(tempRescuerTwo.pressure)
                  )
                );
              }

              dispatch(saveTable());
              clearTempRescuers();
              clearListRescuers();
              setRescuerOnePressure(null);
              setRescuerTwoPressure(null);
              closeModal();
            }}>
            Zapisz
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              clearTempRescuers();
              clearListRescuers();
              setRescuerOnePressure(null);
              setRescuerTwoPressure(null);
              closeModal();
            }}>
            Cofnij
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
