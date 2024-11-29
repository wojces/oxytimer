import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { changeUserPassword } from "../../api/user";

export default function EditPasswordModal({ modalIsVisible, closeModal }) {
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    newRepeatedPassword: "",
  });

  function clearPasswordInputs() {
    setPassword({
      oldPassword: "",
      newPassword: "",
      newRepeatedPassword: "",
    });
  }

  const [validMessage, setValidMessage] = useState("");

  async function changePassword() {
    if (
      !password.newPassword ||
      !password.oldPassword ||
      !password.newRepeatedPassword
    ) {
      setValidMessage("Uzupełnij wszystkie pola");
      return;
    }
    if (password.newPassword === password.oldPassword) {
      setValidMessage("Nowe hasło jest takie samo jak stare");
      return;
    }
    if (password.newPassword !== password.newRepeatedPassword) {
      setValidMessage("Powtórzone hasło jest nieprawidłowe");
      return;
    }

    try {
      const response = await changeUserPassword({
        oldPassword: password.oldPassword,
        newPassword: password.newPassword,
      });

      {
        response.status == 200 && clearPasswordInputs();
      }
      {
        response.status == 200 && closeModal();
      }

      setValidMessage("");
    } catch (error) {
      // console.log(error);
      if (error.response.data.message === "Password is not valid") {
        setValidMessage("Podane stare hasło jest nieprawidłowe");
        return;
      }
    }
  }

  function handleSubmit() {
    changePassword();
  }

  return (
    <>
      <Modal size="lg" show={modalIsVisible} onHide={() => closeModal()}>
        <Modal.Header closeButton>
          <Modal.Title>Ustaw nowe hasło</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mt-4 p-4">
            <div className="mb-3 row">
              <label className="col-sm-2 col-form-label">Stare hasło</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  value={password.oldPassword}
                  onChange={(e) =>
                    setPassword({ ...password, oldPassword: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label className="col-sm-2 col-form-label">Nowe hasło</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  value={password.newPassword}
                  onChange={(e) =>
                    setPassword({ ...password, newPassword: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="row">
              <label className="col-sm-2 col-form-label">
                Powtórz nowe hasło
              </label>
              <div className="col-sm-10 mt-2">
                <input
                  type="text"
                  className="form-control"
                  value={password.newRepeatedPassword}
                  onChange={(e) =>
                    setPassword({
                      ...password,
                      newRepeatedPassword: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <div>
            <p className="text-center text-danger">{validMessage}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="submit"
            className="px-3"
            onClick={() => {
              handleSubmit();
            }}>
            Zapisz
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              closeModal();
              clearPasswordInputs();
            }}>
            Cofnij
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
