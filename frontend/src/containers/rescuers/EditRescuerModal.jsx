import axios from "axios";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { editRescuer } from "../../api/rescuers";

export default function EditRescuerModal({
  modalIsVisible,
  closeModal,
  editedRescuer,
  rescuerId,
}) {
  const [rescuer, setRescuer] = useState({
    firstName: "",
    lastName: "",
    unit: "",
    location: "",
    commanderFirstName: "",
    commanderLastName: "",
    IN: null,
  });

  useEffect(() => {
    fillInEditedRescuerData();
  }, []);

  function fillInEditedRescuerData() {
    setRescuer({
      firstName: editedRescuer.first_name,
      lastName: editedRescuer.last_name,
      unit: editedRescuer.unit,
      location: editedRescuer.location,
      commanderFirstName: editedRescuer.commander_first_name,
      commanderLastName: editedRescuer.commander_last_name,
      IN: editedRescuer.in_pressure,
    });
  }

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

  async function editRescuerData() {
    const response = await editRescuer(rescuerId, rescuer);
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
          <Modal.Title>Edytuj Ratownika</Modal.Title>
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
                  value={rescuer.firstName ? rescuer.firstName : ""}
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
                  value={rescuer.lastName ? rescuer.lastName : ""}
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
                  value={rescuer.unit ? rescuer.unit : ""}
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
                  value={rescuer.location ? rescuer.location : ""}
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
                  value={
                    rescuer.commanderFirstName ? rescuer.commanderFirstName : ""
                  }
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
                  value={
                    rescuer.commanderLastName ? rescuer.commanderLastName : ""
                  }
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
              editRescuerData();
            }}>
            Zapisz
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
