import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { deleteRescuer } from "../../api/rescuers";

export default function EndModal({
  modalIsVisible,
  closeModal,
  rescuerId,
  deletedRescuer,
}) {
  async function deleteRescuerData() {
    const response = await deleteRescuer(rescuerId);
    {
      response.status == 200 && closeModal();
    }
  }
  return (
    <Modal
      show={modalIsVisible}
      onHide={() => closeModal()}
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Usunąć ratownika?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="my-2 t">
          Imię i nazwisko:{" "}
          <strong>
            {deletedRescuer.first_name + " " + deletedRescuer.last_name}
          </strong>
        </p>
        <p className="my-2">
          Po kliknięciu 'usuń' nastąpi trwałe usunięcie ratownika. Przywrócenie
          nie będzie możliwe.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => deleteRescuerData()}>Usuń</Button>
        <Button variant="secondary" onClick={() => closeModal()}>
          Cofnij
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
