import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function EndModal({ modalIsVisible, closeModal, finishTable }) {
  return (
    <Modal
      show={modalIsVisible}
      onHide={() => closeModal()}
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Zakończ akcję
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="my-2">
          Zakończenie akcji spowoduje brak możliwości edycji danych. Akcja
          będzie możliwa tylko do odczytu
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => finishTable()}>Zakończ</Button>
        <Button variant="secondary" onClick={() => closeModal()}>
          Cofnij
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
