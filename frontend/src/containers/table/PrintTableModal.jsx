import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function PrintTableModal({
  modalIsVisible,
  closeModal,
  printTable,
}) {
  return (
    <Modal
      show={modalIsVisible}
      onHide={() => closeModal()}
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Wydrukować tabelę?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="my-2">
          Kliknięcie przycisku "Drukuj" otworzy plik PDF w nowej karcie.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            printTable();
            closeModal();
          }}>
          Drukuj
        </Button>
        <Button variant="secondary" onClick={() => closeModal()}>
          Zamknij
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
