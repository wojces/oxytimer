import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function ControlModal({
  modalIsVisible,
  closeModal,
  inspection,
  updateInspection,
}) {
  return (
    <>
      <Modal size="lg" show={modalIsVisible} onHide={() => closeModal()}>
        <Modal.Header closeButton>
          <Modal.Title>Kontrola Przed Wejściem</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="list-group">
            <button
              type="button"
              className="list-group-item list-group-item-action"
              style={{
                backgroundColor: inspection()?.signals == true ? "#C3E9DC" : "",
              }}
              disabled={inspection()?.signals == true}
              onClick={() => updateInspection("signals", true)}>
              S - SYGNALIZATORY
            </button>
            <button
              type="button"
              className="list-group-item list-group-item-action"
              style={{
                backgroundColor: inspection()?.air == true ? "#C3E9DC" : "",
              }}
              disabled={inspection()?.air == true}
              onClick={() => updateInspection("air", true)}>
              P - POWIETRZE
            </button>
            <button
              type="button"
              className="list-group-item list-group-item-action"
              style={{
                backgroundColor: inspection()?.lights == true ? "#C3E9DC" : "",
              }}
              disabled={inspection()?.lights == true}
              onClick={() => updateInspection("lights", true)}>
              O - OŚWIETLENIE
            </button>
            <button
              type="button"
              className="list-group-item list-group-item-action"
              style={{
                backgroundColor:
                  inspection()?.communication == true ? "#C3E9DC" : "",
              }}
              disabled={inspection()?.communication == true}
              onClick={() => updateInspection("communication", true)}>
              Ł - ŁĄCZNOŚĆ
            </button>
            <button
              type="button"
              className="list-group-item list-group-item-action"
              style={{
                backgroundColor:
                  inspection()?.equipment == true ? "#C3E9DC" : "",
              }}
              disabled={inspection()?.equipment == true}
              onClick={() => updateInspection("equipment", true)}>
              E - EKWIPUNEK
            </button>
            <button
              type="button"
              className="list-group-item list-group-item-action"
              style={{
                backgroundColor:
                  inspection()?.entryReport == true ? "#C3E9DC" : "",
              }}
              disabled={inspection()?.entryReport == true}
              onClick={() => updateInspection("entryReport", true)}>
              M - MELDUNEK O WEJŚCIU
            </button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              closeModal();
            }}>
            Zamknij
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
