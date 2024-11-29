import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { clearTable } from "../../features/table/tableSlice";
import { setCurrentView } from "../../features/app/appSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CloseTableModal({
  modalIsVisible,
  closeModal,
  // removeFromLocalStorage,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Modal
      show={modalIsVisible}
      onHide={() => closeModal()}
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Zamknąć tablicę?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="my-2">Niezapisane dane zostaną utracone.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            // removeFromLocalStorage();
            dispatch(clearTable());
            dispatch(setCurrentView("NewTable"));
            navigate("/");
          }}>
          Zamknij tablicę
        </Button>
        <Button variant="secondary" onClick={() => closeModal()}>
          Cofnij
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
