import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { createRescuer } from "../../api/rescuers";

export default function AddRescuerModal({ modalIsVisible, closeModal }) {
  const [rescuer, setRescuer] = useState({
    firstName: "",
    lastName: "",
    unit: "",
    location: "",
    commanderFirstName: "",
    commanderLastName: "",
    IN: null,
  });

  function clearRescuerData() {
    setRescuer({
      firstName: "",
      lastName: "",
      unit: "",
      location: "",
      commanderFirstName: "",
      commanderLastName: "",
      IN: null,
    });
  }

  function inputsValidCheck() {
    if (rescuer.firstName.trim() === "" || rescuer.lastName.trim() === "")
      return true;
    if (Number(rescuer.IN <= 0)) return true;
  }

  async function postData() {
    if (inputsValidCheck()) return;

    const response = await createRescuer(rescuer);
    {
      response.status == 200 && clearRescuerData();
    }
    {
      response.status == 200 && closeModal();
    }
  }

  return (
    <>
      <Modal size="lg" show={modalIsVisible} onHide={() => closeModal()}>
        <Modal.Header closeButton>
          <Modal.Title>Dodaj Ratownika</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mt-4 p-4">
            <div className="mb-3 row">
              <label className="col-sm-2 col-form-label">Nazwa*</label>
              <div className="col-sm-5">
                <input
                  type="text"
                  placeholder="imie..."
                  className="form-control"
                  value={rescuer.firstName}
                  onChange={(e) =>
                    setRescuer({ ...rescuer, firstName: e.target.value })
                  }
                />
              </div>
              <div className="col-sm-5">
                <input
                  type="text"
                  placeholder="nazwisko..."
                  className="form-control"
                  value={rescuer.lastName}
                  onChange={(e) =>
                    setRescuer({ ...rescuer, lastName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-2 col-form-label">Jednostka</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  value={rescuer.unit}
                  onChange={(e) =>
                    setRescuer({ ...rescuer, unit: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-2 col-form-label">Lokalizacja</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  value={rescuer.location}
                  onChange={(e) =>
                    setRescuer({ ...rescuer, location: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-2 col-form-label">Dowódca</label>
              <div className="col-sm-5">
                <input
                  type="text"
                  className="form-control"
                  placeholder="imie..."
                  value={rescuer.commanderFirstName}
                  onChange={(e) =>
                    setRescuer({
                      ...rescuer,
                      commanderFirstName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-sm-5">
                <input
                  type="text"
                  className="form-control"
                  placeholder="nazwisko..."
                  value={rescuer.commanderLastName}
                  onChange={(e) =>
                    setRescuer({
                      ...rescuer,
                      commanderLastName: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-2 col-form-label">Ciśnienie*</label>
              <div className="col-sm-10">
                <input
                  type="number"
                  className="form-control"
                  value={rescuer.IN != null ? rescuer.IN : ""}
                  onChange={(e) =>
                    setRescuer({ ...rescuer, IN: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm mt-2">*pola wymagane</div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="submit"
            className="px-3"
            onClick={() => {
              postData();
            }}>
            Dodaj
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              closeModal();
              clearRescuerData();
            }}>
            Cofnij
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
